import * as THREE from 'three';

export default class Primary {
  constructor({
    thickness = 4.0,
    radius = 2.0,
    widthRatio = 1.3,
    material
  } = {}) {
    
    var group = new THREE.Group();

    // main saucer
    var geometry = new THREE.BufferGeometry();

    var points = [];
    const saucerPointCount = 9;
    for ( var i = 0; i <= saucerPointCount; i ++ ) {
      points.push(
        new THREE.Vector2( 
          Math.sin( i / saucerPointCount * Math.PI ) * radius,
          i / saucerPointCount * thickness
        ) 
      );
    }

    const foreExclusionAngle = 0.0;
    var geometry = new THREE.LatheGeometry(points, 64, Math.PI + foreExclusionAngle, 2.0 * ( Math.PI - foreExclusionAngle) );
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