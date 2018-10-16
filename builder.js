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
    this.hullMaterial = new THREE.MeshPhongMaterial({
      shininess: 50,
      color: 0x555555,
      emissive: 0x444455,
      side: THREE.DoubleSide,
      flatShading: false
    });

    this.controlConfiguration = {
      // folderName: {paramName: [default, min, max, step]}
      // refer to variable in code as controlParams.folderName_paramName
      nacelle: {
        y: [40, -30, 50, 0.01],
        x: [2.5, -30, 50, 0.01],
        z: [-3.5, -30, 50, 0.01],
        length: [12, 1, 50, 0.01],
        radius: [1, 0.2, 12, 0.01],
        widthRatio: [1, 0.1, 10, 0.01],
        rotation: [0, -Math.PI / 2, Math.PI / 2, 0.01],
      },
      nacelleLower: {
        y: [40, -30, 50, 0.01],
        x: [2.5, -30, 50, 0.01],
        z: [-3.5, -30, 50, 0.01],
        length: [12, 1, 50, 0.01],
        radius: [1, 0.2, 12, 0.01],
        widthRatio: [1, 0.1, 10, 0.01],
        rotation: [0, -Math.PI / 2, Math.PI / 2, 0.01],
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
        engineeringAftOffset: [0.3, 0, 1, 0.01],
        thickness: [0.15, 0.01, 5, 0.01],
      },
      pylonLower: {
        nacelleForeOffset: [0.3, 0, 1, 0.01],
        nacelleAftOffset: [0.3, 0, 1, 0.01],
        engineeringForeOffset: [0.3, 0, 1, 0.01],
        engineeringAftOffset: [0.3, 0, 1, 0.01],
        thickness: [0.15, 0.01, 5, 0.01],
      },
      neck: {
        primaryForeOffset: [0.3, 0, 1, 0.01],
        primaryAftOffset: [0.3, 0, 1, 0.01],
        engineeringForeOffset: [0.3, 0, 1, 0.01],
        engineeringAftOffset: [0.3, 0, 1, 0.01],
        thickness: [0.15, 0.01, 5, 0.01],
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
    lights[ 0 ] = new THREE.PointLight( 0xffffff, 1.0, 0 );
    lights[ 1 ] = new THREE.PointLight( 0xffffff, 1.0, 0 );

    lights[ 0 ].position.set( 50, 50, 0 );
    lights[ 1 ].position.set( -50, -50, 0 );

    this.scene.add( lights[ 0 ] );
    this.scene.add( lights[ 1 ] );

    new Stars({scene: this.scene});
  }

  /**
   *
   * buildShip
   *
   * initially create components
   *
   */

  build() {
    this.ship = new THREE.Group();
    this.ship.name = 'ship';

    this.primary = new Primary({ material: this.hullMaterial });
    this.mount(this.ship, this.primary.group);

    this.nacelleUpperPort = new Nacelle({ material: this.hullMaterial});
    this.mount(this.ship, this.nacelleUpperPort.group);

    this.nacelleUpperStarboard = new Nacelle({ material: this.hullMaterial });
    this.mount(this.ship, this.nacelleUpperStarboard.group);

    this.nacelleLowerPort = new Nacelle({ material: this.hullMaterial});
    this.mount(this.ship, this.nacelleLowerPort.group);

    this.nacelleLowerStarboard = new Nacelle({ material: this.hullMaterial });
    this.mount(this.ship, this.nacelleLowerStarboard.group);

    this.engineering = new Engineering({ material: this.hullMaterial });
    this.mount(this.ship, this.engineering.group);

    this.neck = new Neck({
      primary: this.primary,
      engineering: this.engineering,
      material: this.hullMaterial
    });
    this.mount(this.ship, this.neck.group);

    this.portUpperPylon = new Pylon({
      nacelle: this.nacelleUpperPort,
      engineering: this.engineering,
      material: this.hullMaterial
    });
    this.mount(this.ship, this.portUpperPylon.group);

    this.starboardUpperPylon = new Pylon({
      nacelle: this.nacelleUpperStarboard,
      engineering: this.engineering,
      material: this.hullMaterial
    });
    this.mount(this.ship, this.starboardUpperPylon.group);

    this.portLowerPylon = new Pylon({
      nacelle: this.nacelleLowerPort,
      engineering: this.engineering,
      material: this.hullMaterial
    });
    this.mount(this.ship, this.portLowerPylon.group);

    this.starboardLowerPylon = new Pylon({
      nacelle: this.nacelleLowerStarboard,
      engineering: this.engineering,
      material: this.hullMaterial
    });
    this.mount(this.ship, this.starboardLowerPylon.group);

    this.ship.rotateX(Math.PI * 0.5);
    this.ship.translateY(10.0);

    this.scene.add(this.ship);
  }

  mount(combined, part) {
    combined.add(part);
  }

  update(){
    let controlParams = this.controlParams;

    this.primary.group.visible = this.controlParams.primary_toggle;
    this.primary.update({thickness: controlParams.primary_thickness, radius: controlParams.primary_radius, widthRatio: controlParams.primary_widthRatio });
    this.primary.group.position.set(0.0, controlParams.primary_y, controlParams.primary_z);

    let separation = controlParams.nacelle_x * 2.0;
    let aft = controlParams.nacelle_y;
    let height = controlParams.nacelle_z;
    let length = controlParams.nacelle_length;
    let width = controlParams.nacelle_radius;
    let widthRatio = controlParams.nacelle_widthRatio;
    let rotation = controlParams.nacelle_rotation;

    let separation2 = controlParams.nacelleLower_x * 2.0;
    let aft2 = controlParams.nacelleLower_y;
    let height2 = controlParams.nacelleLower_z;
    let length2 = controlParams.nacelleLower_length;
    let width2 = controlParams.nacelleLower_radius;
    let widthRatio2 = controlParams.nacelleLower_widthRatio;
    let rotation2 = controlParams.nacelleLower_rotation;

    this.nacelleUpperPort.group.visible = this.controlParams.nacelle_toggle;
    this.nacelleUpperPort.update({length: length, width: width, widthRatio: widthRatio, rotation: rotation});
    this.nacelleUpperPort.group.position.set(separation, -aft-length, -height);

    this.nacelleUpperStarboard.group.visible = this.controlParams.nacelle_toggle;
    this.nacelleUpperStarboard.update({length: length, width: width, widthRatio: widthRatio, rotation: -rotation });
    this.nacelleUpperStarboard.group.position.set(-separation, -aft-length, -height);

    this.portUpperPylon.group.visible = this.controlParams.pylon_toggle;
    this.portUpperPylon.update({
      nacelleForeOffset: controlParams.pylon_nacelleForeOffset,
      nacelleAftOffset: controlParams.pylon_nacelleAftOffset,
      engineeringForeOffset: controlParams.pylon_engineeringForeOffset,
      engineeringAftOffset: controlParams.pylon_engineeringAftOffset,
      thickness: controlParams.pylon_thickness,
    });

    this.starboardUpperPylon.group.visible = this.controlParams.pylon_toggle;
    this.starboardUpperPylon.update({
      nacelleForeOffset: controlParams.pylon_nacelleForeOffset,
      nacelleAftOffset: controlParams.pylon_nacelleAftOffset,
      engineeringForeOffset: controlParams.pylon_engineeringForeOffset,
      engineeringAftOffset: controlParams.pylon_engineeringAftOffset,
      thickness: controlParams.pylon_thickness,
    });

    this.nacelleLowerPort.group.visible = this.controlParams.nacelleLower_toggle;
    this.nacelleLowerPort.update({length: length2, width: width2, widthRatio: widthRatio2, rotation: rotation2});
    this.nacelleLowerPort.group.position.set(separation2, -aft2-length2, height2);

    this.nacelleLowerStarboard.group.visible = this.controlParams.nacelleLower_toggle;
    this.nacelleLowerStarboard.update({length: length2, width: width2, widthRatio: widthRatio2, rotation: -rotation2 });
    this.nacelleLowerStarboard.group.position.set(-separation2, -aft2-length2, height2);

    this.portLowerPylon.group.visible = this.controlParams.pylonLower_toggle;
    this.portLowerPylon.update({
      nacelleForeOffset: controlParams.pylonLower_nacelleForeOffset,
      nacelleAftOffset: controlParams.pylonLower_nacelleAftOffset,
      engineeringForeOffset: controlParams.pylonLower_engineeringForeOffset,
      engineeringAftOffset: controlParams.pylonLower_engineeringAftOffset,
      thickness: controlParams.pylonLower_thickness,
    });

    this.starboardLowerPylon.group.visible = this.controlParams.pylonLower_toggle;
    this.starboardLowerPylon.update({
      nacelleForeOffset: controlParams.pylonLower_nacelleForeOffset,
      nacelleAftOffset: controlParams.pylonLower_nacelleAftOffset,
      engineeringForeOffset: controlParams.pylonLower_engineeringForeOffset,
      engineeringAftOffset: controlParams.pylonLower_engineeringAftOffset,
      thickness: controlParams.pylonLower_thickness,
    });

    this.engineering.group.visible = this.controlParams.engineering_toggle;
    this.engineering.update ({
      length: controlParams.engineering_length,
      width: controlParams.engineering_radius,
      widthRatio: controlParams.engineering_widthRatio,
      skew: controlParams.engineering_skew
    });
    this.engineering.group.position.set(0.0, controlParams.engineering_y, controlParams.engineering_z);

    this.neck.group.visible = this.controlParams.neck_toggle;
    this.neck.update({
      primaryForeOffset: controlParams.neck_primaryForeOffset,
      primaryAftOffset: controlParams.neck_primaryAftOffset,
      engineeringForeOffset: controlParams.neck_engineeringForeOffset,
      engineeringAftOffset :controlParams.neck_engineeringAftOffset,
      thickness: controlParams.neck_thickness,
    });
  }

  init() {
    this.window.addEventListener( 'resize', this.handleWindowResize.bind(this), false );
    this.clock = new THREE.Clock();
    this.container = document.getElementById( 'container' );

    // camera & controls
    this.camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 1600000 );
    this.camera.position.z = 50;
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
    alert("params output to console (and clipboard for supported browsers)");
    navigator.permissions.query({name: "clipboard-write"}).then(result => {
      if (result.state == "granted" || result.state == "prompt") {
        navigator.clipboard.writeText(pretty);
      }
    });
  }

  setPredefinedShip(shipName) {
    this.transitionStartTime = setTimeout(function(){
      this.predefinedShipTransitionFrameCounter = 0; //outta time, let's finish animation
    }.bind(this), this.maxTransitionTime);
    let newParams = this.predefinedShips.find(function (ship) { return ship.name == shipName; });
    this.predefinedShipTransitionFrameCounter = this.predefinedShipTransitionFrames;
    for (var param in newParams) {
      if (typeof newParams[param] === "number") {
        this.targetParams[param] = newParams[param];
      } else {
        this.controlParams[param] = newParams[param];
      }
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
    gui.add({ copy_ship_params: this.paramDump.bind(this) }, 'copy_ship_params');

    // predefined ships:
    this.currentShip.name = this.predefinedShips[0].name;
    let shipSelector = gui.add( this.currentShip, 'name', this.predefinedShips.map( (ship) => ship.name ) )

    shipSelector.onChange(
      function(newShipName) {
        this.setPredefinedShip(newShipName);
      }.bind(this)
    );

    shipSelector.onChange(
      function(newShipName) {
        this.setPredefinedShip(newShipName);
      }.bind(this)
    );

    // params:
    const that = this;
    for (var folder in this.controlConfiguration) {
      var controls = gui.addFolder(folder);
      let paramsInFolder = this.controlConfiguration[folder];
      // add a checkbox per folder
      const toggle_name = folder + '_toggle';
      this.controlParams[toggle_name] = true;

      let toggle = controls.add( this.controlParams, toggle_name, true );
      toggle.onChange( function(value) {
        toggle.object[toggle.property] = value;
        this.dirty = true;
      }.bind(this));
      toggle.listen();

      for (var key in paramsInFolder) {
        this.controlParams[folder + '_' + key] = paramsInFolder[key][0];
        let ref = controls.add(
          this.controlParams,
          folder + '_' + key,
          paramsInFolder[key][1],
          paramsInFolder[key][2],
          paramsInFolder[key][3]
        );
        ref.onChange(function(){ this.dirty = true }.bind(this));
        ref.listen();
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
