import * as THREE from 'three';
import HullComponent from './hull_component.js';

export default class Primary extends HullComponent{
  constructor({ material }) {
    super();
    this.material = material;
    this.group = new THREE.Group();
    this.group.rotateX( Math.PI / 2.0); 
    this.geometry = {};
    this.mesh = {}
    this.dimensions = {};
    this.stretchFactor = 1.0;

    return this;
  }

  update({
    thickness,
    radius,
    widthRatio,
    pointiness, //0.0-2.0
  }) {

    this.clear();

    var points = [];
    const saucerPointCount = 20;
    for ( var i = 0; i <= saucerPointCount; i ++ ) {
      points.push(
        new THREE.Vector2( 
          Math.sin( i / saucerPointCount * Math.PI ) * radius,
          i / saucerPointCount * thickness
        ) 
      );
    }

    const foreExclusionAngle = 0.0;
    this.geometry = new THREE.LatheGeometry(points, 64, Math.PI + foreExclusionAngle, 2.0 * ( Math.PI - foreExclusionAngle) );
    this.geometry.scale(widthRatio, 1.0, 1.0);
    this.computeBoundingBox(this.geometry);
    const lengthZ = this.geometry.boundingBox.max.z - this.geometry.boundingBox.min.z;

    // egg-distort
    // const positions = this.geometry.vertices;
    const positions = this.geometry.attributes.position.array;
    
    let aftMax = -9999999.0;
    let foreMax = 9999999.0;
    for (let i = 0; i < positions.length; i += 3) {
      let z = positions[i + 2]; // Get Z value
      let zNormalized = z / lengthZ;
      const stretchFactor = Math.pow(1.0 + zNormalized, pointiness);
      this.stretchFactor = stretchFactor;
      let newZ = z / stretchFactor; // Stretch along the Z-axis
      positions[i + 2] = newZ; // Update Z position
  
      if (newZ > aftMax) aftMax = newZ;
      if (newZ < foreMax) foreMax = newZ;
    }
    this.dimensions.center = (aftMax + foreMax) / 2.0
    this.dimensions.aft = aftMax;
    this.dimensions.fore = foreMax;
    
    this.geometry.attributes.position.needsUpdate = true;
    this.computeBoundingBox(this.geometry);
    this.mesh = new THREE.Mesh( this.geometry, this.material.clone() );

    // saucer cutout:
    /*
    // Create shape from points
    const shape = new THREE.Shape(points);

    // Create flat geometry
    if (foreExclusionAngle > 0.0) {
      const geometry = new THREE.ShapeGeometry(shape);
      const material = new THREE.MeshStandardMaterial({ color: 0x999999, side: THREE.DoubleSide });
      const closeMesh1 = new THREE.Mesh(geometry, material);
      const closeMesh2 = closeMesh1.clone();
      closeMesh1.rotateY( (Math.PI * 0.5) + foreExclusionAngle );
      closeMesh2.rotateY( (Math.PI * 0.5) - foreExclusionAngle );
      this.group.add( closeMesh1 );
      this.group.add( closeMesh2 );
    };
    */
    this.group.add( this.mesh );
  }

  computeBoundingBox(measuredGeom) {
    measuredGeom.computeBoundingBox();
    this.dimensions.x = measuredGeom.boundingBox.max.x - measuredGeom.boundingBox.min.x;
    this.dimensions.y = measuredGeom.boundingBox.max.y - measuredGeom.boundingBox.min.y;
    this.dimensions.z = measuredGeom.boundingBox.max.z - measuredGeom.boundingBox.min.z;
    // this.dimensions.fore = 
  }

  clear(){
    if (this.geometry['dispose']) {
      this.geometry.dispose();
      for (var i = this.group.children.length - 1; i >= 0; i--) {
        this.group.remove(this.group.children[i]);
      }
    }
  }
}