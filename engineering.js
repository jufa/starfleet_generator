import * as THREE from 'three';
import HullComponent from './hull_component.js';

export default class Engineering extends HullComponent {
  constructor({ material }) {
    super();

    // materials
    this.material = material;
    this.deflectorMaterial = new THREE.MeshPhongMaterial( { 
      shininess: 100,
      color: 0xFFDF00,
      emissive: 0x662222,
      side: THREE.DoubleSide,
      flatShading: false 
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

    let deflectorOuterEdge = new THREE.Vector2().copy(engineeringPoints[engineeringPoints.length - 1]);
    deflectorPoints.push(deflectorOuterEdge);

    deflectorPoints.push (
      new THREE.Vector2( 0.2, this.length - this.length * 0.04 )
    );

    deflectorPoints.push (
      new THREE.Vector2( 0.0, this.length + this.length * 0.03 )
    );

    this.engineeringGeometry = new THREE.LatheGeometry(engineeringPoints, 20);
    this.engineeringGeometry.scale(this.widthRatio, 1.0, 1.0);

    this.deflectorGeometry = new THREE.LatheGeometry(deflectorPoints, 20);
    this.deflectorGeometry.scale(this.widthRatio, 1.0, 1.0);

    const matrix = new THREE.Matrix4();
    
    const Szy = this.skew;
    matrix.set(   1,     0,    0,  0,
                  0,     1,  Szy,  0,
                  0,     0,   1,   0,
                  0,     0,   0,   1  );
    this.deflectorGeometry.applyMatrix( matrix );
    this.engineeringGeometry.applyMatrix( matrix );

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