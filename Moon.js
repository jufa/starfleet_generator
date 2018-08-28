var THREE = require('three');

export default class Moon {

  constructor({
    radius = 50.0,
    scale = 10.0
  } = {}) {
    var textureLoader = new THREE.TextureLoader();
    var materialMoon = new THREE.MeshPhongMaterial( {
      map: textureLoader.load( "image/textures/moon_1024.jpg" ),
      shininess: 0
    } );
    var geometry = new THREE.SphereGeometry( radius, 100, 50 );
    var mesh = new THREE.Mesh( geometry, materialMoon );
    mesh.position.set( radius, 0, 0 );
    mesh.rotateX(-120);
    mesh.rotateY(0);
    mesh.rotateZ(270);
    mesh.scale.set( scale, scale, scale );
    return mesh;
  }
}