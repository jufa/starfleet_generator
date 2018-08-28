var THREE = require('three');

export default class Saucer {
  constructor({
    radius = 50.0,
    segments = 32,
    thetaStart = 0,
    thetaLength = Math.PI * 1.3
  } = {}) {
    console.log("saucer");
    var geometry = new THREE.CircleGeometry(radius, segments, thetaStart, thetaLength);
    // var material = new THREE.MeshBasicMaterial( { color: 0x5555ff } );
    var material = new THREE.MeshPhongMaterial( { color: 0xffffff, emissive: 0x999999, side: THREE.DoubleSide} );
    var mesh = new THREE.Mesh( geometry, material );
    return mesh;
  }
}