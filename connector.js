var THREE = require('three');

export default class Connector {
  constructor({
    a,
    b
  } = {}) {
    var group = new THREE.Group();

    var geometry = new THREE.BufferGeometry();
    var aWidth = a.dimensions.z;
    var bWidth = b.dimensions.y;
    var aThickness = a.dimensions.y;
    var aPos = a.group.position;
    var bPos = b.group.position;

    var vertices = new Float32Array( [
      0.0, aPos.y, aPos.z,
      0.0, bPos.y + bWidth, bPos.z,
      0.0, bPos.y, bPos.z,

      0.0, aPos.y, aPos.z,
      0.0, bPos.y, bPos.z,
      0.0, aPos.y - aWidth / 2.0, aPos.z + aThickness / 2.0
    ] );

    // itemSize = 3 because there are 3 values (components) per vertex
    geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );

    var meshMaterial = new THREE.MeshPhongMaterial( { color: 0x156289, emissive: 0x072534, side: THREE.DoubleSide, flatShading: true } );

    group.add( new THREE.Mesh( geometry, meshMaterial ) );
    
    return group;
  }
}