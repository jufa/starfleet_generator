import * as THREE from 'three';
import HullComponent from './hull_component.js';

export default class Primary extends HullComponent{
  constructor({ material }) {
    super();
    this.material = material;
    this.group = new THREE.Group();
    this.group.rotateX( Math.PI / 2.0); 
    this.geometry = {};
    this.mesh = {}
    this.dimensions = {};

    return this;
  }

  update({
    thickness,
    radius,
    widthRatio
  }) {

    this.clear();

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
    this.geometry = new THREE.LatheGeometry(points, 64, Math.PI + foreExclusionAngle, 2.0 * ( Math.PI - foreExclusionAngle) );
    this.geometry.scale(widthRatio, 1.0, 1.0);
    this.computeBoundingBox(this.geometry);

    this.mesh = new THREE.Mesh( this.geometry, this.material.clone() );

    this.group.add( this.mesh );       
  }

  computeBoundingBox(measuredGeom) {
    measuredGeom.computeBoundingBox();
    this.dimensions.x = measuredGeom.boundingBox.max.x - measuredGeom.boundingBox.min.x;
    this.dimensions.y = measuredGeom.boundingBox.max.y - measuredGeom.boundingBox.min.y;
    this.dimensions.z = measuredGeom.boundingBox.max.z - measuredGeom.boundingBox.min.z;
  }

  clear(){
    if (this.geometry['dispose']) {
      this.geometry.dispose();
      for (var i = this.group.children.length - 1; i >= 0; i--) {
        this.group.remove(this.group.children[i]);
      }
    }
  }
}