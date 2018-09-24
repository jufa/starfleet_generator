import * as THREE from 'three';
import OrbitControls from 'orbit-controls-es6';
import * as dat from 'dat.gui';
import Stars from './stars.js';
import Nacelle from './nacelle.js';
import Engineering from './engineering.js';
import Primary from './primary.js';
import Neck from './neck.js';
import Pylon from './pylon.js';
import ships from './ships.js';

export default class Builder {
  constructor(window) {
    this.predefinedShips = ships;
    this.window = window;
    this.SKY_COLOUR = 0x111116;
    this.CLEAR_COLOUR = 0xffffff;
    this.dirty = true;
    this.components = [];
    this.controlParams = {};
    this.currentShip = {}; // storage of currently selected predefined ship params independent of control parmas
    this.targetParams = {}; // if a new predefined ship is selected, the target params are stored here
    this.predefinedShipTransitionFrameCounter = 0; // this is decrement to 0 during the predefined ship transition animation
    this.predefinedShipTransitionFrames = 30; // the total number of frames to do the transition animation
    this.transitionRate = 0.15;
    this.maxTransitionTime = 1000; // ms for transition. If it takes longer than this it is forced to finish

    // materials
    this.hullMaterial = new THREE.MeshPhongMaterial( { shininess: 40, color: 0x555555, emissive: 0x222936, side: THREE.DoubleSide, flatShading: false } );

    this.controlConfiguration = {
      // folderName: {paramName: [default, min, max, step]}
      // refer to variable in code as controlParams.folderName_paramName
      nacelle: {
        y: [40, -30, 50, 0.01],
        x: [2.5, -30, 50, 0.01],
        z: [-3.5, -30, 50, 0.01],
        length: [12, 1, 50, 0.01],
        radius: [1, 0.2, 12, 0.01],
        widthRatio: [1, 0.1, 10, 0.01]
      },
      engineering: {
        y: [-25, -60, 60, 0.01],
        z: [6, -30, 50, 0.01],
        length: [10, 1, 50, 0.01],
        radius: [1, 0, 10, 0.01],
        widthRatio: [1, 0.1, 10, 0.01],
        skew: [0, -5, 5, 0.01],
      },
      pylon: {
        nacelleForeOffset: [0.3, 0, 1, 0.01],
        nacelleAftOffset: [0.3, 0, 1, 0.01],
        engineeringForeOffset: [0.3, 0, 1, 0.01],
        engineeringAftOffset: [0.3, 0, 1, 0.01]
      },
      neck: {
        primaryForeOffset: [0.3, 0, 1, 0.01],
        primaryAftOffset: [0.3, 0, 1, 0.01],
        engineeringForeOffset: [0.3, 0, 1, 0.01],
        engineeringAftOffset: [0.3, 0, 1, 0.01]
      },
      primary: {
        y: [-10, -30, 50, 0.01],
        z: [0.5, -30, 50, 0.01],
        radius: [12, 1, 30, 0.01],
        thickness: [4, 1, 10, 0.01],
        widthRatio: [1, 0, 10, 0.01]
      }
    };

    this.init();
    this.initControls();
    this.build();
    this.setPredefinedShip(this.predefinedShips[0].name);
  }

  addLights() {
    var lights = [];
    lights[ 0 ] = new THREE.PointLight( 0xffffff, 0.5, 0 );
    lights[ 1 ] = new THREE.PointLight( 0xffffff, 1.5, 0 );
    lights[ 2 ] = new THREE.PointLight( 0xffffff, 1.0, 0 );

    lights[ 0 ].position.set( 200, 200, 0 );
    lights[ 1 ].position.set( -200, 100, 0 );
    lights[ 2 ].position.set( - 200, - 200, - 200 );

    this.scene.add( lights[ 0 ] );
    this.scene.add( lights[ 1 ] );
    this.scene.add( lights[ 2 ] );

    new Stars({scene: this.scene});
  }

  /**
   * 
   * buildShip
   * 
   * initially creat components
   * 
   */

  build() {
    this.ship = new THREE.Group(); 
    this.ship.name = 'ship';

    this.primary = new Primary({ material: this.hullMaterial });
    this.ship.add(this.primary.group);

    this.nacellePort = new Nacelle({ material: this.hullMaterial});
    this.ship.add(this.nacellePort.group);

    this.nacelleStarboard = new Nacelle({ material: this.hullMaterial });
    this.ship.add(this.nacelleStarboard.group);

    this.engineering = new Engineering({ material: this.hullMaterial });
    this.ship.add(this.engineering.group);

    this.neck = new Neck({ 
      primary: this.primary,
      engineering: this.engineering,
      material: this.hullMaterial 
    });
    this.ship.add(this.neck.group);

    this.portUpperPylon = new Pylon({
      nacelle: this.nacellePort,
      engineering: this.engineering,
      material: this.hullMaterial 
    });
    this.ship.add(this.portUpperPylon.group);

    this.starboardUpperPylon = new Pylon({
      nacelle: this.nacelleStarboard,
      engineering: this.engineering,
      material: this.hullMaterial 
    });
    this.ship.add(this.starboardUpperPylon.group);

    this.ship.rotateX(Math.PI * 0.5);
    this.ship.translateY(10.0);

    this.scene.add(this.ship);
  }

