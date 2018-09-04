var THREE = require('three');

export default class Saucer {
  constructor({
    radius = 10.0,
    segments = 32,
    thetaLength = Math.PI * 2.0,
  } = {}) {

    var thetaStart = Math.PI * 0.5 - thetaLength / 2.0;
    var group = new THREE.Group();

    var geometry = new THREE.CircleGeometry(radius, segments, thetaStart, thetaLength);
    var meshMaterial = new THREE.MeshPhongMaterial( { shininess: 100, color: 0x156289, emissive: 0xffffff, side: THREE.DoubleSide, flatShading: false } );

    group.add( new THREE.Mesh( geometry, meshMaterial ) );

    return group;
  }
}