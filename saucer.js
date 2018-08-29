var THREE = require('three');

export default class Saucer {
  constructor({
    radius = 10.0,
    segments = 32,
    thetaStart = 0,
    thetaLength = Math.PI * 1.3
  } = {}) {
    var group = new THREE.Group();

    var geometry = new THREE.BufferGeometry();
    var geometry = new THREE.CircleGeometry(radius, segments, thetaStart, thetaLength);

    var lineMaterial = new THREE.LineBasicMaterial( { color: 0xffffff, transparent: true, opacity: 0.5 } );
    var meshMaterial = new THREE.MeshPhongMaterial( { color: 0x444444, emissive: 0x222222, side: THREE.DoubleSide } );

    group.add( new THREE.LineSegments( geometry, lineMaterial ) );
    group.add( new THREE.Mesh( geometry, meshMaterial ) );

    return group;
  }
}