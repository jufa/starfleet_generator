import * as THREE from 'three';
import HullComponent from './hull_component.js';

export default class Nacelle extends HullComponent {
  constructor({ material }) {
    super();

    this.material = material;
    this.group = new THREE.Group();
    this.dimensions = {};

    this.nacelleGeometry = {};
    this.bussardGeometry = {};

    this.nacelleMesh = {};
    this.bussardMesh = {};

    var tex = new THREE.TextureLoader().load( "./images/bussard_em.png");
    tex.wrapS = THREE.MirroredRepeatWrapping;
    tex.wrapT = THREE.MirroredRepeatWrapping;
    tex.repeat.set( 17, 2.0 );
    this.bussardInnerTexture = tex;
    tex.colorSpace = THREE.SRGBColorSpace;

    this.bussardMaterial = new THREE.MeshStandardMaterial({
      color: 0xff3300,
      emissive: 0xff0000,
      emissiveIntensity: 0.8,
      opacity: 0.5,
      transparent: true,
      flatShading: false,
      metalnessMap: tex,
      roughnessMap: tex,
      metalness: 10,
      roughness: 0.9,
    });
    

    this.bussardInnerMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0xff0000,
      emissiveIntensity: 0.8,
      transparent: false,
      flatShading: false,
      map: tex,
      emissiveMap: tex,
      metalnessMap: tex,
      roughnessMap: tex,
      // alphaMap: tex,
      // alphaTest: -0.01,
      // bumpMap: tex,
      // bumpScale: 1.0,
      metalness: 10.0,
      roughness: 0.0,
    });

    return this;
  }

  update({ length, width, widthRatio, rotation=0 }) {

    this.clear();

    // nacelle body
    var nacellePoints = [
      new THREE.Vector2( 0.0, 0.0 )
    ];

    var nacellePointCount = 5.0;
    var r = 0.0;
    
    for ( var i = 0; i <= nacellePointCount; i++ ) {  
      r = (Math.sin(i / nacellePointCount * Math.PI / 2.0) * 0.5 + 0.5) * width * 1.0;
      nacellePoints.push(
        new THREE.Vector2(
          r,
          i / nacellePointCount * length
        )
      );
    }

    // bussard
    var bussardPointCount = 32.0;
    var bussardPoints = [];
    for ( var i = bussardPointCount; i >= 0; i-- ) {
      bussardPoints.push(
        new THREE.Vector2(
          Math.pow(i / bussardPointCount, 0.4) * width * 1.0,
          length + (1.0 - i / bussardPointCount) * width * 1.5
        )
      );
    }

    // bussard inner
    var bussardInnerPoints = [];
    for ( var i = bussardPointCount; i >= 0; i-- ) {
      bussardInnerPoints.push(
        new THREE.Vector2(
          Math.pow(i / bussardPointCount, 0.4) * width * 0.97,
          length + (0.6 - i / bussardPointCount) * width * 2.0
        )
      );
    }
    

    this.nacelleGeometry = new THREE.LatheGeometry(nacellePoints, 36);
    this.nacelleGeometry.scale(widthRatio, 1.0, 1.0);
    this.nacelleGeometry.rotateY(rotation);

    this.bussardGeometry = new THREE.LatheGeometry(bussardPoints, 36);
    this.bussardGeometry.scale(widthRatio, 1.0, 1.0);
    this.bussardGeometry.rotateY(rotation);

    this.bussardInnerGeometry = new THREE.LatheGeometry(bussardInnerPoints, 16);
    this.bussardInnerGeometry.scale(widthRatio, 1.0, 1.0);
    this.bussardInnerGeometry.rotateY(rotation);

    this.nacelleMesh = new THREE.Mesh( this.nacelleGeometry, this.material.clone() );
    this.bussardMesh = new THREE.Mesh( this.bussardGeometry, this.bussardMaterial );
    this.bussardInnerMesh = new THREE.Mesh( this.bussardInnerGeometry, this.bussardInnerMaterial );

    this.group.add( this.nacelleMesh );
    this.group.add( this.bussardMesh );
    this.group.add( this.bussardInnerMesh );

    this.computeBoundingBox(this.nacelleGeometry);
  }

  computeBoundingBox(measuredGeom){
    measuredGeom.computeBoundingBox();
    this.dimensions.x = measuredGeom.boundingBox.max.x - measuredGeom.boundingBox.min.x;
    this.dimensions.y = measuredGeom.boundingBox.max.y - measuredGeom.boundingBox.min.y;
    this.dimensions.z = measuredGeom.boundingBox.max.z - measuredGeom.boundingBox.min.z;
  }

  rotateBussard(rotation){
    // rotate the bussardInnerMesh TextureMap:
    this.bussardInnerTexture.offset.x = rotation;
    // this.bussardInnerTexture.offset.y = rotation;
    // this.bussardInnerTexture.rotation = rotation*10.0;
    // this.tex = rotation;
  }


  clear(){
    if (this.nacelleGeometry['dispose']) {
      this.nacelleGeometry.dispose();
      this.bussardGeometry.dispose();
      for (var i = this.group.children.length - 1; i >= 0; i--) {
        this.group.remove(this.group.children[i]);
      }
    }
  }
}