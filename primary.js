var THREE = require('three');

export default class Primary {
  constructor({
    thickness = 1.0,
    radius = 2.0,
    widthRatio = 1.3,
    material
  } = {}) {
    
    var group = new THREE.Group();

    var geometry = new THREE.BufferGeometry();

    var points = [];
    for ( var i = 0; i < 12; i ++ ) {
      points.push( new THREE.Vector2( Math.sin( ( i ) / Math.PI * 0.8 + 0.1) * radius, ( i * thickness ) ) );
    }

    var geometry = new THREE.LatheGeometry(points, 32);
    geometry.scale(widthRatio, 1.0, 1.0);
    
    geometry.computeBoundingBox();
    this.dimensions = {};
    this.dimensions.x = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
    this.dimensions.y = geometry.boundingBox.max.y - geometry.boundingBox.min.y;
    this.dimensions.z = geometry.boundingBox.max.z - geometry.boundingBox.min.z;

    var meshMaterial = material;

    group.add( new THREE.Mesh( geometry, meshMaterial ) );

    group.rotateX( Math.PI / 2.0);
    
    this.group = group;
    return this;
  }
}