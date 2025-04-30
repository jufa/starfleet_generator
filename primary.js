import * as THREE from 'three';
import HullComponent from './hull_component.js';
import * as materials from './materials.js';

export default class Primary extends HullComponent{
  constructor() {
    super();
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
    materialIndex=0,
  }) {
    bridgeSegments = segments = 64;

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
    // this.notchGeometry = new THREE.ShapeGeometry(shape);
    // const closeMesh1 = new THREE.Mesh(this.notchGeometry, materials.notchMaterial[materialIndex]);
    // const closeMesh2 = closeMesh1.clone();
    // closeMesh1.rotateY( (Math.PI * 0.5) + foreExclusionAngle );
    // closeMesh2.rotateY( (Math.PI * 0.5) - foreExclusionAngle );
    // closeMesh1.geometry.attributes.position.needsUpdate = true;
    // closeMesh2.geometry.attributes.position.needsUpdate = true;

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

    // next attempt:
    const posAttr = this.geometry.attributes.position;
    const vertices = [];
    for (let i = 0; i < posAttr.count; i++) {
      vertices.push(new THREE.Vector3().fromBufferAttribute(posAttr, i));
    }

    const profileCount = points.length;

    // Get start ring (angle = 0)
    const startRing = [];
    for (let i = 0; i < profileCount; i++) {
      startRing.push(vertices[i]);
    }

    // Get end ring (angle = sweep angle)
    const endRing = [];
    for (let i = 0; i < profileCount; i++) {
      endRing.push(vertices[vertices.length - profileCount + i]);
    }

    const closeMesh1 = new THREE.Mesh(this.createCapGeometry(startRing), materials.notchMaterial[materialIndex] );
    const closeMesh2 = new THREE.Mesh(this.createCapGeometry(endRing), materials.notchMaterial[materialIndex] );


    this.computeBoundingBox(this.geometry);
    this.mesh = new THREE.Mesh( this.geometry, materials.hullMaterial[materialIndex] );
    this.bridgeMesh = new THREE.Mesh( this.bridgeGeometry, materials.bridgeMaterial[materialIndex] );
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

  createCapGeometry(ring, uRepeat = 20, vRepeat = 4) {
    if (ring.length < 3) throw new Error("Need at least 3 points");
  
    const center = new THREE.Vector3();
    ring.forEach(p => center.add(p));
    center.divideScalar(ring.length);
  
    const allPoints = [center, ...ring];
  
    // Project to 2D (assume cap lies roughly in XY plane)
    const projected = allPoints.map(p => new THREE.Vector2(p.x, p.y));
  
    // Find bounds
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    for (const p of projected) {
      minX = Math.min(minX, p.x);
      maxX = Math.max(maxX, p.x);
      minY = Math.min(minY, p.y);
      maxY = Math.max(maxY, p.y);
    }
  
    const width = maxX - minX;
    const height = maxY - minY;
  
    // Generate UVs in [0, 1] and apply repeat scaling
    const uvs = projected.map(p => [
      ((p.x - minX) / width) * uRepeat,  // Apply U repeat scaling
      ((p.y - minY) / height) * vRepeat, // Apply V repeat scaling
    ]).flat();
  
    // Build positions and indices
    const positions = allPoints.map(p => p.toArray()).flat();
    const indices = [];
  
    for (let i = 1; i <= ring.length; i++) {
      const a = 0; // center
      const b = i;
      const c = (i % ring.length) + 1;
      indices.push(a, b, c);
    }
  
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
  
    return geometry;
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