import * as THREE from 'three';
import HullComponent from './hull_component.js';

export default class Pylon extends HullComponent {
  constructor({ nacelle, engineering, material }) {
    super();
    this.material = material;
    this.group = new THREE.Group();
    this.profileGeometry = {};
    this.mesh = {};
    this.nacelle = nacelle;
    this.engineering = engineering;

    return this;
  }

  update({
    nacelleForeOffset, // distance away from fore edge of nacelle hull 1.0 = Full aft
    nacelleAftOffset, // distance away from aft edge of nacelle hull 1.0 = Full fore
    engineeringForeOffset, // distance away from fore edge of engineering hull 1.0 = Full aft
    engineeringAftOffset // distance away from aft edge of engineering hull 1.0 = Full fore})
  }){

    this.clear();

    this.profileGeometry = new THREE.BufferGeometry();

    let nacelle = this.nacelle;
    let engineering = this.engineering;

    let nacelleLength = nacelle.dimensions.y;
    let engineeringLength = engineering.dimensions.y;

    let nacelleThickness = nacelle.dimensions.z;
    let nacelleCenterTop = nacelle.group.position.z;
    let nacelleCenterX = nacelle.group.position.x
    let nacelleCenterY = nacelle.group.position.y;
    let nacelleCenterZ = nacelle.group.position.z; // nacelleCenterTop + nacelleThickness * 0.5;


    let nacelleFore = nacelleCenterY + nacelleLength;
    let nacelleAft = nacelleCenterY;

    let engineeringAft = engineering.group.position.y;
    let engineeringFore = engineeringAft + engineeringLength;
    let engineeringCenterX = engineering.group.position.x;
    let engineeringCenterY = engineering.group.position.y;
    let engineeringCenterZ = engineering.group.position.z;

    let pylonThickness = nacelleThickness * 0.2;

    nacelleFore -= nacelleLength * nacelleForeOffset;
    nacelleAft += nacelleLength * nacelleAftOffset;

    engineeringFore -= engineeringLength * engineeringForeOffset;
    engineeringAft += engineeringLength * engineeringAftOffset;

    var vertices = new Float32Array( [
      // face
      nacelleCenterX, nacelleFore, nacelleCenterZ,
      nacelleCenterX, nacelleAft, nacelleCenterZ,
      engineeringCenterX, engineeringFore, engineeringCenterZ,

      engineeringCenterX, engineeringAft, engineeringCenterZ,
      engineeringCenterX, engineeringFore, engineeringCenterZ,
      nacelleCenterX, nacelleAft, nacelleCenterZ,

      // face
      nacelleCenterX, nacelleFore, nacelleCenterZ + pylonThickness,
      nacelleCenterX, nacelleAft, nacelleCenterZ + pylonThickness,
      engineeringCenterX, engineeringFore, engineeringCenterZ + pylonThickness,

      engineeringCenterX, engineeringAft, engineeringCenterZ + pylonThickness,
      engineeringCenterX, engineeringFore, engineeringCenterZ + pylonThickness,
      nacelleCenterX, nacelleAft, nacelleCenterZ + pylonThickness,

      // leading edge
      nacelleCenterX, nacelleFore, nacelleCenterZ + pylonThickness,
      nacelleCenterX, nacelleFore, nacelleCenterZ,
      engineeringCenterX, engineeringFore, engineeringCenterZ + pylonThickness,

      engineeringCenterX, engineeringFore, engineeringCenterZ + pylonThickness,
      engineeringCenterX, engineeringFore, engineeringCenterZ,
      nacelleCenterX, nacelleFore, nacelleCenterZ,

      // trailing edge
      nacelleCenterX, nacelleAft, nacelleCenterZ + pylonThickness,
      nacelleCenterX, nacelleAft, nacelleCenterZ,
      engineeringCenterX, engineeringAft, engineeringCenterZ + pylonThickness,

      engineeringCenterX, engineeringAft, engineeringCenterZ + pylonThickness,
      engineeringCenterX, engineeringAft, engineeringCenterZ,
      nacelleCenterX, nacelleAft, nacelleCenterZ
    ] );

    // itemSize = 3 because there are 3 values (components) per vertex
    this.profileGeometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    this.profileGeometry.computeVertexNormals(); //needed for material shading
    this.profileGeometry.computeFaceNormals(); //needed for material shading
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