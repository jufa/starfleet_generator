import * as THREE from 'three';

const COLORS = [
  0xffffff,
  0x777777,
  0x3a3a3a,
  0x1a1a66,
]

export default class Stars {

  constructor({
    scene
  }){
    var i, r = 450.0, starsGeometry = [ new THREE.Geometry(), new THREE.Geometry() ];
    for ( i = 0; i < 200; i ++ ) {
      var vertex = new THREE.Vector3();
      vertex.x = Math.random() * 2 - 1;
      vertex.y = Math.random() * 2 - 1;
      vertex.z = Math.random() * 2 - 1;
      vertex.multiplyScalar( r );
      starsGeometry[ 0 ].vertices.push( vertex );
    }
    for ( i = 0; i < 100; i ++ ) {
      var vertex = new THREE.Vector3();
      vertex.x = Math.random() * 2 - 1;
      vertex.y = Math.random() * 2 - 1;
      vertex.z = Math.random() * 2 - 1;
      vertex.multiplyScalar( r );
      starsGeometry[ 1 ].vertices.push( vertex );
    }
    var stars;
    var starsMaterials = [
      new THREE.PointsMaterial( { color: COLORS[0], size: 2, sizeAttenuation: false } ),
      new THREE.PointsMaterial( { color: COLORS[0], size: 1, sizeAttenuation: false } ),
      new THREE.PointsMaterial( { color: COLORS[1], size: 2, sizeAttenuation: false } ),
      new THREE.PointsMaterial( { color: COLORS[2], size: 2, sizeAttenuation: false } ),
      new THREE.PointsMaterial( { color: COLORS[3], size: 2, sizeAttenuation: false } ),
      new THREE.PointsMaterial( { color: COLORS[3], size: 1, sizeAttenuation: false } )
    ];
    for ( i = 10; i < 30; i ++ ) {
      stars = new THREE.Points( starsGeometry[ i % 2 ], starsMaterials[ i % 6 ] );
      stars.rotation.x = Math.random() * 6;
      stars.rotation.y = Math.random() * 6;
      stars.rotation.z = Math.random() * 6;
      stars.scale.setScalar( i * 10 );
      stars.matrixAutoUpdate = false;
      stars.updateMatrix();
      scene.add( stars );
    }
  }
}