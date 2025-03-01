import * as THREE from 'three';
import OrbitControls from 'orbit-controls-es6';
// import * as dat from 'dat.gui';
import * as dat from 'lil-gui';
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
    this.SKY_COLOUR = 0x000000;
    this.CLEAR_COLOUR = 0xffffff;
    this.dirty = true;
    this.components = [];
    this.controlParams = {};
    this.currentShip = {}; // storage of currently selected predefined ship params independent of control parmas
    this.targetParams = {}; // if a new predefined ship is selected, the target params are stored here
    this.predefinedShipTransitionFrameCounter = 0; // this is decrement to 0 during the predefined ship transition animation
    this.predefinedShipTransitionFrames = 30; // the total number of frames to do the transition animation
    this.transitionRate = 0.25;
    this.maxTransitionTime = 1000; // ms for transition. If it takes longer than this it is forced to finish
    this.scaleIncrement = 0.1;
    

    // materials
    var tex = new THREE.TextureLoader().load( "./images/saucer.png");
    tex.wrapS = THREE.MirroredRepeatWrapping;
    tex.wrapT = THREE.MirroredRepeatWrapping;
    tex.repeat.set( 2, 2 );

    var texSaucerEm = new THREE.TextureLoader().load( "./images/saucer_em.png");
    texSaucerEm.wrapS = THREE.MirroredRepeatWrapping;
    texSaucerEm.wrapT = THREE.MirroredRepeatWrapping;
    texSaucerEm.repeat.set( 2, 1 );

    var texSaucerSp = new THREE.TextureLoader().load( "./images/saucer_sp.png");
    texSaucerSp.wrapS = THREE.MirroredRepeatWrapping;
    texSaucerSp.wrapT = THREE.MirroredRepeatWrapping;
    texSaucerSp.repeat.set( 2, 1 );

    this.hullMaterial = new THREE.MeshPhongMaterial({
      shininess: 100,
      color: 0xeeeeef,
      emissive: 0xeeeeff,
      specular: 0x555566,
      side: THREE.DoubleSide,
      flatShading: false,
      wireframe: false,
      map: tex,
      emissiveMap: texSaucerEm,
      specularMap: texSaucerSp,
    });

    var texEng = new THREE.TextureLoader().load( "./images/engineering.png");
    texEng.wrapS = THREE.MirroredRepeatWrapping;
    texEng.wrapT = THREE.MirroredRepeatWrapping;
    texEng.repeat.set( 2, 1 );

    var texEngSp = new THREE.TextureLoader().load( "./images/engineering_sp.png");
    texEngSp.wrapS = THREE.MirroredRepeatWrapping;
    texEngSp.wrapT = THREE.MirroredRepeatWrapping;
    texEngSp.repeat.set( 2, 1 );

    this.engMaterial = new THREE.MeshPhongMaterial({
      shininess: 30,
      color: 0xeeeeef,
      emissive: 0x000000,
      specular: 0x555566,
      side: THREE.DoubleSide,
      flatShading: false,
      wireframe: false,
      map: texEng,
      specularMap: texEngSp,
    });

    var texNeck = new THREE.TextureLoader().load( "./images/neck.png");
    texNeck.wrapS = THREE.MirroredRepeatWrapping;
    texNeck.wrapT = THREE.MirroredRepeatWrapping;
    texNeck.repeat.set( 3, 1 );
    
    var texNeckSp = new THREE.TextureLoader().load( "./images/neck_sp.png");
    texNeckSp.wrapS = THREE.MirroredRepeatWrapping;
    texNeckSp.wrapT = THREE.MirroredRepeatWrapping;
    texNeckSp.repeat.set( 3, 1 );

    this.neckMaterial = new THREE.MeshPhongMaterial({
      shininess: 40,
      color: 0xeeeeef,
      emissive: 0x000000,
      specular: 0x333338,
      side: THREE.DoubleSide,
      flatShading: false,
      wireframe: false,
      map: texNeck,
      specularMap: texNeckSp,
    });

    var texNacelle = new THREE.TextureLoader().load( "./images/nacelle.png");
    texNacelle.wrapS = THREE.RepeatWrapping;
    texNacelle.wrapT = THREE.RepeatWrapping;
    texNacelle.repeat.set( 2, 1 );
    
    var texNacelleEm = new THREE.TextureLoader().load( "./images/nacelle_em.png");
    texNacelleEm.wrapS = THREE.RepeatWrapping;
    texNacelleEm.wrapT = THREE.RepeatWrapping;
    texNacelleEm.repeat.set( 2, 1 );

    var texNacelleSp = new THREE.TextureLoader().load( "./images/nacelle_sp.png");
    texNacelleSp.wrapS = THREE.RepeatWrapping;
    texNacelleSp.wrapT = THREE.RepeatWrapping;
    texNacelleSp.repeat.set( 2, 1 );

    this.nacelleMaterial = new THREE.MeshPhongMaterial({
      shininess: 60,
      color: 0xeeeeef,
      emissive: 0xddddff,
      specular: 0x555566,
      side: THREE.DoubleSide,
      flatShading: false,
      wireframe: false,
      map: texNacelle,
      emissiveMap: texNacelleEm,
      specularMap: texNacelleSp,
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
        widthRatio: [1, 0, 10, 0.01],
        pointiness: [0.0, 0, 1, 0.01],
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
    lights[ 1 ] = new THREE.PointLight( 0xffffff, 0.5, 0 ); //bottom
    lights[ 2 ] = new THREE.PointLight( 0xffffff, 0.5, 0 );

    lights[ 0 ].position.set( 50, 50, 0 );
    lights[ 1 ].position.set( -50, -50, 0 );
    lights[ 2 ].position.set( 0, 0, 100 );

    this.scene.add( lights[ 0 ] );
    this.scene.add( lights[ 1 ] );
    this.scene.add( lights[ 2 ] );

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

    this.nacelleUpperPort = new Nacelle({ material: this.nacelleMaterial});
    this.mount(this.ship, this.nacelleUpperPort.group);

    this.nacelleUpperStarboard = new Nacelle({ material: this.nacelleMaterial });
    this.mount(this.ship, this.nacelleUpperStarboard.group);

    this.nacelleLowerPort = new Nacelle({ material: this.nacelleMaterial});
    this.mount(this.ship, this.nacelleLowerPort.group);

    this.nacelleLowerStarboard = new Nacelle({ material: this.nacelleMaterial });
    this.mount(this.ship, this.nacelleLowerStarboard.group);

    this.engineering = new Engineering({ material: this.engMaterial });
    this.mount(this.ship, this.engineering.group);

    this.neck = new Neck({
      primary: this.primary,
      engineering: this.engineering,
      material: this.neckMaterial
    });
    this.mount(this.ship, this.neck.group);

    this.portUpperPylon = new Pylon({
      nacelle: this.nacelleUpperPort,
      engineering: this.engineering,
      material: this.neckMaterial
    });
    this.mount(this.ship, this.portUpperPylon.group);

    this.starboardUpperPylon = new Pylon({
      nacelle: this.nacelleUpperStarboard,
      engineering: this.engineering,
      material: this.neckMaterial
    });
    this.mount(this.ship, this.starboardUpperPylon.group);

    this.portLowerPylon = new Pylon({
      nacelle: this.nacelleLowerPort,
      engineering: this.engineering,
      material: this.neckMaterial
    });
    this.mount(this.ship, this.portLowerPylon.group);

    this.starboardLowerPylon = new Pylon({
      nacelle: this.nacelleLowerStarboard,
      engineering: this.engineering,
      material: this.neckMaterial
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

    // nodes

    this.primary.group.visible = this.controlParams.primary_toggle;
    this.primary.update({thickness: controlParams.primary_thickness, radius: controlParams.primary_radius, widthRatio: controlParams.primary_widthRatio, pointiness: controlParams.primary_pointiness });
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
    
    this.nacelleLowerPort.group.visible = this.controlParams.nacelleLower_toggle;
    this.nacelleLowerPort.update({length: length2, width: width2, widthRatio: widthRatio2, rotation: rotation2});
    this.nacelleLowerPort.group.position.set(separation2, -aft2-length2, height2);

    this.nacelleLowerStarboard.group.visible = this.controlParams.nacelleLower_toggle;
    this.nacelleLowerStarboard.update({length: length2, width: width2, widthRatio: widthRatio2, rotation: -rotation2 });
    this.nacelleLowerStarboard.group.position.set(-separation2, -aft2-length2, height2);

    this.engineering.group.visible = this.controlParams.engineering_toggle;
    this.engineering.update ({
      length: controlParams.engineering_length,
      width: controlParams.engineering_radius,
      widthRatio: controlParams.engineering_widthRatio,
      skew: controlParams.engineering_skew
    });
    this.engineering.group.position.set(0.0, controlParams.engineering_y, controlParams.engineering_z);

    // edges

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
    this.shipNameLabel = document.getElementById( 'ship-name' );
    this.btnNext = document.getElementById('next');
    this.btnPrev = document.getElementById('prev');
    this.btnScreenshot = document.getElementById('screenshot');

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
      antialias: true,
      preserveDrawingBuffer: true // for screenshotting
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
    var roundedParams = Object.assign({}, this.controlParams);
    for (var param in roundedParams) {
      if ( typeof roundedParams[param] === "number" ) {
        roundedParams[param] = parseFloat( parseFloat(roundedParams[param]).toFixed(2) );
      }
    }
    let pretty = JSON.stringify(roundedParams, null, 2)
    console.log(pretty);
    alert("params output to console (and clipboard for supported browsers)");
    navigator.permissions.query({name: "clipboard-write"}).then(result => {
      if (result.state == "granted" || result.state == "prompt") {
        navigator.clipboard.writeText(pretty);
      }
    });
  }

  takeScreenshot() {
    const timeDateStamp = Date.now();
    var a = document.createElement('a');
    a.href = this.renderer.domElement.toDataURL().replace("image/png", "image/octet-stream");
    a.download = `${this.currentShip.name} ${timeDateStamp}.png`
    a.click();
  }

  setPredefinedShip(shipName) {
    this.shipNameLabel.innerHTML = shipName.toUpperCase();
    if(this.transitionStartTime) {
      window.clearTimeout(this.transitionStartTime);
    }
    this.transitionStartTime = setTimeout(function(){
      this.predefinedShipTransitionFrameCounter = 0; //outta time, let's finish animation
    }.bind(this), this.maxTransitionTime);
    let newParams = this.shipParams(shipName);
    this.currentShip = newParams;
    this.predefinedShipTransitionFrameCounter = this.predefinedShipTransitionFrames;
    for (var param in newParams) {
      if (typeof newParams[param] === "number") {
        this.targetParams[param] = newParams[param];
      } else {
        this.controlParams[param] = newParams[param];
      }
    }
  }

  nextPredefinedShip() {
    let index = this.currentShipIndex();
    index = (index + 1) % this.predefinedShips.length;
    this.shipSelector.setValue(this.predefinedShips[index].name);
  }

  prevPredefinedShip() {
    let index = this.currentShipIndex();
    index -= 1;
    if (index < 0) {
      index += this.predefinedShips.length;
    }
    this.shipSelector.setValue(this.predefinedShips[index].name);
  }

  currentShipIndex() {
    return this.predefinedShips.map( function(ship){ return ship.name; } ).indexOf(this.currentShip.name);
  }

  shipParams(shipName) {
    return this.predefinedShips.find(function (ship) { return ship.name == shipName; });
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

  rescale(dir) {
    for (var param in this.controlParams) {
      if ( typeof this.controlParams[param] === "number" && 
            this.paramNameOmits(param, ['ratio', 'offset', 'skew']))
      {
        this.controlParams[param] *= ( ( 1.0 + dir * this.scaleIncrement) );
      }
    }
    this.dirty = true;
  }

  paramNameOmits(param, mustOmit){
    var p = param.toLowerCase();
    return mustOmit.every((str) => p.indexOf(str) < 0);
  }

  handleOpenCloseFolder(changedGUI) {
    console.log(changedGUI);
    const cg = changedGUI;
    // close all other gui folders:
    for (var folder in this.gui.folders) {
      if (folder !== cg.name) {
        this.gui.folders[folder].close();
      }
    }
  }

  initControls(){
    // non datgui controls:
    this.btnNext.addEventListener('click', function(){ this.nextPredefinedShip() }.bind(this));
    this.btnPrev.addEventListener('click', function(){ this.prevPredefinedShip() }.bind(this));
    this.btnScreenshot.addEventListener('click', function(){ this.takeScreenshot() }.bind(this));

    this.gui = new dat.GUI( { autoPlace: true, width: 300 } );
    const gui = this.gui;
    gui.close();
    gui.onOpenClose( changedGUI => {
      this.handleOpenCloseFolder( changedGUI );
    } );

    // utils folder
    var utilsFolder = gui.addFolder('utils');

    // screenshot button:
    utilsFolder.add({ screenshot: this.takeScreenshot.bind(this) }, 'screenshot');

    // export button:
    utilsFolder.add({ copy_ship_params: this.paramDump.bind(this) }, 'copy_ship_params');

    // rescale button:
    utilsFolder.add({ scale_up: this.rescale.bind(this, 1) }, 'scale_up');
    utilsFolder.add({ scale_down: this.rescale.bind(this, -1) }, 'scale_down');

    // predefined ships:
    this.currentShip.name = this.predefinedShips[0].name;
    this.shipSelector = gui.add( this.currentShip, 'name', this.predefinedShips.map( (ship) => ship.name ) )

    this.shipSelector.onChange(
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
