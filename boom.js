import * as THREE from 'three';
import HullComponent from './hull_component.js';
import * as materials from './materials.js';

export default class Boom extends HullComponent {
  constructor() {
    super();

    this.group = new THREE.Group();
    this.dimensions = {};

    this.boomGeometry = {};
    this.noseGeometry = {};

    this.boomMesh = {};
    this.noseMesh = {};

    return this;
  }

  update({ length,
    width,
    widthRatio,
    rotation=0,
    segments=32,
    skew=0,
    materialIndex=0,
  }) {

    this.clear();

    // boom body
    var boomPoints = [
      new THREE.Vector2( 0.0, 0.0 )
    ];

    var boomPointCount = 5.0;
    var r = 0.0;
    
    for ( var i = 0; i <= boomPointCount; i++ ) {  
      r = (Math.sin(i / boomPointCount * Math.PI / 2.0) * 0.5 + 0.5) * width * 1.1;
      boomPoints.push(
        new THREE.Vector2(
          r,
          i / boomPointCount * length - 0.0
        )
      );
    }

    // nose
    var nosePointCount = 32.0;
    var nosePoints = [];
    for ( var i = nosePointCount; i >= 0; i-- ) {
      nosePoints.push(
        new THREE.Vector2(
          Math.pow(i / nosePointCount, 0.4) * width * 1.1,
          length + (1.0 - i / nosePointCount) * width  * length/5
        )
      );
    }

    this.boomGeometry = new THREE.LatheGeometry(boomPoints, segments);
    this.boomGeometry.scale(widthRatio, 1.1, 1.1);
    this.boomGeometry.rotateY(rotation);

    this.noseGeometry = new THREE.LatheGeometry(nosePoints, segments);
    this.noseGeometry.scale(widthRatio, 1.1, 1.1);
    this.noseGeometry.rotateY(rotation);

    this.boomMesh = new THREE.Mesh( this.boomGeometry, materials.engMaterial[materialIndex] );
    this.noseMesh = new THREE.Mesh( this.noseGeometry, materials.engMaterial[materialIndex] );

    const Szy = skew;
    const matrix = new THREE.Matrix4();
    matrix.set(   1,     0,    0,  0,
                  0,     1,  Szy,  0,
                  0,     0,   1,   0,
                  0,     0,   0,   1  );
    this.boomGeometry.applyMatrix4( matrix );
    this.noseGeometry.applyMatrix4( matrix );

    this.group.add( this.boomMesh );
    this.group.add( this.noseMesh );

    this.computeBoundingBox(this.boomGeometry);
  }

  computeBoundingBox(measuredGeom){
    measuredGeom.computeBoundingBox();
    this.dimensions.x = measuredGeom.boundingBox.max.x - measuredGeom.boundingBox.min.x;
    this.dimensions.y = measuredGeom.boundingBox.max.y - measuredGeom.boundingBox.min.y;
    this.dimensions.z = measuredGeom.boundingBox.max.z - measuredGeom.boundingBox.min.z;
  }

  clear(){
    if (this.boomGeometry['dispose']) {
      this.boomGeometry.dispose();
      this.noseGeometry.dispose();
      for (var i = this.group.children.length - 1; i >= 0; i--) {
        this.group.remove(this.group.children[i]);
      }
    }
  }
}