import * as THREE from 'three';
import * as materials from './materials.js';
import HullComponent from './hull_component.js';

export default class Engineering extends HullComponent {
  constructor() {
    super();

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
    skew = 0.0,
    segments = 32,
    undercut = 0.0,
    undercutStart = 0.0,
    undercutCurve = 1.0,
    dishRadius = 1.0,
    dishInset = 0.0,
    materialIndex = 0,
  }) {

    this.clear();

    // params
    this.length = length;
    this.width = width;
    this.widthRatio = widthRatio;
    this.skew = skew;

    // engineering hull
    var engineeringPoints = [new THREE.Vector2(0, 0)];
    var engineeringPointCount = 40;
    for ( var i = 0; i <= engineeringPointCount; i ++ ) {
      engineeringPoints.push(
        new THREE.Vector2(
          Math.sin( i / engineeringPointCount * Math.PI * 0.65 + 0.35) * this.width,
          i / engineeringPointCount * this.length
        )
      );
    }

    engineeringPoints[engineeringPoints.length - 1].x = engineeringPoints[engineeringPoints.length - 1].x * dishRadius;
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
          deflectorOuterEdge.y - Math.sin(Math.PI*r/2.0) * c - dishInset
        )
      );
    };

    // antenna length
    const lastDishPoint = deflectorPoints[deflectorPoints.length - 1];
    lastDishPoint.setX(deflectorOuterEdge.x * 0.1);

    deflectorPoints.push (
      new THREE.Vector2( 0.0, deflectorOuterEdge.y + 0.9 )
    );

    this.engineeringGeometry = new THREE.LatheGeometry(engineeringPoints, segments);
    this.engineeringGeometry.scale(this.widthRatio, 1.0, 1.0);

    // undercut cargo doors:
    const positions = this.engineeringGeometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      let y = positions[i + 1]; // Get Y value
      let z = positions[i + 2]; // Get Z value
      let zNormalized = z / width;
      let yNormalized = y / length;
      let compression = 1.0;
      let offsetZ = 0.0;
      if ((yNormalized < (1.0 - undercutStart) && zNormalized >= 0.0)) {
        let compressionAmount = 1.0 + (yNormalized - (1-undercutStart))/(1-undercutStart);
        compressionAmount = compressionAmount**undercutCurve + (1.0 - undercut);
        compression = Math.min(1.0, compressionAmount) ;
      }
      let newZ = z * compression; // Stretch along the Z-axis
      positions[i + 2] = newZ; // Update Z position
    }
    
    this.engineeringGeometry.attributes.position.needsUpdate = true;





    this.deflectorGeometry = new THREE.LatheGeometry(deflectorPoints, segments);
    this.deflectorGeometry.scale(this.widthRatio, 1.0, 1.0);

    const matrix = new THREE.Matrix4();

    const Szy = this.skew;
    matrix.set(   1,     0,    0,  0,
                  0,     1,  Szy,  0,
                  0,     0,   1,   0,
                  0,     0,   0,   1  );
    this.deflectorGeometry.applyMatrix4( matrix );
    this.engineeringGeometry.applyMatrix4( matrix );

    this.engineeringMesh = new THREE.Mesh( this.engineeringGeometry, materials.engMaterial[materialIndex] );
    this.deflectoMesh = new THREE.Mesh( this.deflectorGeometry, materials.deflectorMaterial[materialIndex] );

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