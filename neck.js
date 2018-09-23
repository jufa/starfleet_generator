import * as THREE from 'three';
import HullComponent from './hull_component.js';

export default class Neck extends HullComponent {
  constructor({ material, primary, engineering }) {
    super();
    this.material = material;
    this.group = new THREE.Group();
    this.profileGeometry = {};
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
  }) {

    this.clear();

    this.profileGeometry = new THREE.BufferGeometry();

    let primary = this.primary;
    let engineering = this.engineering;
    
    let primaryLength = primary.dimensions.z;
    let engineeringLength = engineering.dimensions.y;
    let primaryThickness = primary.dimensions.y;
    let primaryCenterForeAft = primary.group.position.y;
    let primaryCenterTop = primary.group.position.z;
    let primaryCenter = primaryCenterTop + primaryThickness * 0.5;

    let primaryFore = primaryCenterForeAft + primaryLength * 0.5;
    let primaryAft = primaryCenterForeAft - primaryLength * 0.5;
    let engineeringAft = engineering.group.position.y;
    let engineeringFore = engineeringAft + engineeringLength;
    let engineeringForeCenter = engineering.group.position.z;

    primaryFore -= primaryLength * primaryForeOffset;
    primaryAft += primaryLength * primaryAftOffset;

    engineeringFore -= engineeringLength * engineeringForeOffset;
    engineeringAft += engineeringLength * engineeringAftOffset;

    var vertices = new Float32Array( [
      0.0, primaryFore, primaryCenter, //center top of saucer, needs to be center middle
      0.0, primaryAft, primaryCenter,
      0.0, engineeringFore, engineeringForeCenter,

      0.0, engineeringAft, engineeringForeCenter,
      0.0, engineeringFore, engineeringForeCenter,
      0.0, primaryAft, primaryCenter
    ] );

    // itemSize = 3 because there are 3 values (components) per vertex
    this.profileGeometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    this.profileGeometry.computeVertexNormals(); //needed for material shading
    this.mesh = new THREE.Mesh( this.profileGeometry, this.material );
    this.group.add( this.mesh );
  }

  clear(){
    if (this.profileGeometry['dispose']) {
      this.profileGeometry.dispose();
      for (var i = this.group.children.length - 1; i >= 0; i--) {
        this.group.remove(this.group.children[i]);
      }
    }
  }
}