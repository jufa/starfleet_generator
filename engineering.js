import * as THREE from 'three';
import HullComponent from './hull_component.js';

export default class Engineering extends HullComponent {
  constructor({ material }) {
    super();

    var tex = new THREE.TextureLoader().load( "./images/dish.png");
    tex.wrapS = THREE.MirroredRepeatWrapping;
    tex.wrapT = THREE.MirroredRepeatWrapping;
    tex.repeat.set( 4, 1 );

    var texSp = new THREE.TextureLoader().load( "./images/dish_sp.png");
    texSp.wrapS = THREE.MirroredRepeatWrapping;
    texSp.wrapT = THREE.MirroredRepeatWrapping;
    texSp.repeat.set( 12, 1 );

    var texEm = new THREE.TextureLoader().load( "./images/dish_sp.png");
    texEm.wrapS = THREE.MirroredRepeatWrapping;
    texEm.wrapT = THREE.MirroredRepeatWrapping;
    texEm.repeat.set( 24, 4 );
    texEm.colorSpace = THREE.SRGBColorSpace;

    // materials
    this.material = material
    this.deflectorMaterial = new THREE.MeshStandardMaterial( {
      color: 0xffdd22,
      emissive: 0xdd9900,
      emissiveMap: texEm,
      emissiveIntensity: 3.0,
      side: THREE.DoubleSide,
      flatShading: true,
      map: texSp,
      metalnessMap: tex,
      metalness: 10.0,
      roughnessMap: tex,
      roughness: 0.6,
      // bumpMap: texSp,
      // bumpScale: 0.09,
    } );
    this.group = new THREE.Group();
    this.dimensions = {};

    this.engineeringGeometry = {};
    this.deflectorGeometry = {};

    this.engineeringMesh = {};
    this.deflectorMesh = {};

    //dimensions
    this.dimensions = {};
    return this;
  }

  update({
    length = 1.0,
    width = 50.0,
    widthRatio = 1.0,
    skew = 0.0
  }) {

    this.clear();

    // params
    this.length = length;
    this.width = width;
    this.widthRatio = widthRatio;
    this.skew = skew;

    // engineering hull
    var engineeringPoints = [new THREE.Vector2(0, 0)];
    var engineeringPointCount = 10;
    for ( var i = 0; i <= 10; i ++ ) {
      engineeringPoints.push(
        new THREE.Vector2(
          Math.sin( i / engineeringPointCount * Math.PI * 0.65 + 0.35) * this.width,
          i / engineeringPointCount * this.length
        )
      );
    }

    // deflector array
    var deflectorPoints = [];

    const deflectorOuterEdge = new THREE.Vector2().copy(engineeringPoints[engineeringPoints.length - 1]);
    deflectorPoints.push(deflectorOuterEdge);

    // dish curve
    let c = 0.2;
    const deflectorPointCount = 8.0;
    let r;
    for (let i = 0.0; i <= deflectorPointCount; i++) {
      r =  i / deflectorPointCount;
      deflectorPoints.push (
        new THREE.Vector2(
          deflectorOuterEdge.x * (1.0 - r),
          deflectorOuterEdge.y - Math.sin(Math.PI*r/2.0) * c - 0.05
        )
      );
    };

    // antenna length
    const lastDishPoint = deflectorPoints[deflectorPoints.length - 1];
    lastDishPoint.setX(deflectorOuterEdge.x * 0.1);

    deflectorPoints.push (
      new THREE.Vector2( 0.0, deflectorOuterEdge.y + 0.9 )
    );

    this.engineeringGeometry = new THREE.LatheGeometry(engineeringPoints, 40);
    this.engineeringGeometry.scale(this.widthRatio, 1.0, 1.0);

    this.deflectorGeometry = new THREE.LatheGeometry(deflectorPoints, 36);
    this.deflectorGeometry.scale(this.widthRatio, 1.0, 1.0);

    const matrix = new THREE.Matrix4();

    const Szy = this.skew;
    matrix.set(   1,     0,    0,  0,
                  0,     1,  Szy,  0,
                  0,     0,   1,   0,
                  0,     0,   0,   1  );
    this.deflectorGeometry.applyMatrix4( matrix );
    this.engineeringGeometry.applyMatrix4( matrix );

    this.engineeringMesh = new THREE.Mesh( this.engineeringGeometry, this.material.clone() );
    this.deflectoMesh = new THREE.Mesh( this.deflectorGeometry, this.deflectorMaterial );

    this.group.add( this.engineeringMesh );
    this.group.add( this.deflectoMesh );

    this.computeBoundingBox(this.engineeringGeometry);
  }

  /**
   * computeBoundingBox
   *
   * the dimensions object contains the bounding box for the component,
   * used to determin its dimensions vs other ships' components in a ship builder
   *
   */

  computeBoundingBox(measuredGeom) {
    measuredGeom.computeBoundingBox();
    this.dimensions.x = measuredGeom.boundingBox.max.x - measuredGeom.boundingBox.min.x;
    this.dimensions.y = measuredGeom.boundingBox.max.y - measuredGeom.boundingBox.min.y;
    this.dimensions.z = measuredGeom.boundingBox.max.z - measuredGeom.boundingBox.min.z;
  }

  /**
   *
   * clear
   *
   * properly dispose of references, free up GPU memory for the component
   *
   */

  clear(){
    if (this.deflectorGeometry['dispose']) {
      this.deflectorGeometry.dispose();
      this.engineeringGeometry.dispose();
      for (var i = this.group.children.length - 1; i >= 0; i--) {
        this.group.remove(this.group.children[i]);
      }
    }
  }
}