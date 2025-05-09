import * as THREE from 'three';
import HullComponent from './hull_component.js';
import * as materials from './materials.js';

export default class Boom extends HullComponent {
  constructor({name}) {
    super();

    this.group = new THREE.Group();
    this.dimensions = {};

    this.boomGeometry = {};
    this.noseGeometry = {};

    this.boomMesh = {};
    this.noseMesh = {};

    this.name = name;

    return this;
  }

  update({ length,
    width,
    widthRatio,
    rotation=0,
    segments=32,
    skew=0,
    materialIndex=0,
    undercutStart=0.0,
    undercut=0.0,
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

    const positions = this.boomGeometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      let y = positions[i + 1]; // Get Y value
      let z = positions[i + 2]; // Get Z value
      let zNormalized = z / width;
      let yNormalized = y / length;
      let compression = 1.0;
      let offsetZ = 0.0;
      let extensionY = 0.0;
      if (yNormalized < (1.0 - undercutStart) && zNormalized >= 0.0) {
        let compressionAmount = 1.0 + (yNormalized - (1-undercutStart))/(1-undercutStart);
        compressionAmount = compressionAmount**2.0 + (1.0 - undercut);
        compression = Math.min(1.0, compressionAmount);
      }
      let newZ = z * compression; 
      positions[i + 2] = newZ;
    }

    this.boomGeometry.scale(widthRatio, 1.1, 1.1);
    this.boomGeometry.rotateY(rotation);

    this.noseGeometry = new THREE.LatheGeometry(nosePoints, segments);
    this.noseGeometry.scale(widthRatio, 1.1, 1.1);
    this.noseGeometry.rotateY(rotation);

    this.boomMesh = new THREE.Mesh( this.boomGeometry, materials.engMaterial[materialIndex] );
    this.boomMesh.name = this.name;
    this.noseMesh = new THREE.Mesh( this.noseGeometry, materials.pylonMaterial[materialIndex] );
    this.noseMesh.name = this.name + '_nose';

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