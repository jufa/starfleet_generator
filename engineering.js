var THREE = require('three');

export default class Engineering {
  constructor({
    radius = 10.0,
    segments = 32,
    length = 1.0,
    width = 2.0
  } = {}) {
    var group = new THREE.Group();

    var geometry = new THREE.BufferGeometry();

    var points = [];
    for ( var i = 0; i < 10; i ++ ) {
      points.push( new THREE.Vector2( Math.sin( ( i  ) / Math.PI * 0.8 + 0.1) * width, ( i * length ) ) );
    }

    var geometry = new THREE.LatheGeometry(points);

    var lineMaterial = new THREE.LineBasicMaterial( { color: 0xffffff, transparent: true, opacity: 0.5 } );
    var meshMaterial = new THREE.MeshPhongMaterial( { color: 0x156289, emissive: 0x072534, side: THREE.DoubleSide } );

    group.add( new THREE.LineSegments( geometry, lineMaterial ) );
    group.add( new THREE.Mesh( geometry, meshMaterial ) );

    return group;
  }
}