import * as THREE from 'three';
import HullComponent from './hull_component.js';

export default class Pylon extends HullComponent {
  constructor({ nacelle, engineering, material }) {
    super();
    this.material = material;
    this.group = new THREE.Group();
    this.geometry = {};
    this.mesh = {};
    this.nacelle = nacelle;
    this.engineering = engineering;

    return this;
  }

  update({
    nacelleForeOffset, // distance away from fore edge of nacelle hull 1.0 = Full aft
    nacelleAftOffset, // distance away from aft edge of nacelle hull 1.0 = Full fore
    engineeringForeOffset, // distance away from fore edge of engineering hull 1.0 = Full aft
    engineeringAftOffset, // distance away from aft edge of engineering hull 1.0 = Full fore})
    thickness
  }){

    this.clear();

    this.geometry = new THREE.Geometry();

    let nacelle = this.nacelle;
    let engineering = this.engineering;

    let nacelleLength = nacelle.dimensions.y;
    let engineeringLength = engineering.dimensions.y;

    let nacelleCenterTop = nacelle.group.position.z;
    let nacelleCenterX = nacelle.group.position.x
    let nacelleCenterY = nacelle.group.position.y;
    let nacelleCenterZ = nacelle.group.position.z; // nacelleCenterTop + thickness * 0.5;


    let nacelleFore = nacelleCenterY + nacelleLength;
    let nacelleAft = nacelleCenterY;

    let engineeringAft = engineering.group.position.y;
    let engineeringFore = engineeringAft + engineeringLength;
    let engineeringCenterX = engineering.group.position.x;
    let engineeringCenterY = engineering.group.position.y;
    let engineeringCenterZ = engineering.group.position.z;

    nacelleFore -= nacelleLength * nacelleForeOffset;
    nacelleAft += nacelleLength * nacelleAftOffset;

    engineeringFore -= engineeringLength * engineeringForeOffset;
    engineeringAft += engineeringLength * engineeringAftOffset;

    const deltaX = nacelleCenterX - engineeringCenterX;
    const deltaZ = nacelleCenterZ - engineeringCenterZ;
    const angle = Math.atan2(deltaZ, deltaX);
    const thicknessX = thickness * Math.sin(angle);
    const thicknessZ = thickness * Math.cos(angle);

    this.vertices = [
      new THREE.Vector3(nacelleCenterX - thicknessX, nacelleFore, nacelleCenterZ + thicknessZ),
      new THREE.Vector3(nacelleCenterX - thicknessX, nacelleAft, nacelleCenterZ + thicknessZ),
      new THREE.Vector3(engineeringCenterX - thicknessX, engineeringFore, engineeringCenterZ + thicknessZ),
      new THREE.Vector3(engineeringCenterX - thicknessX, engineeringAft, engineeringCenterZ + thicknessZ),

      new THREE.Vector3(nacelleCenterX + thicknessX, nacelleFore, nacelleCenterZ - thicknessZ),
      new THREE.Vector3(nacelleCenterX + thicknessX, nacelleAft, nacelleCenterZ - thicknessZ),
      new THREE.Vector3(engineeringCenterX + thicknessX, engineeringFore, engineeringCenterZ - thicknessZ),
      new THREE.Vector3(engineeringCenterX + thicknessX, engineeringAft, engineeringCenterZ - thicknessZ),
    ];

    this.geometry.vertices = this.vertices;

    // need 8 triangles:
    this.geometry.faces = [
      new THREE.Face3(0,1,2),
      new THREE.Face3(2,1,3),
      new THREE.Face3(5,3,1),
      new THREE.Face3(3,5,7),
      new THREE.Face3(6,7,5),
      new THREE.Face3(4,6,5),
      new THREE.Face3(6,4,0),
      new THREE.Face3(6,0,2),
      new THREE.Face3(0,4,1),
      new THREE.Face3(4,5,1),
    ]

    this.calculateUVs(this.geometry);
    this.mesh = new THREE.Mesh( this.geometry, this.material.clone() );
    this.group.add( this.mesh );
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