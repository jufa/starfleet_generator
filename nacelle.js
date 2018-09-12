var THREE = require('three');

export default class Nacelle {
  constructor({
    length = 1.0,
    width = 1.8,
    widthRatio = 1.3,
    material
  } = {}) {
    var group = new THREE.Group();

    // nacelle

    var geometry = new THREE.BufferGeometry();

    var points = [];
    // nacelle body
    var nacellePoints = 10.0;
    for ( var i = 0; i <= nacellePoints; i ++ ) {
      points.push( 
        new THREE.Vector2( 
          (Math.sin(i / nacellePoints * Math.PI / 2.0) * 0.7  + 0.3) * width, 
          i / nacellePoints * length
        ) 
      );
    }

    // bussard
    var bussardPoints = 20.0;
    for ( var i = bussardPoints; i >= 0; i-- ) {
      points.push(
        new THREE.Vector2(
          Math.pow(i / bussardPoints, 0.4) * width * 0.9,
          length + (1.0 - i / bussardPoints) * width * 1.5
        )
      );
    }
    
    var geometry = new THREE.LatheGeometry(points);
    geometry.scale(widthRatio, 1.0, 1.0);

    // make group

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