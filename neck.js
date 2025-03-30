import * as THREE from 'three';
import HullComponent from './hull_component.js';
import { LoopSubdivision } from 'three-subdivide';

export default class Neck extends HullComponent {
  constructor({ material, primary, engineering }) {
    super();
    this.material = material;
    this.group = new THREE.Group();
    this.geometry = {};
    this.mesh = {};
    this.primary = primary;
    this.engineering = engineering;

    return this;
  }

  update({
    primaryForeOffset, // distance away from fore edge of primary hull 1.0 = Full aft
    primaryAftOffset, // distance away from aft edge of primary hull 1.0 = Full fore
    engineeringForeOffset, // distance away from fore edge of engineering hull 1.0 = Full aft
    engineeringAftOffset, // distance away from aft edge of engineering hull 1.0 = Full fore
    primaryThickness,
    thickness,
    foretaper,
    afttaper,
  }) {

    this.clear();

    let primary = this.primary;
    let engineering = this.engineering;
    
    let primaryLength = primary.dimensions.z;
    let engineeringLength = engineering.dimensions.y;
    let primaryCenterForeAft = primary.group.position.y;
    let primaryCenterTop = primary.group.position.z;
    let primaryCenterThickness = primaryCenterTop + primary.dimensions.y * 0.5;

    let primaryFore = primaryCenterForeAft - primary.dimensions.fore;
    let primaryAft = primaryCenterForeAft - primary.dimensions.aft;

    let engineeringAft = engineering.group.position.y;
    let engineeringFore = engineeringAft + engineeringLength;
    let engineeringForeVerticalCenter = engineering.group.position.z;

    primaryFore -= primaryLength * primaryForeOffset;
    primaryAft += primaryLength * primaryAftOffset;

    engineeringFore -= engineeringLength * engineeringForeOffset;
    engineeringAft += engineeringLength * engineeringAftOffset;
    
    let thicknessRatio = thickness / primaryThickness;


    // rfb=right fore bottom, rft=right fore top, rbt=right back top, rbb=right back bottom
    const rfb = new THREE.Vector3(thickness*foretaper, engineeringFore, engineeringForeVerticalCenter);
    const rft = new THREE.Vector3(primaryThickness*foretaper, primaryFore, primaryCenterThickness);
    const rbt = new THREE.Vector3(primaryThickness*afttaper, primaryAft, primaryCenterThickness);
    const rbb = new THREE.Vector3(thickness*afttaper, engineeringAft, engineeringForeVerticalCenter);

    const lfb = new THREE.Vector3(-thickness*foretaper, engineeringFore, engineeringForeVerticalCenter);
    const lft = new THREE.Vector3(-primaryThickness*foretaper, primaryFore, primaryCenterThickness);
    const lbt = new THREE.Vector3(-primaryThickness*afttaper, primaryAft, primaryCenterThickness);
    const lbb = new THREE.Vector3(-thickness*afttaper, engineeringAft, engineeringForeVerticalCenter);

    this.vertices = [
      // Top Face
      rft.clone(), rbt.clone(), lft.clone(), lbt.clone(),
  
      // Bottom Face
      rfb.clone(), rbb.clone(), lfb.clone(), lbb.clone(),
  
      // Front Face
      rft.clone(), lft.clone(), rfb.clone(), lfb.clone(),
  
      // Back Face
      rbt.clone(), lbt.clone(), rbb.clone(), lbb.clone(),
  
      // Left Face
      lft.clone(), lbt.clone(), lfb.clone(), lbb.clone(),
  
      // Right Face
      rft.clone(), rbt.clone(), rfb.clone(), rbb.clone(),
   ];

    // Define the faces (index pairs) for the triangles
    const indices = [
      // Top Face
      0, 1, 2,   3, 2, 1,
  
      // Bottom Face
      4, 5, 6,   6, 5, 7,
  
      // Front Face
      8, 9, 10,  11, 10, 9,
  
      // Back Face
      12, 13, 14,  15, 14, 13,
  
      // Left Face
      16, 17, 18,  19, 18, 17,
  
      // Right Face
      20, 21, 22,  23, 22, 21,
  ];

    const uvs = new Float32Array([
      // Top Face
      0, 0,  // bottom-left
      1, 0,  // bottom-right
      0, 1,  // top-left
      1, 1,  // top-right

      // Bottom Face
      0, 0,  // bottom-left
      1, 0,  // bottom-right
      0, 1,  // top-left
      1, 1,  // top-right

      // Front Face
      0, 0,  // bottom-left
      1, 0,  // bottom-right
      0, 1,  // top-left
      1, 1,  // top-right

      // Back Face
      0, 0,  // bottom-left
      1, 0,  // bottom-right
      0, 1,  // top-left
      1, 1,  // top-right

      // Left Face
      0, 0,  // bottom-left
      1, 0,  // bottom-right
      0, 1,  // top-left
      1, 1,  // top-right

      // Right Face
      0, 0,  // bottom-left
      1, 0,  // bottom-right
      0, 1,  // top-left
      1, 1   // top-right
    ]);

    // Create a new BufferGeometry
    this.geometry = new THREE.BufferGeometry();
    
    // Create an array to hold the vertex positions
    const positions = [];

    // Populate the positions array with the vertices
    this.vertices.forEach(v => {
      positions.push(v.x, v.y, v.z);
    });

    // Set the position attribute in the BufferGeometry
    this.geometry.setIndex(indices);

    this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    this.geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    this.geometry.computeVertexNormals(); // Needed for shading

    // const iterations = 2;
    // const params = {
    //     split:          true,       // optional, default: true
    //     uvSmooth:       true,      // optional, default: false
    //     preserveEdges:  true,      // optional, default: false
    //     flatOnly:       true,      // optional, default: false
    //     maxTriangles:   Infinity,   // optional, default: Infinity
    // };
    // this.geometry = LoopSubdivision.modify(this.geometry, iterations, params);
    // this.geometry.computeVertexNormals(); // Needed for shading
    
    this.geometry.uvsNeedUpdate = true;

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