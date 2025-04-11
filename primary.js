import * as THREE from 'three';
import HullComponent from './hull_component.js';

export default class Primary extends HullComponent{
  constructor({ material, bridgeMaterial, notchMaterial }) {
    super();
    this.material = material;
    this.bridgeMaterial = bridgeMaterial;
    this.notchMaterial = notchMaterial;
    this.group = new THREE.Group();
    this.group.rotateX( Math.PI / 2.0); 
    this.geometry = {};
    this.bridgeGeometry = {};
    this.mesh = {};
    this.bridgeMesh = {};
    this.dimensions = {};
    this.stretchFactor = 1.0;

    return this;
  }

  update({
    thickness,
    radius,
    widthRatio,
    bridgeThickness,
    bridgeRadius,
    bridgeWidthRatio,
    bridgeZ,
    bridgeY,
    pointiness, // 0.0-2.0
    notchAngle=0,
    segments=64,
    bridgeSegments=64,
  }) {

    this.clear();

    var points = [];
    const saucerPointCount = 80;
    for ( var i = 0; i <= saucerPointCount; i ++ ) {
      const lowerSquash = (i-10 > saucerPointCount * 0.5) ? 0.85 : 1.0;
      const lowerOffset = (i-10 > saucerPointCount * 0.5) ? 0.0 : 0.0;
      points.push(
        new THREE.Vector2( 
          (Math.sin( i / saucerPointCount * Math.PI ) * radius) ** 0.7 * 2.0,
          (i / saucerPointCount * thickness ) ** lowerSquash
        ) 
      );
    }

    var bridgePoints = [];
    for ( var i = 0; i <= saucerPointCount; i ++ ) {
      bridgePoints.push(
        new THREE.Vector2( 
          (Math.sin( i / saucerPointCount * Math.PI ) * radius * bridgeRadius) ** 0.5 * 3.0,
          i / saucerPointCount * thickness * bridgeThickness
        ) 
      );
    }
    i = bridgePoints.length;
    // bridgePoints[0].y = bridgePoints[1].y;
    // bridgePoints[i-1].y = bridgePoints[i-2].y;

    const foreExclusionAngle = notchAngle;
    this.geometry = new THREE.LatheGeometry(points, segments, Math.PI + foreExclusionAngle, 2.0 * ( Math.PI - foreExclusionAngle) );
    this.geometry.scale(widthRatio, 1.0, 1.0);
    this.computeBoundingBox(this.geometry);
    const lengthZ = this.geometry.boundingBox.max.z - this.geometry.boundingBox.min.z;

    // const s = bridgeWidthRatio;
    // const matrix = new THREE.Matrix4();

    // matrix.set(   1,     0,   0,   0,
    //               0,     1,   0,   0,
    //               0,     0,   1,   0,
    //               0,     0,   0,   1  );
    // this.geometry.applyMatrix4( matrix );

    this.bridgeGeometry = new THREE.LatheGeometry(bridgePoints, bridgeSegments, Math.PI, 2.0 * Math.PI );
    this.bridgeGeometry.scale(bridgeWidthRatio, 1.0, 1.0);
    this.bridgeGeometry.scale(widthRatio * bridgeWidthRatio, 1.0, 1.0);
    this.computeBoundingBox(this.bridgeGeometry);
    // const bridgeLengthZ = this.bridgeGeometry.geometry.max.z - this.bridgeGeometry.boundingBox.min.z;

    // saucer cutout:

    // Create shape from points
    const shape = new THREE.Shape(points);

    // Create flat geometry
    this.notchGeometry = new THREE.ShapeGeometry(shape);
    const notchMaterial = this.notchMaterial;
    const closeMesh1 = new THREE.Mesh(this.notchGeometry, notchMaterial);
    const closeMesh2 = closeMesh1.clone();
    closeMesh1.rotateY( (Math.PI * 0.5) + foreExclusionAngle );
    closeMesh2.rotateY( (Math.PI * 0.5) - foreExclusionAngle );
    closeMesh1.geometry.attributes.position.needsUpdate = true;
    closeMesh2.geometry.attributes.position.needsUpdate = true;

    // egg-distort
    // const positions = this.geometry.vertices;
    const positions = this.geometry.attributes.position.array;
    
    let aftMax = -9999999.0;
    let foreMax = 9999999.0;
    for (let i = 0; i < positions.length; i += 3) {
      let z = positions[i + 2]; // Get Z value
      let zNormalized = z / lengthZ;
      let stretchFactor = Math.pow(1.0 + zNormalized, pointiness);
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
    this.bridgeMesh = new THREE.Mesh( this.bridgeGeometry, this.bridgeMaterial.clone() );
    this.bridgeMesh.position.y = - bridgeZ - ( bridgeThickness * 0.4);
    this.bridgeMesh.position.z = radius * bridgeY;
    
    this.group.add( this.mesh );
    this.group.add( this.bridgeMesh );
    if (notchAngle > 0){
      this.group.add( closeMesh1 );
      this.group.add( closeMesh2 );
    }
    // this.computeBoundingBox(this.geometry);
  }

  computeBoundingBox(measuredGeom) {
    measuredGeom.computeBoundingBox();
    this.dimensions.x = measuredGeom.boundingBox.max.x - measuredGeom.boundingBox.min.x;
    this.dimensions.y = measuredGeom.boundingBox.max.y - measuredGeom.boundingBox.min.y;
    this.dimensions.z = measuredGeom.boundingBox.max.z - measuredGeom.boundingBox.min.z;
  }

  clear(){
    if (this.geometry['dispose']) {
      this.geometry.dispose();
      this.bridgeGeometry.dispose();
      for (var i = this.group.children.length - 1; i >= 0; i--) {
        this.group.remove(this.group.children[i]);
      }
    }
  }
}