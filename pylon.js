import * as THREE from 'three';
import HullComponent from './hull_component.js';
import { LoopSubdivision } from 'three-subdivide';

export default class Pylon extends HullComponent {
  constructor({ nacelle, engineering, material }) {
    super();
    this.material = material;
    this.group = new THREE.Group();
    this.geometry = {};
    this.mesh = {};
    this.nacelle = nacelle;
    this.engineering = engineering;

    return this;
  }


  update({
    nacelleForeOffset, // distance away from fore edge of nacelle hull 1.0 = Full aft
    nacelleAftOffset, // distance away from aft edge of nacelle hull 1.0 = Full fore
    engineeringForeOffset, // distance away from fore edge of engineering hull 1.0 = Full aft
    engineeringAftOffset, // distance away from aft edge of engineering hull 1.0 = Full fore})
    thickness,
    midpointOffset, //0-1 where 0 is engineering center and 1 is nacelle center, established where the elbow of the pylon is
  }){

    this.clear();

    let nacelle = this.nacelle;
    let engineering = this.engineering;

    let nacelleLength = nacelle.dimensions.y;
    let engineeringLength = engineering.dimensions.y;

    let nacelleCenterTop = nacelle.group.position.z;
    let nacelleCenterX = nacelle.group.position.x
    let nacelleCenterY = nacelle.group.position.y;
    let nacelleCenterZ = nacelle.group.position.z; // nacelleCenterTop + thickness * 0.5;

    let nacelleFore = nacelleCenterY + nacelleLength;
    let nacelleAft = nacelleCenterY;

    let engineeringAft = engineering.group.position.y;
    let engineeringFore = engineeringAft + engineeringLength;
    let engineeringCenterX = engineering.group.position.x;
    let engineeringCenterY = engineering.group.position.y;
    let engineeringCenterZ = engineering.group.position.z;

    nacelleFore -= nacelleLength * nacelleForeOffset;
    nacelleAft += nacelleLength * nacelleAftOffset;

    engineeringFore -= engineeringLength * engineeringForeOffset;
    engineeringAft += engineeringLength * engineeringAftOffset;

    let midCenterX = (nacelle.group.position.x - engineering.group.position.x) * midpointOffset;
    let midCenterY = engineering.group.position.y;
    let midCenterZ = engineering.group.position.z;
    let midFore = engineeringFore;
    let midAft = engineeringAft;

    // const deltaX_ne = nacelleCenterX - engineeringCenterX;
    // const deltaZ_ne = nacelleCenterZ - engineeringCenterZ;
    // const angle_ne = Math.atan2(deltaZ, deltaX);
    // const thicknessX_ne = thickness * Math.sin(angle);
    // const thicknessZ_ne = thickness * Math.cos(angle);

    let deltaX = nacelleCenterX - midCenterX;
    let deltaZ = nacelleCenterZ - midCenterZ;
    let angle = Math.atan2(deltaZ, deltaX);
    let thicknessX_nm = thickness * Math.sin(angle);
    let thicknessZ_nm = thickness * Math.cos(angle);
    if (deltaX < 0) {
      thicknessX_nm = -thicknessX_nm;
      thicknessZ_nm = -thicknessZ_nm;
    };


    deltaX = midCenterX - engineeringCenterX;
    deltaZ = midCenterZ - engineeringCenterZ;
    angle = Math.atan2(deltaZ, deltaX);
    let thicknessX_em = thickness * Math.sin(angle);
    let thicknessZ_em = thickness * Math.cos(angle);
    if (deltaX < 0) {
      thicknessX_em = -thicknessX_em;
      thicknessZ_em = -thicknessZ_em;
    };

    this.vertices = [
      new THREE.Vector3(midCenterX - thicknessX_em, midFore, midCenterZ + thicknessZ_em),
      new THREE.Vector3(midCenterX - thicknessX_em, midAft, midCenterZ + thicknessZ_em),
      new THREE.Vector3(engineeringCenterX - thicknessX_em, engineeringFore, engineeringCenterZ + thicknessZ_em),
      new THREE.Vector3(engineeringCenterX - thicknessX_em, engineeringAft, engineeringCenterZ + thicknessZ_em),

      new THREE.Vector3(midCenterX + thicknessX_em, midFore, midCenterZ - thicknessZ_em),
      new THREE.Vector3(midCenterX + thicknessX_em, midAft, midCenterZ - thicknessZ_em),
      new THREE.Vector3(engineeringCenterX + thicknessX_em, engineeringFore, engineeringCenterZ - thicknessZ_em),
      new THREE.Vector3(engineeringCenterX + thicknessX_em, engineeringAft, engineeringCenterZ - thicknessZ_em),

      new THREE.Vector3(nacelleCenterX - thicknessX_nm, nacelleFore, nacelleCenterZ + thicknessZ_nm),
      new THREE.Vector3(nacelleCenterX - thicknessX_nm, nacelleAft, nacelleCenterZ + thicknessZ_nm),
      new THREE.Vector3(midCenterX - thicknessX_nm, midFore, midCenterZ + thicknessZ_nm + thicknessZ_em),
      new THREE.Vector3(midCenterX - thicknessX_nm, midAft, midCenterZ + thicknessZ_nm + thicknessZ_em),

      new THREE.Vector3(nacelleCenterX + thicknessX_nm, nacelleFore, nacelleCenterZ - thicknessZ_nm),
      new THREE.Vector3(nacelleCenterX + thicknessX_nm, nacelleAft, nacelleCenterZ - thicknessZ_nm),
      new THREE.Vector3(midCenterX + thicknessX_nm, midFore, midCenterZ - thicknessZ_nm),
      new THREE.Vector3(midCenterX + thicknessX_nm, midAft, midCenterZ - thicknessZ_nm),
    ];

    this.vertices[0] = this.vertices[10].clone();
    this.vertices[1] = this.vertices[11].clone();
    this.vertices[4] = this.vertices[14].clone();
    this.vertices[5] = this.vertices[15].clone();

    // Create a new BufferGeometry
    this.geometry = new THREE.BufferGeometry();

    // Create an array to hold the vertex positions
    const positions = [];

    // Populate the positions array with the vertices
    this.vertices.forEach(v => {
      positions.push(v.x, v.y, v.z);
    });

    // Set the position attribute in the BufferGeometry
    this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    // Define the faces (index pairs) for the triangles

    // let indices = [
    //     0, 1, 2,
    //     2, 1, 3,
    //     5, 3, 1,
    //     3, 5, 7,
    //     6, 7, 5,
    //     4, 6, 5,
    //     6, 4, 0,
    //     6, 0, 2,
    //     0, 4, 1,
    //     4, 5, 1,
    //     2, 3, 6,
    //     3, 7, 6,
    //     8, 9, 10,
    //     10, 9, 11,
    //     13, 11, 9,
    //     11, 13, 15,
    //     14, 15, 13,
    //     12, 14, 13,
    //     14, 12, 8,
    //     14, 8, 10,
    //     8, 12, 9,
    //     12, 13, 9,
    //     10, 11, 14,
    //     11, 15, 14,
    // ];

    const indices = [
      0, 1, 2,
      2, 1, 3,
      5, 3, 1,
      3, 5, 7,
      6, 7, 5,
      4, 6, 5,
      6, 4, 0,
      6, 0, 2,
      // 0, 4, 1, engineering box, mid endplate A
      // 4, 5, 1, engineering box, mid endplate B
      2, 3, 6,
      3, 7, 6,
      8, 9, 10,
      10, 9, 11,
      13, 11, 9,
      11, 13, 15,
      14, 15, 13,
      12, 14, 13,
      14, 12, 8,
      14, 8, 10,
      8, 12, 9, // nacelle box, nacell end plate A
      12, 13, 9, // nacelle box, nacell end plate B
      // 10, 11, 14, // nacelle box, mid endplate A
      // 11, 15, 14, // nacelle box, mid endplate B
    ];

    // indices = [
    //   // First cube (Mid & Engineering Section)
    //   0, 1, 2,  2, 1, 3,  // Front
    //   5, 3, 1,  3, 5, 7,  // Right
    //   6, 7, 5,  4, 6, 5,  // Back
    //   6, 4, 0,  6, 0, 2,  // Left
    //   0, 4, 1,  4, 5, 1,  // Bottom
    //   2, 3, 6,  3, 7, 6,  // Top
  
    //   // Second cube (Nacelle & Mid Section)
    //   8, 9, 10,  10, 9, 11,  // Front
    //   13, 11, 9,  11, 13, 15,  // Right
    //   14, 15, 13,  12, 14, 13,  // Back
    //   14, 12, 8,  14, 8, 10,  // Left
    //   8, 12, 9,  12, 13, 9,  // Bottom
    //   10, 11, 14,  11, 15, 14,  // Top
  
      // **Missing connections (fixing gaps)**
      // 0, 8, 10,  0, 10, 2,  // Connect first and second structure (Front)
      // 4, 12, 8,  4, 8, 0,  // Left side connection
      // 5, 13, 9,  5, 9, 1,  // Right side connection
      // 6, 14, 12,  6, 12, 4,  // Back connection
      // 7, 15, 13,  7, 13, 5,  // Right top connection
      // 3, 11, 15,  3, 15, 7   // Right back connection
    // ];

    // Set the index attribute in the BufferGeometry
    this.geometry.setIndex(indices);

    // Optionally calculate the UVs (if needed by your material)
    this.calculateUVs(this.geometry);

    // split the nacelle geometry:
    // const iterations = 1;

    // const params = {
    //     split:          false,       // optional, default: true
    //     uvSmooth:       false,      // optional, default: false
    //     preserveEdges:  true,      // optional, default: false
    //     flatOnly:       true,      // optional, default: false
    //     maxTriangles:   Infinity,   // optional, default: Infinity
    // };

    // this.geometry = LoopSubdivision.modify(this.geometry, iterations, params);

    // Modify vertex positions to create a curve
    // const points = this.geometry.attributes.position;
    // for (let i = 0; i < points.count; i++) {
    //     const zNormalized = points.getZ(i) / (engineeringCenterZ - nacelleCenterZ);
    //     const xNormalized = points.getX(i) / (engineeringCenterX - nacelleCenterX);
    //     // console.log(xNormalized, zNormalized);
    //     let newZ = (zNormalized**0.1) * (engineeringCenterZ - nacelleCenterZ);
    //     // if (zNormalized < 0.0 && newZ > 0.0) {
    //     //   newZ = -newZ;
    //     // }
    //     points.setZ(i, newZ);
    // }
    // points.needsUpdate = true;

    // const curve = new THREE.CatmullRomCurve3( [
    //   new THREE.Vector3( nacelleCenterX, 0.0, nacelleCenterZ),
    //   new THREE.Vector3( engineeringCenterX, 0.0, engineeringCenterZ),
    // ] );

    // const pointCount = 2 + iterations ** 2;
    // const curvePoints = curve.getPoints( pointCount );
    // console.log(curvePoints);

    // const points = this.geometry.attributes.position;
    // for (let i = 0; i < points.count; i++) {
    //   points.setZ(i, (curvePoints[i]).z);
    // };


    this.mesh = new THREE.Mesh( this.geometry, this.material.clone() );
    this.group.add( this.mesh );
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