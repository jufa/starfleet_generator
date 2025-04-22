import * as THREE from 'three';
import HullComponent from './hull_component.js';
import { LoopSubdivision } from 'three-subdivide';
import * as materials from './materials.js';

export default class Pylon extends HullComponent {
  constructor({ nacelle, engineering, name }) {
    super();
    this.group = new THREE.Group();
    this.geometry = {};
    this.mesh = {};
    this.nacelle = nacelle;
    this.engineering = engineering;
    this.name = name;

    return this;
  }


  update({
    nacelleForeOffset, // distance away from fore edge of nacelle hull 1.0 = Full aft
    nacelleAftOffset, // distance away from aft edge of nacelle hull 1.0 = Full fore
    engineeringForeOffset, // distance away from fore edge of engineering hull 1.0 = Full aft
    engineeringAftOffset, // distance away from aft edge of engineering hull 1.0 = Full fore})
    thickness,
    midpointOffset, //0-1 where 0 is engineering center and 1 is nacelle center, established where the elbow of the pylon is
    materialIndex=0,
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

      const uvs = new Float32Array(
      [
        0.0,0.0,         
        1.0,0.0,  
        0.0,1.0,         
        1.0,1.0,
        0.0,0.0,         
        1.0,0.0,  
        0.0,1.0,         
        1.0,1.0,
        0.0,0.0,         
        1.0,0.0,  
        0.0,1.0,         
        1.0,1.0,
        0.0,0.0,         
        1.0,0.0,  
        0.0,1.0,         
        1.0,1.0, 
      ]);


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

    const indices = [
      0, 1, 2,
      2, 1, 3,
      5, 3, 1,
      3, 5, 7,
      6, 7, 5,
      4, 6, 5,
      6, 4, 0,
      6, 0, 2,
      2, 3, 6,
      3, 7, 6,
      0, 4, 1, // engineering box, mid endplate A
      4, 5, 1, // engineering box, mid endplate B
      8, 9, 10,
      10, 9, 11,
      13, 11, 9,
      11, 13, 15,
      13, 12, 14,
      14, 15, 13,
      14, 12, 8,
      14, 8, 10,
      8, 12, 9,
      12, 13, 9,
      10, 11, 14, // nacelle box, mid endplate A
      11, 15, 14, // nacelle box, mid endplate B
    ];

    // Set the position attribute in the BufferGeometry
    
    this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    this.geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    

    // Set the index attribute in the BufferGeometry
    this.geometry.setIndex(indices);
    this.geometry.computeVertexNormals(); // Needed for shading
    this.geometry.uvsNeedUpdate = true;

    const iterations = 1;

    const params = {
        split:          true,       // optional, default: true
        uvSmooth:       false,      // optional, default: false
        preserveEdges:  false,      // optional, default: false
        flatOnly:       true,      // optional, default: false
        maxTriangles:   Infinity,   // optional, default: Infinity
    };
    
    // this.geometry = LoopSubdivision.modify(this.geometry, iterations, params);

    this.mesh = new THREE.Mesh( this.geometry, materials.pylonMaterial[materialIndex] );
    this.mesh.name = this.name;
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