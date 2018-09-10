var THREE = require('three');

export default class Engineering {
  constructor({
    length = 1.0,
    width = 50.0,
    widthRatio = 1.0,
    material
  } = {}) {
    var group = new THREE.Group();

    var geometry = new THREE.BufferGeometry();

    var points = [];
    for ( var i = 0; i < 10; i ++ ) {
      points.push( new THREE.Vector2( Math.sin( ( i  ) / Math.PI * 0.8 + 0.1) * width , ( i * length ) ) );
    }

    var geometry = new THREE.LatheGeometry(points);
    geometry.scale(widthRatio, 1.0, 1.0);

    geometry.computeBoundingBox();
    this.dimensions = {};
    this.dimensions.x = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
    this.dimensions.y = geometry.boundingBox.max.y - geometry.boundingBox.min.y;
    this.dimensions.z = geometry.boundingBox.max.z - geometry.boundingBox.min.z;

    group.add( new THREE.Mesh( geometry, material ) );
    
    this.group = group;
    return this;
  }
}