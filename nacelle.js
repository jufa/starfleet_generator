var THREE = require('three');

export default class Nacelle {
  constructor({
    radius = 10.0,
    segments = 32,
    length = 1.0,
    width = 1.8,
    widthRatio = 1.3,
    material
  } = {}) {
    var group = new THREE.Group();

    var geometry = new THREE.BufferGeometry();

    var points = [];
    for ( var i = 0; i < 10; i ++ ) {
      points.push( new THREE.Vector2( Math.sin( (i - 0.3) / Math.PI ) * width + width * 0.35, ( i * length ) ) );
    }

    var geometry = new THREE.LatheGeometry(points);
    geometry.scale(widthRatio, 1.0, 1.0);

    var meshMaterial = new THREE.MeshPhongMaterial( { color: 0x156289, emissive: 0x072534, side: THREE.DoubleSide, flatShading: true } );
    group.add( new THREE.Mesh( geometry, meshMaterial ) );

    return group;
  }
}