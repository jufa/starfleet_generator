import * as THREE from 'three';
import HullComponent from './hull_component.js';
import * as materials from './materials.js';

export default class Nacelle extends HullComponent {
  constructor() {
    super();

    this.group = new THREE.Group();
    this.dimensions = {};

    this.nacelleGeometry = {};
    this.bussardGeometry = {};

    this.nacelleMesh = {};
    this.bussardMesh = {};

    return this;

  }

  update({ 
    length,
    width,
    widthRatio,
    rotation=0,
    segments=32,
    skew=0,
    materialIndex=0,
  }) {
    
    this.clear();

    // nacelle body
    var nacellePoints = [
      new THREE.Vector2( 0.0, 0.0 )
    ];

    var nacellePointCount = 5.0;
    var r = 0.0;
    
    for ( var i = 0; i <= nacellePointCount; i++ ) {  
      r = (Math.sin(i / nacellePointCount * Math.PI / 2.0) * 0.5 + 0.5) * width * 1.0;
      nacellePoints.push(
        new THREE.Vector2(
          r,
          i / nacellePointCount * length
        )
      );
    }

    // bussard
    var bussardPointCount = 32.0;
    var bussardPoints = [];
    for ( var i = bussardPointCount; i >= 0; i-- ) {
      bussardPoints.push(
        new THREE.Vector2(
          Math.pow(i / bussardPointCount, 0.4) * width * 1.0,
          length + (1.0 - i / bussardPointCount) * width * 1.5
        )
      );
    }

    // bussard inner
    var bussardInnerPoints = [];
    for ( var i = bussardPointCount; i >= 0; i-- ) {
      bussardInnerPoints.push(
        new THREE.Vector2(
          Math.pow(i / bussardPointCount, 0.4) * width * 0.97,
          length + (0.6 - i / bussardPointCount) * width * 2.0
        )
      );
    }
    

    this.nacelleGeometry = new THREE.LatheGeometry(nacellePoints, segments, Math.PI*0);
    this.nacelleGeometry.scale(widthRatio, 1.0, 1.0);
    this.nacelleGeometry.rotateY(rotation);

    this.bussardGeometry = new THREE.LatheGeometry(bussardPoints, segments, Math.PI*0);
    this.bussardGeometry.scale(widthRatio, 1.0, 1.0);
    this.bussardGeometry.rotateY(rotation);

    this.bussardInnerGeometry = new THREE.LatheGeometry(bussardInnerPoints, segments, Math.PI*0);
    this.bussardInnerGeometry.scale(widthRatio, 1.0, 1.0);
    this.bussardInnerGeometry.rotateY(rotation);

    this.nacelleMesh = new THREE.Mesh( this.nacelleGeometry, materials.nacelleMaterial[materialIndex] );
    this.bussardMesh = new THREE.Mesh( this.bussardGeometry, materials.bussardMaterial[materialIndex] );
    this.bussardInnerMaterial = materials.bussardInnerMaterial[materialIndex].clone();
    this.bussardInnerMaterial.emissiveMap = materials.bussardInnerMaterial[materialIndex].emissiveMap.clone();
    this.bussardInnerMesh = new THREE.Mesh( this.bussardInnerGeometry, this.bussardInnerMaterial);

    const Szy = skew;
    const matrix = new THREE.Matrix4();
    matrix.set(   1,     0,    0,  0,
                  0,     1,  Szy,  0,
                  0,     0,   1,   0,
                  0,     0,   0,   1  );
    this.nacelleGeometry.applyMatrix4( matrix );
    this.bussardGeometry.applyMatrix4( matrix );
    this.bussardInnerGeometry.applyMatrix4( matrix );

    this.group.add( this.nacelleMesh );
    this.group.add( this.bussardMesh );
    this.group.add( this.bussardInnerMesh );

    this.computeBoundingBox(this.nacelleGeometry);
  }

  computeBoundingBox(measuredGeom){
    measuredGeom.computeBoundingBox();
    this.dimensions.x = measuredGeom.boundingBox.max.x - measuredGeom.boundingBox.min.x;
    this.dimensions.y = measuredGeom.boundingBox.max.y - measuredGeom.boundingBox.min.y;
    this.dimensions.z = measuredGeom.boundingBox.max.z - measuredGeom.boundingBox.min.z;
  }

  rotateBussard(rotation){
    const worldPos = new THREE.Vector3();
    this.group.getWorldPosition(worldPos);
    const rotationSense = worldPos.x > 0 ? -1 : 1;
    this.bussardInnerMaterial.emissiveMap.offset.x = rotationSense * rotation;
    this.bussardInnerMaterial.emissiveMap.offset.y = rotation/8;
  }

  clear(){
    if (this.nacelleGeometry['dispose']) {
      this.nacelleGeometry.dispose();
      this.bussardGeometry.dispose();
      this.bussardInnerGeometry.dispose();
      for (var i = this.group.children.length - 1; i >= 0; i--) {
        this.group.remove(this.group.children[i]);
      }
    }
  }
}