import * as THREE from 'three';

export default class Engineering {
  constructor({
    length = 1.0,
    width = 50.0,
    widthRatio = 1.0,
    material
  } = {}) {
    var group = new THREE.Group();

    var engineeringPoints = [];
    var engineeringPointCount = 10;
    for ( var i = 0; i <= 10; i ++ ) {
      engineeringPoints.push( 
        new THREE.Vector2(
          Math.sin( i / engineeringPointCount * Math.PI * 0.8) * width,
          i / engineeringPointCount * length
        )
      );
    }

    // deflector
    var deflectorPoints = [];

    let deflectorOuterEdge = new THREE.Vector2().copy(engineeringPoints[engineeringPoints.length - 1]);
    deflectorPoints.push(deflectorOuterEdge);

    deflectorPoints.push (
      new THREE.Vector2( 0.2, length - length * 0.04 )
    );

    deflectorPoints.push (
      new THREE.Vector2( 0.0, length + length * 0.03 )
    );

    var engineeringGeometry = new THREE.LatheGeometry(engineeringPoints, 20);
    engineeringGeometry.scale(widthRatio, 1.0, 1.0);

    engineeringGeometry.computeBoundingBox();
    this.dimensions = {};
    this.dimensions.x = engineeringGeometry.boundingBox.max.x - engineeringGeometry.boundingBox.min.x;
    this.dimensions.y = engineeringGeometry.boundingBox.max.y - engineeringGeometry.boundingBox.min.y;
    this.dimensions.z = engineeringGeometry.boundingBox.max.z - engineeringGeometry.boundingBox.min.z;

    var deflectorGeometry = new THREE.LatheGeometry(deflectorPoints, 20);
    deflectorGeometry.scale(widthRatio, 1.0, 1.0);

    group.add( new THREE.Mesh( engineeringGeometry, material ) );

    var deflectorMaterial = new THREE.MeshPhongMaterial( { 
      shininess: 100,
      color: 0xFFDF00,
      emissive: 0x662222,
      side: THREE.DoubleSide,
      flatShading: false 
    } );

    group.add( new THREE.Mesh( deflectorGeometry, deflectorMaterial ) );

    this.group = group;
    return this;
  }
}