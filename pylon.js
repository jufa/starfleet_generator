import * as THREE from 'three';

export default class Pylon {
  constructor({
    nacelleForeOffset = 0.4, // distance away from fore edge of nacelle hull 1.0 = Full aft
    nacelleAftOffset = 0.2, // distance away from aft edge of nacelle hull 1.0 = Full fore
    engineeringForeOffset = 0.4, // distance away from fore edge of engineering hull 1.0 = Full aft
    engineeringAftOffset = 0.1, // distance away from aft edge of engineering hull 1.0 = Full fore
    nacelle,
    engineering,
    material
  } = {}) {
    var group = new THREE.Group();
    var profileGeometry = new THREE.BufferGeometry();
    
    var nacelleLength = nacelle.dimensions.y;
    var engineeringLength = engineering.dimensions.y;

    var nacelleThickness = nacelle.dimensions.z;
    var nacelleCenterTop = nacelle.group.position.z;
    var nacelleCenterX = nacelle.group.position.x
    var nacelleCenterY = nacelle.group.position.y;
    var nacelleCenterZ = nacelle.group.position.z; // nacelleCenterTop + nacelleThickness * 0.5;

    var nacelleFore = nacelleCenterY + nacelleLength;
    var nacelleAft = nacelleCenterY;

    var engineeringAft = engineering.group.position.y;
    var engineeringFore = engineeringAft + engineeringLength;
    var engineeringCenterX = engineering.group.position.x;
    var engineeringCenterY = engineering.group.position.y;
    var engineeringCenterZ = engineering.group.position.z;

    nacelleFore -= nacelleLength * nacelleForeOffset;
    nacelleAft += nacelleLength * nacelleAftOffset;

    engineeringFore -= engineeringLength * engineeringForeOffset;
    engineeringAft += engineeringLength * engineeringAftOffset;

    var vertices = new Float32Array( [
      nacelleCenterX, nacelleFore, nacelleCenterZ,
      nacelleCenterX, nacelleAft, nacelleCenterZ,
      engineeringCenterX, engineeringFore, engineeringCenterZ,

      engineeringCenterX, engineeringAft, engineeringCenterZ,
      engineeringCenterX, engineeringFore, engineeringCenterZ,
      nacelleCenterX, nacelleAft, nacelleCenterZ
    ] );

    // itemSize = 3 because there are 3 values (components) per vertex
    profileGeometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );

    group.add( new THREE.Mesh( profileGeometry, material ) );
    
    return group;
  }
}