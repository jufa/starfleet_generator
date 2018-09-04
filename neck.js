var THREE = require('three');

export default class Neck {
  constructor({
    primaryForeOffset = 0.3, // distance away from fore edge of primary hull 1.0 = Full aft
    primaryAftOffset = 0.1, // distance away from aft edge of primary hull 1.0 = Full fore
    engineeringForeOffset = 0.2, // distance away from fore edge of engineering hull 1.0 = Full aft
    engineeringAftOffset = -0.2, // distance away from aft edge of engineering hull 1.0 = Full fore
    primary,
    engineering,
    material
  } = {}) {
    var group = new THREE.Group();
    var profileGeometry = new THREE.BufferGeometry();
    
    var primaryLength = primary.dimensions.z;
    var engineeringLength = engineering.dimensions.y;
    var primaryThickness = primary.dimensions.y;
    var primaryCenterForeAft = primary.group.position.y;
    var primaryCenterTop = primary.group.position.z;
    var primaryCenter = primaryCenterTop + primaryThickness * 0.5;

    var primaryFore = primaryCenterForeAft + primaryLength * 0.5;
    var primaryAft = primaryCenterForeAft - primaryLength * 0.5;
    var engineeringAft = engineering.group.position.y;
    var engineeringFore = engineeringAft + engineeringLength;
    var engineeringForeCenter = engineering.group.position.z;

    primaryFore *= (1.0 - 2.0 * primaryForeOffset);
    primaryAft *= (1.0 - 2.0 * primaryAftOffset);
    engineeringFore -= engineeringLength * engineeringForeOffset;
    engineeringAft += engineeringLength * engineeringAftOffset;

    var vertices = new Float32Array( [
      0.0, primaryFore, primaryCenter, //center top of saucer, needs to be center middle
      0.0, engineeringFore, engineeringForeCenter,
      0.0, engineeringAft, engineeringForeCenter,

      0.0, primaryAft, primaryCenter,
      0.0, engineeringAft, engineeringForeCenter,
      0.0, primaryFore, primaryCenter
    ] );

    // itemSize = 3 because there are 3 values (components) per vertex
    profileGeometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );

    // var extrudeSettings = {
    //   steps: 2,
    //   depth: 1,
    //   bevelEnabled: true,
    //   bevelThickness: 1,
    //   bevelSize: 1,
    //   bevelSegments: 1
    // };

    // var geometry = new THREE.ExtrudeGeometry( profileGeometry, extrudeSettings );

    var meshMaterial = new THREE.MeshPhongMaterial( { color: 0x156289, emissive: 0x072534, side: THREE.DoubleSide, flatShading: true } );

    group.add( new THREE.Mesh( profileGeometry, meshMaterial ) );
    
    return group;
  }
}