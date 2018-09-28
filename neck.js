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

    this.geometry = new THREE.Geometry();

    let primary = this.primary;
    let engineering = this.engineering;
    
    let primaryLength = primary.dimensions.z;
    let engineeringLength = engineering.dimensions.y;
    let primaryCenterForeAft = primary.group.position.y;
    let primaryCenterTop = primary.group.position.z;
    let primaryCenterThickness = primaryCenterTop + primary.dimensions.y * 0.5;

    let primaryFore = primaryCenterForeAft + primaryLength * 0.5;
    let primaryAft = primaryCenterForeAft - primaryLength * 0.5;
    let engineeringAft = engineering.group.position.y;
    let engineeringFore = engineeringAft + engineeringLength;
    let engineeringForeVerticalCenter = engineering.group.position.z;

    primaryFore -= primaryLength * primaryForeOffset;
    primaryAft += primaryLength * primaryAftOffset;

    engineeringFore -= engineeringLength * engineeringForeOffset;
    engineeringAft += engineeringLength * engineeringAftOffset;

    this.vertices = [
      new THREE.Vector3(thickness, primaryFore, primaryCenterThickness),
      new THREE.Vector3(thickness, primaryAft, primaryCenterThickness),
      new THREE.Vector3(thickness, engineeringFore, engineeringForeVerticalCenter),
      new THREE.Vector3(thickness, engineeringAft, engineeringForeVerticalCenter),
      new THREE.Vector3(-thickness, primaryFore, primaryCenterThickness),
      new THREE.Vector3(-thickness, primaryAft, primaryCenterThickness),
      new THREE.Vector3(-thickness, engineeringFore, engineeringForeVerticalCenter),
      new THREE.Vector3(-thickness, engineeringAft, engineeringForeVerticalCenter)
    ];

    this.geometry.vertices = this.vertices; 

    // need 8 triangles:
    this.geometry.faces = [
      new THREE.Face3(0,1,2),
      new THREE.Face3(2,1,3),
      new THREE.Face3(5,3,1),
      new THREE.Face3(3,5,7),
      new THREE.Face3(6,7,5),
      new THREE.Face3(4,6,5),
      new THREE.Face3(6,4,0),
      new THREE.Face3(6,0,2)
    ]
        
    this.geometry.computeVertexNormals(); // needed for material shading
    this.mesh = new THREE.Mesh( this.geometry, this.material );
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