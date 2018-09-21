import * as THREE from 'three';

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

    // nacelle body
    var nacellePoints = [
      new THREE.Vector2( 0.0, 1.0 )
    ];

    var nacellePointCount = 5.0;
    for ( var i = 0; i <= nacellePointCount; i++ ) {
      nacellePoints.push( 
        new THREE.Vector2( 
          (Math.sin(i / nacellePointCount * Math.PI / 2.0) * 0.7 + 0.3) * width, 
          i / nacellePointCount * length
        )
      );
    }

    // bussard
    var bussardPointCount = 9.0;
    var bussardPoints = []
    for ( var i = bussardPointCount; i >= 0; i-- ) {
      bussardPoints.push(
        new THREE.Vector2(
          Math.pow(i / bussardPointCount, 0.4) * width * 0.9,
          length + (1.0 - i / bussardPointCount) * width * 1.5
        )
      );
    }
    
    var nacelleGeometry = new THREE.LatheGeometry(nacellePoints, 20);
    nacelleGeometry.scale(widthRatio, 1.0, 1.0);

    var bussardGeometry = new THREE.LatheGeometry(bussardPoints, 20);
    bussardGeometry.scale(widthRatio, 1.0, 1.0);

    // make group

    nacelleGeometry.computeBoundingBox();
    this.dimensions = {};
    this.dimensions.x = nacelleGeometry.boundingBox.max.x - nacelleGeometry.boundingBox.min.x;
    this.dimensions.y = nacelleGeometry.boundingBox.max.y - nacelleGeometry.boundingBox.min.y;
    this.dimensions.z = nacelleGeometry.boundingBox.max.z - nacelleGeometry.boundingBox.min.z;

    var bussardMaterial = new THREE.MeshPhongMaterial({ 
      shininess: 100, 
      color: 0x000055,
      emissive: 0xff0000,
      flatShading: false,
    });

    group.add( new THREE.Mesh( nacelleGeometry, material ) );
    group.add( new THREE.Mesh( bussardGeometry, bussardMaterial ) );

    this.group = group;
    return this;
  }
}