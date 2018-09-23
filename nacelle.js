import * as THREE from 'three';
import HullComponent from './hull_component.js';

export default class Nacelle extends HullComponent {
  constructor({ material }) {
    super();
    
    this.material = material;
    this.group = new THREE.Group();
    this.dimensions = {};
    
    this.nacelleGeometry = {};
    this.bussardGeometry = {};

    this.nacelleMesh = {};
    this.bussardMesh = {};

    this.bussardMaterial = new THREE.MeshPhongMaterial({ 
      shininess: 100, 
      color: 0x330033,
      emissive: 0xdd0000,
      flatShading: false,
    });
    return this;
  }

  update({ length, width, widthRatio = 1.0 }) {

    this.clear();
    
    // nacelle body
    var nacellePoints = [
      new THREE.Vector2( 0.0, 1.0 )
    ];

    var nacellePointCount = 5.0;
    for ( var i = 0; i <= nacellePointCount; i++ ) {
      nacellePoints.push( 
        new THREE.Vector2( 
          (Math.sin(i / nacellePointCount * Math.PI / 2.0) * 0.7 + 0.3) * width, 
          i / nacellePointCount * length
        )
      );
    }

    // bussard
    var bussardPointCount = 9.0;
    var bussardPoints = []
    for ( var i = bussardPointCount; i >= 0; i-- ) {
      bussardPoints.push(
        new THREE.Vector2(
          Math.pow(i / bussardPointCount, 0.4) * width * 0.9,
          length + (1.0 - i / bussardPointCount) * width * 1.0
        )
      );
    }
    
    this.nacelleGeometry = new THREE.LatheGeometry(nacellePoints, 20);
    this.nacelleGeometry.scale(widthRatio, 1.0, 1.0);

    this.bussardGeometry = new THREE.LatheGeometry(bussardPoints, 20);
    this.bussardGeometry.scale(widthRatio, 1.0, 1.0);

    this.nacelleMesh = new THREE.Mesh( this.nacelleGeometry, this.material );
    this.bussardMesh = new THREE.Mesh( this.bussardGeometry, this.bussardMaterial );

    this.group.add( this.nacelleMesh );
    this.group.add( this.bussardMesh );

    this.computeBoundingBox(this.nacelleGeometry);
  }

  computeBoundingBox(measuredGeom){
    measuredGeom.computeBoundingBox();  
    this.dimensions.x = measuredGeom.boundingBox.max.x - measuredGeom.boundingBox.min.x;
    this.dimensions.y = measuredGeom.boundingBox.max.y - measuredGeom.boundingBox.min.y;
    this.dimensions.z = measuredGeom.boundingBox.max.z - measuredGeom.boundingBox.min.z;
  }

  clear(){
    if (this.nacelleGeometry['dispose']) {
      this.nacelleGeometry.dispose();
      this.bussardGeometry.dispose();
      for (var i = this.group.children.length - 1; i >= 0; i--) {
        this.group.remove(this.group.children[i]);
      }
    }
  }
}