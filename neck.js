import * as THREE from 'three';
import HullComponent from './hull_component.js';

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
    thickness,
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

    const thicknessRatio = 1.5;

    this.vertices = [
      new THREE.Vector3(thickness * thicknessRatio, primaryFore, primaryCenterThickness),
      new THREE.Vector3(thickness * thicknessRatio, primaryAft, primaryCenterThickness),
      new THREE.Vector3(thickness, engineeringFore, engineeringForeVerticalCenter),
      new THREE.Vector3(thickness, engineeringAft, engineeringForeVerticalCenter),

      new THREE.Vector3(-thickness * thicknessRatio, primaryFore, primaryCenterThickness),
      new THREE.Vector3(-thickness * thicknessRatio, primaryAft, primaryCenterThickness),
      new THREE.Vector3(-thickness, engineeringFore, engineeringForeVerticalCenter),
      new THREE.Vector3(-thickness, engineeringAft, engineeringForeVerticalCenter)
    ];

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
    const indices = [
        0, 1, 2,
        2, 1, 3,
        5, 3, 1,
        3, 5, 7,
        6, 7, 5,
        4, 6, 5,
        6, 4, 0,
        6, 0, 2,
        0, 4, 1,
        4, 5, 1,
    ];


    // Set the index attribute in the BufferGeometry
    this.geometry.setIndex(indices);

    this.calculateUVs(this.geometry);
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