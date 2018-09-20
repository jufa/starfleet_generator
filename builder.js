var THREE = require('three');
var dat = require('./dat.gui.min.js');
require('./orbit_controls.js');

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
    this.SKY_COLOUR = 0x111133;
    this.CLEAR_COLOUR = 0xffffff;

    this.controlConfiguration = {
      // folderName: {paramName: [default, min, max, step]}
      // refer to variable in code as controlParams.folderName_paramName
      nacelle: {
        y: [40, -30, 50, 0.1],
        x: [2.5, -30, 50, 0.1],
        z: [-3.5, -30, 50, 0.1],
        length: [12, -30, 50, 0.1],
        radius: [1, 0.2, 12, 0.01],
        widthRatio: [1, 0.1, 10, 0.1]
      },
      engineering: {
        y: [-25, -60, 60, 0.1],
        z: [6, -30, 50, 0.1],
        length: [10, 1, 50, 0.1],
        radius: [1, 0, 10, 0.1],
        widthRatio: [1, 0.1, 10, 0.1]
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
        y: [-10, -30, 50, 0.1],
        z: [0.5, -30, 50, 0.1],
        radius: [12, 1, 30, 0.1],
        thickness: [4, 1, 10, 0.1],
        widthRatio: [1, 0, 10, 0.1]
      }
    };
    this.controlParams = {};
    this.currentShip = {}; // storage of currently selected predefined ship params independent of control parmas
    this.targetParams = {}; // if a new predefined ship is selected, the target params are stored here
    this.predefinedShipTransitionFrameCounter = 0; // this is decrement to 0 during the predefined ship transition animation
    this.predefinedShipTransitionFrames = 300; // the total number of frames to do the transition animation

    this.init();
    this.initControls();
    this.setPredefinedShip(this.predefinedShips[0].name);
  }

  addLights(scene) {
    var lights = [];
    lights[ 0 ] = new THREE.PointLight( 0xffffff, 1.0, 0 );
    lights[ 1 ] = new THREE.PointLight( 0xffffff, 1.0, 0 );
    lights[ 2 ] = new THREE.PointLight( 0xffffff, 1.0, 0 );

    lights[ 0 ].position.set( 100, 100, 0 );
    lights[ 1 ].position.set( 100, 100, 100 );
    lights[ 2 ].position.set( - 100, - 100, - 100 );

    scene.add( lights[ 0 ] );
    scene.add( lights[ 1 ] );
    scene.add( lights[ 2 ] );
  }

  buildShip(scene, controlParams) {
    var prevShip = scene.getObjectByName('ship');
    scene.remove( prevShip );
    
    var ship = new THREE.Group(); 
    ship.name = 'ship'

    //materials
    var mainMaterial = new THREE.MeshPhongMaterial( { shininess: 50, color: 0x666666, emissive: 0x222233, side: THREE.DoubleSide, flatShading: true } );
    
    var primary = new Primary({thickness: controlParams.primary_thickness, radius: controlParams.primary_radius, widthRatio: controlParams.primary_widthRatio, material: mainMaterial});
    primary.group.position.set(0.0, controlParams.primary_y, controlParams.primary_z);
    ship.add(primary.group);

    var separation = controlParams.nacelle_x * 2.0;
    var aft = controlParams.nacelle_y;
    var height = controlParams.nacelle_z;
    var length = controlParams.nacelle_length;
    var width = controlParams.nacelle_radius;

    var nacellePort= new Nacelle({length: length, width: width, material: mainMaterial});
    nacellePort.group.position.set(separation, -aft-length, -height);
    ship.add(nacellePort.group);

    var nacelleStarboard = new Nacelle({length: length, width: width, material: mainMaterial});
    nacelleStarboard.group.position.set(-separation, -aft-length, -height);
    ship.add(nacelleStarboard.group);

    var engineering = new Engineering({
      length: controlParams.engineering_length, 
      width: controlParams.engineering_radius, 
      widthRatio: controlParams.engineering_widthRatio, 
      material: mainMaterial
    });
    engineering.group.position.set(0.0, controlParams.engineering_y, controlParams.engineering_z);
    ship.add(engineering.group);

    var neck = new Neck({
      primary: primary,
      engineering: engineering,
      primaryForeOffset: controlParams.neck_primaryForeOffset,
      primaryAftOffset: controlParams.neck_primaryAftOffset,
      engineeringForeOffset: controlParams.neck_engineeringForeOffset,
      engineeringAftOffset:controlParams.neck_engineeringAftOffset,
      material: mainMaterial
    });
    ship.add(neck);

    var portUpperPylon = new Pylon({
      nacelle: nacellePort,
      engineering: engineering,
      nacelleForeOffset: controlParams.pylon_nacelleForeOffset,
      nacelleAftOffset: controlParams.pylon_nacelleAftOffset,
      engineeringForeOffset: controlParams.pylon_engineeringForeOffset,
      engineeringAftOffset: controlParams.pylon_engineeringAftOffset,
      material: mainMaterial
    });
    ship.add(portUpperPylon);

    var starboardUpperPylon = new Pylon({
      nacelle: nacelleStarboard,
      engineering: engineering,
      nacelleForeOffset: controlParams.pylon_nacelleForeOffset,
      nacelleAftOffset: controlParams.pylon_nacelleAftOffset,
      engineeringForeOffset: controlParams.pylon_engineeringForeOffset,
      engineeringAftOffset: controlParams.pylon_engineeringAftOffset,
      material: mainMaterial
    });
    ship.add(starboardUpperPylon);

    ship.rotateX(Math.PI * 0.5);
    ship.translateY(10.0);

    scene.add(ship);
  }

  init() {
    this.window.addEventListener( 'resize', this.handleWindowResize.bind(this), false );
    this.clock = new THREE.Clock();
    this.container = document.getElementById( 'container' );

    // camera & controls
    this.camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 1600000 );
    this.camera.position.z = 40;
    this.controls = new THREE.OrbitControls( this.camera, this.container );
    this.controls.lookSpeed = 0.3;

    // scenes
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( this.SKY_COLOUR );

    // lights
    this.addLights(this.scene);

    // renderer
    this.renderer = new THREE.WebGLRenderer({
      depth: true,
      alpha: true,
      transparency: THREE.OrderIndependentTransperancy,
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
    var delta = this.clock.getDelta();

    if (this.predefinedShipTransitionFrameCounter >= 0) {
      this.updatePredifinedShipTransitionAnimation();
    }
    this.buildShip(this.scene, this.controlParams);
    this.controls.update( delta );
    this.renderer.clear();
    this.renderer.render( this.scene, this.camera );
    this.renderer.clearDepth();
  }
  
  paramDump() {
    let pretty = JSON.stringify(this.controlParams, null, 2)
    console.log(pretty);
  }

  setPredefinedShip(shipName) {
    let newParams = this.predefinedShips.find(function (ship) { return ship.name == shipName; });
    for (var param in newParams) {
      // this.startParams[param] = this.controlParams[param];
      this.targetParams[param] = newParams[param];
      this.predefinedShipTransitionFrameCounter = this.predefinedShipTransitionFrames;
    }
  }

  updatePredifinedShipTransitionAnimation() {
    this.predefinedShipTransitionFrameCounter--;
    for (var param in this.targetParams) {
      let target = this.targetParams[param];
      let current = this.controlParams[param];
      let delta = 0.0;
      if (this.predefinedShipTransitionFrameCounter <= 0) {
        delta = (target - current)  
      } else {
        delta = (target - current) * 0.05;
      }
      this.controlParams[param] = current + delta;
    }
  }

  initControls(){
    var gui = new dat.GUI( { autoPlace: true, width: 400 } );

    // export button:
    gui.add({ export_ship: this.paramDump.bind(this) }, 'export_ship');

    // predefined ships:
    this.currentShip.name = this.predefinedShips[0].name;
    let shipSelector = gui.add( this.currentShip, 'name', this.predefinedShips.map( (ship) => ship.name ) ).listen();

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
        ).listen()
      }
    }
  }
} // class

var ship = new Builder(window);

function animate() {
  requestAnimationFrame( animate );
  ship.render();
}
animate();