  update(){
    let controlParams = this.controlParams;
    
    this.primary.update({thickness: controlParams.primary_thickness, radius: controlParams.primary_radius, widthRatio: controlParams.primary_widthRatio });
    this.primary.group.position.set(0.0, controlParams.primary_y, controlParams.primary_z);

    let separation = controlParams.nacelle_x * 2.0;
    let aft = controlParams.nacelle_y;
    let height = controlParams.nacelle_z;
    let length = controlParams.nacelle_length;
    let width = controlParams.nacelle_radius;
    let widthRatio = controlParams.nacelle_widthRatio;

    this.nacellePort.update({length: length, width: width, widthRatio: widthRatio});
    this.nacellePort.group.position.set(separation, -aft-length, -height);

    this.nacelleStarboard.update({length: length, width: width, widthRatio: widthRatio });
    this.nacelleStarboard.group.position.set(-separation, -aft-length, -height);

    this.engineering.update ({
      length: controlParams.engineering_length, 
      width: controlParams.engineering_radius, 
      widthRatio: controlParams.engineering_widthRatio,
      skew: controlParams.engineering_skew
    });
    this.engineering.group.position.set(0.0, controlParams.engineering_y, controlParams.engineering_z);

    this.neck.update({
      primaryForeOffset: controlParams.neck_primaryForeOffset,
      primaryAftOffset: controlParams.neck_primaryAftOffset,
      engineeringForeOffset: controlParams.neck_engineeringForeOffset,
      engineeringAftOffset:controlParams.neck_engineeringAftOffset
    });

    this.portUpperPylon.update({
      nacelleForeOffset: controlParams.pylon_nacelleForeOffset,
      nacelleAftOffset: controlParams.pylon_nacelleAftOffset,
      engineeringForeOffset: controlParams.pylon_engineeringForeOffset,
      engineeringAftOffset: controlParams.pylon_engineeringAftOffset
    });

    this.starboardUpperPylon.update({
      nacelleForeOffset: controlParams.pylon_nacelleForeOffset,
      nacelleAftOffset: controlParams.pylon_nacelleAftOffset,
      engineeringForeOffset: controlParams.pylon_engineeringForeOffset,
      engineeringAftOffset: controlParams.pylon_engineeringAftOffset
    });
  }

  init() {
    this.window.addEventListener( 'resize', this.handleWindowResize.bind(this), false );
    this.clock = new THREE.Clock();
    this.container = document.getElementById( 'container' );

    // camera & controls
    this.camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 1600000 );
    this.camera.position.z = 40;
    this.controls = new OrbitControls( this.camera, this.container );
    this.controls.lookSpeed = 0.3;

    // scenes
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( this.SKY_COLOUR );

    // lights
    this.addLights(this.scene);

    // renderer
    this.renderer = new THREE.WebGLRenderer({
      depth: true,
      antialias: true
    });
    this.renderer.setClearColor( this.CLEAR_COLOUR );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    
    this.container.innerHTML = "";
    this.container.appendChild( this.renderer.domElement );

  }

  handleWindowResize() {
    this.camera.aspect = this.window.innerWidth / this.window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( this.window.innerWidth, this.window.innerHeight );
  }

  render() {
    if (this.predefinedShipTransitionFrameCounter >= 0) {
      this.predefinedShipTransitionFrameCounter--;
      this.updatePredifinedShipTransitionAnimation();
    }
    // only update the ship if something has changed in the params
    if (this.dirty) {
      this.update();
      this.dirty = false;
    }
    this.controls.update( shipBuilder.clock.getDelta() );
    this.renderer.render( this.scene, this.camera );
  }
  
  paramDump() {
    let pretty = JSON.stringify(this.controlParams, null, 2)
    console.log(pretty);
  }

  setPredefinedShip(shipName) {
    this.transitionStartTime = setTimeout(function(){
      this.predefinedShipTransitionFrameCounter = 0; //outta time, let's finish animation
    }.bind(this), this.maxTransitionTime);
    let newParams = this.predefinedShips.find(function (ship) { return ship.name == shipName; });
    for (var param in newParams) {
      // this.startParams[param] = this.controlParams[param];
      this.targetParams[param] = newParams[param];
      this.predefinedShipTransitionFrameCounter = this.predefinedShipTransitionFrames;
    }
  }

  updatePredifinedShipTransitionAnimation() {
    for (var param in this.targetParams) {
      let target = this.targetParams[param];
      let current = this.controlParams[param];
      let delta = 0.0;
      if (this.predefinedShipTransitionFrameCounter <= 0) {
        delta = (target - current);
      } else {
        delta = (target - current) * this.transitionRate;
      }
      this.controlParams[param] = current + delta;
    }
    this.dirty = true;
  }

  initControls(){
    var gui = new dat.GUI( { autoPlace: true, width: 400 } );

    // export button:
    gui.add({ export_ship: this.paramDump.bind(this) }, 'export_ship');

    // predefined ships:
    this.currentShip.name = this.predefinedShips[0].name;
    let shipSelector = gui.add( this.currentShip, 'name', this.predefinedShips.map( (ship) => ship.name ) )

    shipSelector.onChange(
      function(newShipName) {
        this.setPredefinedShip(newShipName);
      }.bind(this)
    );
    
    // params:
    for (var folder in this.controlConfiguration) {
      var controls = gui.addFolder(folder);
      let paramsInFolder = this.controlConfiguration[folder];
      for (var key in paramsInFolder) {
        this.controlParams[folder + '_' + key] = paramsInFolder[key][0];
        controls.add(
          this.controlParams, 
          folder + '_' + key, 
          paramsInFolder[key][1],
          paramsInFolder[key][2],
          paramsInFolder[key][3]
        ).onChange(function(){ this.dirty = true }.bind(this))
      }
    }
  }
} // class

var shipBuilder = new Builder(window);

function animate() {
  requestAnimationFrame( animate );
  shipBuilder.render();
}
animate();
