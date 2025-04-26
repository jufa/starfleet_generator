import * as THREE from "three";
import { OrbitControls }    from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer }   from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass }       from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass }  from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass }  from "three/examples/jsm/postprocessing/OutputPass.js";
import { STLExporter } from "three/examples/jsm/exporters/STLExporter.js";
import * as materials from './materials.js';

// import * as dat from 'dat.gui';
import * as dat from 'lil-gui';
import Nacelle from './nacelle.js';
import Engineering from './engineering.js';
import Primary from './primary.js';
import Neck from './neck.js';
import Pylon from './pylon.js';
import Boom from './boom.js';
import ships from './ships.js';

export default class Builder {
  
  constructor(window) {
    this.STORAGE_PREFIX = 'STARSHIPGENERATORV01-'; // for localstoage
    this.predefinedShips = ships;
    this.window = window;
    this.SKY_COLOUR = 0x000000;
    this.CLEAR_COLOUR = 0x000000;
    this.dirty = true;
    this.components = [];
    this.controlParams = {};
    this.currentShip = {}; // storage of currently selected predefined ship params independent of control parmas
    this.targetParams = {}; // if a new predefined ship is selected, the target params are stored here
    this.predefinedShipTransitionFrameCounter = 0; // this is decrement to 0 during the predefined ship transition animation
    this.predefinedShipTransitionFrames = 60*1; // the total number of frames to do the transition animation
    this.transitionRate = 0.08;
    this.maxTransitionTime = 2000; // ms for transition. If it takes longer than this it is forced to finish
    this.scaleIncrement = 0.1;
    this.materialNames = ['Standard', 'Bleachy', 'Grid32', 'Gold Desk Model', 'Chrome Desk Model', "Wireframe", "1963"];
    this.materialIndex = 6;
    this.lights = [];
    this.raycaster = new THREE.Raycaster();


    //prepend user-saved ships:
    this.predefinedShips = this.getSavedShips().concat(this.predefinedShips);

    // generateMaterials(this);

    this.controlConfiguration = {
      // folderName: {paramName: [default, min, max, step]}
      // refer to variable in code as controlParams.folderName_paramName
      primary: {
        y: [-10, -30, 50, 0.01],
        z: [0.5, -30, 50, 0.01],
        radius: [12, 1, 30, 0.01],
        thickness: [4, 1, 10, 0.01],
        widthRatio: [1, 0.01, 10, 0.01],
        pointiness: [0.0, -1.0, 1.5, 0.01],
        // segments: [64, 3, 64, 1],
        bridgeThickness:  [0.8, 0.5, 9, 0.01],
        bridgeRadius: [0.1, 0.01, 1.2, 0.01],
        bridgeWidthRatio: [1, 0.01, 2, 0.01],
        bridgeZ: [-3.0, -1, 3, 0.01],
        bridgeY: [0, -1, 1, 0.01],
        // bridgeSegments: [64, 3, 64, 1],
        notchAngle: [0, 0, Math.PI, 0.01],
        
      },
      neck: {
        primaryForeOffset: [0.3, 0, 1, 0.01],
        primaryAftOffset: [0.3, -0.3, 1, 0.01],
        engineeringForeOffset: [0.3, 0, 1, 0.01],
        engineeringAftOffset: [0.3, 0, 1, 0.01],
        primaryThickness: [0.15, 0.01, 5, 0.01],
        thickness: [0.15, 0.01, 5, 0.01],
        foretaper: [1.0, 0.01, 3, 0.01],
        afttaper: [1.0, 0.01, 3, 0.01],
      },
      engineering: {
        y: [-25, -60, 60, 0.01],
        z: [6, -30, 50, 0.01],
        length: [10, 1, 50, 0.01],
        radius: [1, 0, 10, 0.01],
        widthRatio: [1, 0.1, 10, 0.01],
        skew: [0, -5, 5, 0.01],
        // segments: [32, 3, 32, 1],
        undercut: [0.75, 0, 1.0, 0.01],
        undercutStart: [0.7, 0, 1.0, 0.01],
        undercutCurve: [2, 1, 10, 0.01],
        dishRadius: [1, 0.3, 1.1, 0.01],
        dishInset: [0, 0, 2.0, 0.01],
      },
      nacelle: {
        y: [40, -30, 50, 0.01],
        x: [2.5, -30, 50, 0.01],
        z: [-3.5, -30, 50, 0.01],
        length: [12, 1, 50, 0.01],
        radius: [1, 0.2, 12, 0.01],
        widthRatio: [1, 0.1, 10, 0.01],
        rotation: [0, -Math.PI, Math.PI, 0.01],
        // segments: [32, 3, 32, 1],
        // skew: [0, -1.5, 1.5, 0.01],
        undercutStart: [0.9, 0.0, 1.0, 0.01],
        undercut: [0.75, 0, 1.0, 0.01],
      },
      pylon: {
        nacelleForeOffset: [0.3, -0.3, 1.5, 0.01],
        nacelleAftOffset: [0.3, -0.3, 1.5, 0.01],
        engineeringForeOffset: [-0.3, -0.7, 1.5, 0.01],
        engineeringAftOffset: [-0.3, -0.7, 1.5, 0.01],
        engineeringZOffset: [0, -6, 6, 0.01],
        midPointOffset: [0.01, 0.01, 1.5, 0.01],
        thickness: [0.15, 0.01, 5, 0.01],
      },
      nacelleLower: {
        y: [40, -30, 50, 0.01],
        x: [2.5, -30, 50, 0.01],
        z: [-3.5, -30, 50, 0.01],
        length: [12, 1, 50, 0.01],
        radius: [1, 0.2, 12, 0.01],
        widthRatio: [1, 0.1, 10, 0.01],
        rotation: [0, -Math.PI, Math.PI, 0.01],
        // segments: [32, 3, 32, 1],
        // skew: [0, -1.5, 1.5, 0.01],
        undercutStart: [0.9, 0.0, 1.0, 0.01],
        undercut: [0.75, 0, 1.0, 0.01],
      },
      boomLower: {
      },
      pylonLower: {
        nacelleForeOffset: [0.3, -0.3, 1.5, 0.01],
        nacelleAftOffset: [0.3, -0.3, 1.5, 0.01],
        engineeringForeOffset: [0.3, -0.7, 1.5, 0.01],
        engineeringAftOffset: [0.3, -0.7, 1.5, 0.01],
        engineeringZOffset: [0, -6, 6, 0.01],
        midPointOffset: [0.01, 0.01, 1.5, 0.01],
        thickness: [0.15, 0.01, 5, 0.01],
      },
    };

    this.init();
    if (!this.getConsentStatus()) {
      const consentSelection = prompt("This site uses local storage to save your ship designs and uses traffic analytics. Click [Cancel] if you do not consent", "yes");
      if (consentSelection !== "yes") {
        window.location.href = "/terms.html";
      } else {
        this.setConsentStatus(true);
      }
    }

    this.initControls();
    this.build();
    const startIndex = 0; // Number.parseInt(Math.random() * (this.predefinedShips.length-1));
    this.setPredefinedShip(this.predefinedShips[startIndex].name);
  }

  addLights(configIndex=0) {
    if (this.lights.length > 0) {
      this.lights.forEach(light => {
        this.scene.remove(light);
      });
    }
    this.lights = [];

    const lightConfigs = [
      this.addLightsDefault,
      this.addLightsDefault,
      this.addLightsDefault,
      this.addLightsDeskModel,
      this.addLightsDeskModel,
      this.addLightsDefault,
      this.addLightsDeskModel,
    ];

    lightConfigs[configIndex].call(this);

  }

  // lighting configurations:
  addLightsDefault() {
    const intensity = 55**2;
    const dist = 40;
    this.lights[ 0 ] = new THREE.PointLight( 0xddddff, intensity*1, 0 );
    this.lights[ 1 ] = new THREE.PointLight( 0x00AAE3, intensity*1, 0 ); //bottom
    this.lights[ 2 ] = new THREE.PointLight( 0xffffff, intensity*1, 0 );
    this.lights[ 3 ] = new THREE.PointLight( 0xFC82C0, intensity*1, 0 );
    // this.lights[ 4 ] = new THREE.PointLight( 0xffffff, intensity/2, 0 );

    this.lights[ 0 ].position.set( dist/2, dist, -dist/2 );
    this.lights[ 1 ].position.set( -dist, -dist, 0 );
    this.lights[ 2 ].position.set( 0, 0, dist*2 );
    this.lights[ 3 ].position.set( dist, -dist, 0 );
    // this.lights[ 4 ].position.set(0, 20, 0);

    this.scene.add( this.lights[ 0 ] );
    this.scene.add( this.lights[ 1 ] );
    this.scene.add( this.lights[ 2 ] );
    this.scene.add( this.lights[ 3 ] );
    // this.camera.add( this.lights[ 4 ] );
    this.scene.add( this.camera );
  };

  addLightsDeskModel() {
    const intensity = 60**2;
    const dist = 90;
    this.lights[ 0 ] = new THREE.PointLight( 0xdddddd, intensity*1, 0 );
    this.lights[ 1 ] = new THREE.PointLight( 0x888888, intensity*1, 0 ); //bottom
    this.lights[ 2 ] = new THREE.PointLight( 0xffffff, intensity*1, 0 );
    this.lights[ 3 ] = new THREE.PointLight( 0xffffff, intensity*1, 0 );
    // this.lights[ 4 ] = new THREE.PointLight( 0xffffff, intensity/2, 0 );

    this.lights[ 0 ].position.set( dist, dist, -dist );
    this.lights[ 1 ].position.set( -dist, -dist, 0 );
    this.lights[ 2 ].position.set( 0, 0, dist*2 );
    this.lights[ 3 ].position.set( dist, -dist, 0 );
    // this.lights[ 4 ].position.set(0, 20, 0);

    this.scene.add( this.lights[ 0 ] );
    this.scene.add( this.lights[ 1 ] );
    this.scene.add( this.lights[ 2 ] );
    this.scene.add( this.lights[ 3 ] );
    // this.scene.fog = new THREE.FogExp2( 0x000000, 0.004 );
    // this.camera.add( this.lights[ 4 ] );
    // this.scene.add( this.camera );
  };

  addLightsLow() {
    const intensity = 40**2;
    const dist = 1000;
    this.lights[ 0 ] = new THREE.PointLight( 0xdddddd, intensity*1, 0 );
    this.lights[ 1 ] = new THREE.PointLight( 0x888888, intensity*1, 0 ); //bottom
    this.lights[ 2 ] = new THREE.PointLight( 0xffffff, intensity*1, 0 );
    this.lights[ 3 ] = new THREE.PointLight( 0xffffff, intensity*1, 0 );
    // this.lights[ 4 ] = new THREE.PointLight( 0xffffff, intensity/2, 0 );

    this.lights[ 0 ].position.set( dist, dist, -dist );
    this.lights[ 1 ].position.set( -dist, -dist, 0 );
    this.lights[ 2 ].position.set( 0, 0, dist*2 );
    this.lights[ 3 ].position.set( dist, -dist, 0 );
    // this.lights[ 4 ].position.set(0, 20, 0);

    this.scene.add( this.lights[ 0 ] );
    this.scene.add( this.lights[ 1 ] );
    this.scene.add( this.lights[ 2 ] );
    this.scene.add( this.lights[ 3 ] );
    // this.scene.fog = new THREE.FogExp2( 0x000000, 0.004 );
    // this.camera.add( this.lights[ 4 ] );
    // this.scene.add( this.camera );
  };

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

    this.primary = new Primary();
    this.mount(this.ship, this.primary.group);

    this.nacelleUpperPort = new Nacelle({name: 'nacelleUpperPort'});
    this.mount(this.ship, this.nacelleUpperPort.group);

    this.nacelleUpperStarboard = new Nacelle({name: 'nacelleUpperStarboard'});
    this.mount(this.ship, this.nacelleUpperStarboard.group);

    this.nacelleLowerPort = new Nacelle({name: 'nacelleLowerPort'});
    this.mount(this.ship, this.nacelleLowerPort.group);

    this.nacelleLowerStarboard = new Nacelle({name: 'nacelleLowerStarboard'});
    this.mount(this.ship, this.nacelleLowerStarboard.group);

    this.engineering = new Engineering({name: 'engineering'});
    this.mount(this.ship, this.engineering.group);

    this.boomLowerPort = new Boom({name: 'boomLowerPort'});
      this.mount(this.ship, this.boomLowerPort.group);
    
    this.boomLowerStarboard = new Boom({name: 'boomLowerStarboard'});
      this.mount(this.ship, this.boomLowerStarboard.group);

    this.neck = new Neck({
      primary: this.primary,
      engineering: this.engineering,
      name: 'neck',
    });
    this.mount(this.ship, this.neck.group);

    this.portUpperPylon = new Pylon({
      nacelle: this.nacelleUpperPort,
      engineering: this.engineering,
      name: 'portUpperPylon',
    });
    this.mount(this.ship, this.portUpperPylon.group);

    this.starboardUpperPylon = new Pylon({
      nacelle: this.nacelleUpperStarboard,
      engineering: this.engineering,
      name: 'starboardUpperPylon',
    });
    this.mount(this.ship, this.starboardUpperPylon.group);

    this.portLowerPylon = new Pylon({
      nacelle: this.nacelleLowerPort,
      engineering: this.engineering,
      name: 'portLowerPylon',
    });
    this.mount(this.ship, this.portLowerPylon.group);

    this.starboardLowerPylon = new Pylon({
      nacelle: this.nacelleLowerStarboard,
      engineering: this.engineering,
      name: 'starboardLowerPylon',
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
    this.primary.update({
      thickness: controlParams.primary_thickness,
      radius: controlParams.primary_radius,
      widthRatio: controlParams.primary_widthRatio,
      pointiness: controlParams.primary_pointiness,
      bridgeThickness: controlParams.primary_bridgeThickness,
      bridgeRadius: controlParams.primary_bridgeRadius,
      bridgeWidthRatio: controlParams.primary_bridgeWidthRatio,
      bridgeZ: controlParams.primary_bridgeZ,
      bridgeY: controlParams.primary_bridgeY,
      notchAngle: controlParams.primary_notchAngle,
      segments: controlParams.primary_segments,
      bridgeSegments: controlParams.primary_bridgeSegments,
      materialIndex: this.materialIndex,
    });
    this.primary.group.position.set(0.0, controlParams.primary_y, controlParams.primary_z);

    let separation = controlParams.nacelle_x * 2.0;
    let aft = controlParams.nacelle_y;
    let height = controlParams.nacelle_z;
    let length = controlParams.nacelle_length;
    let width = controlParams.nacelle_radius;
    let widthRatio = controlParams.nacelle_widthRatio;
    let rotation = controlParams.nacelle_rotation;
    let segments = controlParams.nacelle_segments || 32;
    let skew = controlParams.nacelle_skew || 0;
    let undercutStart = controlParams.nacelle_undercutStart || 0;
    let undercut = controlParams.nacelle_undercut || 0;

    let separation2 = controlParams.nacelleLower_x * 2.0;
    let aft2 = controlParams.nacelleLower_y;
    let height2 = controlParams.nacelleLower_z;
    let length2 = controlParams.nacelleLower_length;
    let width2 = controlParams.nacelleLower_radius;
    let widthRatio2 = controlParams.nacelleLower_widthRatio;
    let rotation2 = controlParams.nacelleLower_rotation;
    let segments2 = controlParams.nacelleLower_segments || 32;
    let skew2 = controlParams.nacelleLower_skew || 0;
    let undercutStart2 = controlParams.nacelleLower_undercutStart || 0;
    let undercut2 = controlParams.nacelleLower_undercut || 0;

    this.nacelleUpperPort.group.visible = this.controlParams.nacelle_toggle;
    this.nacelleUpperPort.update({length: length, width: width, widthRatio: widthRatio, rotation: rotation, segments: segments, skew: skew, materialIndex: this.materialIndex, undercutStart: undercutStart, undercut: undercut});
    this.nacelleUpperPort.group.position.set(separation, -aft-length, -height);

    this.nacelleUpperStarboard.group.visible = this.controlParams.nacelle_toggle;
    this.nacelleUpperStarboard.update({length: length, width: width, widthRatio: widthRatio, rotation: -rotation, segments: segments, skew: skew, materialIndex: this.materialIndex, undercutStart: undercutStart, undercut: undercut});
    this.nacelleUpperStarboard.group.position.set(-separation, -aft-length, -height);
    
    this.nacelleLowerPort.group.visible = this.controlParams.nacelleLower_toggle;
    this.nacelleLowerPort.update({length: length2, width: width2, widthRatio: widthRatio2, rotation: rotation2, segments: segments2, skew: skew2, materialIndex: this.materialIndex, undercutStart: undercutStart2, undercut: undercut2});
    this.nacelleLowerPort.group.position.set(separation2, -aft2-length2, height2);

    this.nacelleLowerStarboard.group.visible = this.controlParams.nacelleLower_toggle;
    this.nacelleLowerStarboard.update({length: length2, width: width2, widthRatio: widthRatio2, rotation: -rotation2, segments: segments2, skew: skew2, materialIndex: this.materialIndex, undercutStart: undercutStart2, undercut: undercut2});
    this.nacelleLowerStarboard.group.position.set(-separation2, -aft2-length2, height2);

    this.boomLowerPort.group.visible = this.controlParams.boomLower_toggle;
    this.boomLowerPort.update({length: length2, width: width2, widthRatio: widthRatio2, rotation: rotation2, segments: segments2, skew: skew2, materialIndex: this.materialIndex, undercutStart: undercutStart2, undercut: undercut2,});
    this.boomLowerPort.group.position.set(separation2, -aft2-length2, height2);

    this.boomLowerStarboard.group.visible = this.controlParams.boomLower_toggle;
    this.boomLowerStarboard.update({length: length2, width: width2, widthRatio: widthRatio2, rotation: -rotation2, segments: segments2, skew: skew2, materialIndex: this.materialIndex, undercutStart: undercutStart2, undercut: undercut2});
    this.boomLowerStarboard.group.position.set(-separation2, -aft2-length2, height2);



    this.engineering.group.visible = this.controlParams.engineering_toggle;
    this.engineering.update ({
      length: controlParams.engineering_length,
      width: controlParams.engineering_radius,
      widthRatio: controlParams.engineering_widthRatio,
      skew: controlParams.engineering_skew,
      segments: controlParams.engineering_segments || 32,
      undercut: controlParams.engineering_undercut,
      undercutStart: controlParams.engineering_undercutStart,
      undercutCurve: controlParams.engineering_undercutCurve,
      dishRadius: controlParams.engineering_dishRadius,
      dishInset: controlParams.engineering_dishInset,
      materialIndex: this.materialIndex,
    });
    this.engineering.group.position.set(0.0, controlParams.engineering_y, controlParams.engineering_z);

    // edges

    this.portUpperPylon.group.visible = this.controlParams.pylon_toggle;
    this.portUpperPylon.update({
      nacelleForeOffset: controlParams.pylon_nacelleForeOffset,
      nacelleAftOffset: controlParams.pylon_nacelleAftOffset,
      engineeringForeOffset: controlParams.pylon_engineeringForeOffset,
      engineeringAftOffset: controlParams.pylon_engineeringAftOffset,
      midpointOffset: controlParams.pylon_midPointOffset,
      thickness: controlParams.pylon_thickness,
      materialIndex: this.materialIndex,
      engineeringZOffset: controlParams.pylon_engineeringZOffset,
    });

    this.starboardUpperPylon.group.visible = this.controlParams.pylon_toggle;
    this.starboardUpperPylon.update({
      nacelleForeOffset: controlParams.pylon_nacelleForeOffset,
      nacelleAftOffset: controlParams.pylon_nacelleAftOffset,
      engineeringForeOffset: controlParams.pylon_engineeringForeOffset,
      engineeringAftOffset: controlParams.pylon_engineeringAftOffset,
      midpointOffset: controlParams.pylon_midPointOffset,
      thickness: controlParams.pylon_thickness,
      materialIndex: this.materialIndex,
      engineeringZOffset: controlParams.pylon_engineeringZOffset,
    });

    this.portLowerPylon.group.visible = this.controlParams.pylonLower_toggle;
    this.portLowerPylon.update({
      nacelleForeOffset: controlParams.pylonLower_nacelleForeOffset,
      nacelleAftOffset: controlParams.pylonLower_nacelleAftOffset,
      engineeringForeOffset: controlParams.pylonLower_engineeringForeOffset,
      engineeringAftOffset: controlParams.pylonLower_engineeringAftOffset,
      midpointOffset: controlParams.pylonLower_midPointOffset,
      thickness: controlParams.pylonLower_thickness,
      materialIndex: this.materialIndex,
      engineeringZOffset: controlParams.pylonLower_engineeringZOffset,
    });

    this.starboardLowerPylon.group.visible = this.controlParams.pylonLower_toggle;
    this.starboardLowerPylon.update({
      nacelleForeOffset: controlParams.pylonLower_nacelleForeOffset,
      nacelleAftOffset: controlParams.pylonLower_nacelleAftOffset,
      engineeringForeOffset: controlParams.pylonLower_engineeringForeOffset,
      engineeringAftOffset: controlParams.pylonLower_engineeringAftOffset,
      midpointOffset: controlParams.pylonLower_midPointOffset,
      thickness: controlParams.pylonLower_thickness,
      materialIndex: this.materialIndex,
      engineeringZOffset: controlParams.pylonLower_engineeringZOffset,
    });

    this.neck.group.visible = this.controlParams.neck_toggle;
    this.neck.update({
      primaryForeOffset: controlParams.neck_primaryForeOffset,
      primaryAftOffset: controlParams.neck_primaryAftOffset,
      engineeringForeOffset: controlParams.neck_engineeringForeOffset,
      engineeringAftOffset :controlParams.neck_engineeringAftOffset,
      primaryThickness: controlParams.neck_primaryThickness,
      thickness: controlParams.neck_thickness,
      foretaper: controlParams.neck_foretaper,
      afttaper: controlParams.neck_afttaper,
      materialIndex: this.materialIndex,
    });

    // make sure camera is orbiting the new position of the saucer:
    // const targetPosition = new THREE.Vector3();
    // this.primary.group.getWorldPosition(targetPosition);
    // this.controls.target.copy(targetPosition);
    // this.camera.lookAt(this.controls.target);
    // this.controls.update();
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
    this.camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 5, 2000 );
    this.camera.position.z = 50;
    this.controls = new OrbitControls( this.camera, this.container );
    this.controls.enableDamping = true;

    // this.controls.screenSpacePanning = false;
    // this.controls.lookSpeed = 0.3;

    // scenes
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( this.SKY_COLOUR );
    // add skybox:
    //https://tools.wwwtyro.net/space-3d/index.html#animationSpeed=1&fov=80&nebulae=true&pointStars=true&resolution=2048&seed=ad3fw753fffegrf48&stars=true&sun=true    
    // star texture: The sun erupted with an X1.7-class solar flare on May 12, 2013. The flare appears as the bright point on the left of the sun in this full disk view NASA's Solar Dynamics Observatory.
    const cubeLoader = new THREE.CubeTextureLoader();
    cubeLoader.setPath("./images/cubemap/");

    const skyboxTexture = cubeLoader.load
    ([
      "right.jpg", // +X (right)
      "left.jpg", // -X (left)
      "top.jpg", // +Y (top)
      "bottom.jpg", // -Y (bottom)
      "front.jpg", // +Z (front)
      "back.jpg",  // -Z (back)
    ]);

    this.scene.background = skyboxTexture;
    // this.scene.environment = skyboxTexture;

    // const material = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: textureCube } );

    // lights
    this.addLights(this.materialIndex);

    // renderer
    this.renderer = new THREE.WebGLRenderer({
      depth: true,
      antialias: true,
      toneMapping: THREE.ACESFilmicToneMapping,
      toneMappingExposure: 2,
      preserveDrawingBuffer: true, // for screenshotting
    });
    this.renderer.setClearColor( this.CLEAR_COLOUR );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );

    // Create the EffectComposer
    this.composer = new EffectComposer(this.renderer);

    // Add RenderPass
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    // Add UnrealBloomPass
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.4, // Strength
      0.0, // Radius
      0.5 // Threshold
    );
    this.composer.addPass(bloomPass);

    const outputPass = new OutputPass();
    this.composer.addPass( outputPass );
    

    this.container.innerHTML = "";
    this.container.appendChild( this.renderer.domElement );
    
    this.onPointerDown = this.onPointerDown.bind(this);
    window.addEventListener('pointerdown', this.onPointerDown);
  }

  onPointerDown(event) {
    // Normalize mouse coordinates (-1 to +1)
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    
    this.raycaster.setFromCamera(mouse, this.camera);
    
    function isEffectivelyVisible(obj) {
      while (obj) {
        if (!obj.visible) return false;
        obj = obj.parent;
      }
      return true;
    }

    const intersects = this.raycaster.intersectObjects(this.scene.children, true).filter((i) => isEffectivelyVisible(i.object));
    if (intersects.length > 0) {
      for (let i = 0; i < intersects.length; i++) {
        const intersect = intersects[i];
        if (intersect.object.name) {
          console.log(intersect.object.name);
          return;
        }
      }
    }
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
    const angle = shipBuilder.clock.getElapsedTime() * 2.0 % 100.0;
    const nacelles = [
      this.nacelleLowerPort,
      this.nacelleLowerStarboard,
      this.nacelleUpperPort,
      this.nacelleUpperStarboard,
    ]
    for (let i in nacelles) {
      nacelles[i].rotateBussard(angle);
    }

    // this.ship.rotateZ(0.003);

    this.controls.update( shipBuilder.clock.getDelta() );
    // this.renderer.render( this.scene, this.camera );
    this.composer.render();
  }

  getParamsRoundedJSON() {
    var roundedParams = Object.assign({}, this.controlParams);
    for (var param in roundedParams) {
      if ( typeof roundedParams[param] === "number" ) {
        roundedParams[param] = parseFloat( parseFloat(roundedParams[param]).toFixed(2) );
      }
    }
    return roundedParams;
  }

  paramDump() {
    var roundedParams = this.getParamsRoundedJSON();
    let pretty = JSON.stringify(roundedParams, null, 2)
    return pretty;
  }

  getConsentStatus() {
    const consent =  localStorage[`${this.STORAGE_PREFIX}_consent`]
    console.log("builder:getConsentStatus: ", consent);
    return consent ? true : false;
  }

  setConsentStatus(value) {
    if (value) {
      localStorage.setItem(`${this.STORAGE_PREFIX}_consent`, true);
    } else {
      localStorage.removeItem(`${this.STORAGE_PREFIX}_consent`);
    }
  }

  getSavedShipNames() {
    return Object.keys(localStorage)
      .filter(k => k.startsWith(this.STORAGE_PREFIX) && k !== `${this.STORAGE_PREFIX}_consent`)
      .map(k => k.replace(this.STORAGE_PREFIX, ''));
  }

  getSavedShips() {
    let userDefinedShips = [];
    const userDefinedShipNames = Object.keys(localStorage)
      .filter(k => k.startsWith(this.STORAGE_PREFIX) && k !== `${this.STORAGE_PREFIX}_consent`);
    
    for (let name of userDefinedShipNames) {
      let data = localStorage.getItem(name);
      const parsed = JSON.parse(data);
      userDefinedShips.unshift(parsed);
    }
    userDefinedShips = userDefinedShips.sort( (a,b) => b.saveDate - a.saveDate );
    return userDefinedShips;
  }

  takeScreenshot() {
    const timeDateStamp = Date.now();
    var a = document.createElement('a');
    a.href = this.renderer.domElement.toDataURL().replace("image/png", "image/octet-stream");
    a.download = `${this.currentShip.name} ${timeDateStamp}.png`
    if (/(iPad|iPhone|iPod)/.test(navigator.userAgent)) {
      window.open(dataUrl, '_blank');
    } else {
      a.click();
    }
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

  saveShipConfig() {
    const newName = prompt("Enter ship name");
    if (newName === null || newName === "" ) {
      alert("Ship name cannot be empty");
      return;
    }
    if (this.predefinedShips.map( (ship) => ship.name ).includes(newName) &&
        !this.getSavedShipNames().includes(newName)) {
      alert("Ship name already exists in predefined ships - enter a new name, or an existing saved ship name to overwrite");
      return;
    }
    const config = this.getParamsRoundedJSON();
    config.name = newName;
    config.saveDate = Date.now().toString();
    const key = this.STORAGE_PREFIX + config.name;
    localStorage.setItem(key, JSON.stringify(config));
    const saved = localStorage.getItem(key);
    alert(`Saved "${config.name}" to local browser storage`);
    window.location.reload(); // simple way of reinitializing the UI
  }

  loadSavedShip(name){
    // console.log("loadSavedShip: ", name);
    const key = this.STORAGE_PREFIX + name;
    const config = localStorage.getItem(key);
    return config;
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
    // console.log(shipName);
    const params = this.predefinedShips.find(function (ship) { return ship.name == shipName; });
    // console.log(params);
    return params;
  }

  updatePredifinedShipTransitionAnimation() {
    for (var param in this.targetParams) {
      let target = this.targetParams[param];
      let current = this.controlParams[param];
      let delta = (target - current)
      if (this.predefinedShipTransitionFrameCounter <= 0) {
        delta = (target - current);
      } else {
        delta = delta * this.transitionRate;
      }
      this.controlParams[param] = current + delta;
    }
    this.dirty = true;
  }

  exportSTL() {
    alert("This is experimental feature which exports a binary STL file for local download");
    const exporter = new STLExporter();
    const options = { binary: true } // binary is preferred for 3D printing services

    const stlGroup = new THREE.Group();

    // we only add a mesh if all its parents are visible:
    this.ship.traverse((child) => {
      if (!child.isMesh) return;
    
      let current = child;
      let allVisible = true;
    
      // Walk up to the root (but stop at this.ship or null)
      while (current && current !== this.ship.parent) {
        if (!current.visible) {
          allVisible = false;
          break;
        }
        current = current.parent;
      }
    
      if (allVisible) {
        stlGroup.add(child.clone());
      }
    })

    // scaling - these are generally too small for  a 3D printing service that defaults to units of mm for STL
    const scaleFactor = 5;
    stlGroup.scale.set(scaleFactor, scaleFactor, scaleFactor);

    const stlData = exporter.parse(stlGroup, options);
    const blob = new Blob([stlData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.currentShip.name}.stl`;
    a.click();
    URL.revokeObjectURL(url);
  }

  handleMaterialIndexChange(value) {
    this.materialIndex = this.materialNames.indexOf(value);
    console.log("materialIndex: ", this.materialIndex);
    this.addLights(this.materialIndex);
    this.dirty = true;
    this.render();
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
    // console.log(changedGUI);
    const cg = changedGUI;
    // close all other gui folders:
    for (var folder in this.gui.folders) {
      if (folder !== cg.name) {
        this.gui.folders[folder].close();
      }
    }
  }

  setGuiVisibility(visible) {
    const guiNode = document.getElementById('gui-container');
    guiNode.style.opacity = visible ? 0.75 : 0.1;
  }

  initControls(){
    // non datgui controls:
    this.btnNext.addEventListener('click', function(){ this.nextPredefinedShip() }.bind(this));
    this.btnPrev.addEventListener('click', function(){ this.prevPredefinedShip() }.bind(this));
    this.btnScreenshot.addEventListener('click', function(){ this.takeScreenshot() }.bind(this));

    this.gui = new dat.GUI( { autoPlace: false, touchStyles: false } );
    const gui = this.gui;
    gui.close();
    gui.onOpenClose( changedGUI => {
      this.handleOpenCloseFolder( changedGUI );
    } );
    document.getElementById('gui-container').appendChild(gui.domElement);
    const guiNode = document.getElementById('gui-container');

    // Find all sliders inside lil-gui when added
    guiNode.addEventListener('touchstart', (e) => {
      if (e.target.closest('.controller.number')) {
        this.setGuiVisibility(false);
      }
    });
    guiNode.addEventListener('mousedown', (e) => {
      if (e.target.closest('.controller.number')) {
        this.setGuiVisibility(false);
      }
    });
    // Show GUI again when touch/mouse ends
    const showOnEnd = () => this.setGuiVisibility(true);
    window.addEventListener('touchend', showOnEnd);
    window.addEventListener('mouseup', showOnEnd);
    
    // utils folder
    var utilsFolder = gui.addFolder('utilities');

    // screenshot button:
    utilsFolder.add({ save_screen_shot: this.takeScreenshot.bind(this) }, 'save_screen_shot').name('SAVE SCREEN SHOT');
    
    // STL Export:
    utilsFolder.add({ export_stl: this.exportSTL.bind(this) }, 'export_stl').name('EXPORT STL FILE');

    // export button:
    // utilsFolder.add({ copy_ship_params: this.paramDump.bind(this) }, 'copy_ship_params');

    utilsFolder.add({ 
      copy_ship_params: () => {
        const text = this.paramDump();
        console.log("Ship Parameters:\n\n");
        console.log(text);
        navigator.clipboard.writeText(text)
          .then(() => alert('Ship params copied to clipboard (for supported browsers) and printed in the console'))
          .catch(err => console.error('Copy to clipboard failed, but still printed to console.', err));
      }
    }, 'copy_ship_params').name('COPY SHIP PARAMETERS');

    utilsFolder.add({ paste_ship: () => {
      const text = prompt("Paste ship parameters here:");
      try {
        const data = JSON.parse(text);
        console.log("Parsed object:", data);
        this.predefinedShips.unshift(data);
        this.shipSelector.setValue(this.predefinedShips[0].name);
      } catch (error) {
        console.error("Invalid JSON:", error.message);
        alert("The input is not valid JSON.");
        return null;
      }
    } }, 'paste_ship').name('PASTE SHIP PARAMETERS');


    utilsFolder.add({ save_ship: this.saveShipConfig.bind(this) }, 'save_ship').name('SAVE SHIP');

    // rescale button:
    utilsFolder.add({ scale_up: this.rescale.bind(this, 1) }, 'scale_up').name('SCALE UP');
    utilsFolder.add({ scale_down: this.rescale.bind(this, -1) }, 'scale_down').name('SCALE DOWN');


    // predefined ships:
    this.currentShip.name = this.predefinedShips[0].name;
    this.shipSelector = gui.add( this.currentShip, 'name', this.predefinedShips.map( (ship) => ship.name ) );

    this.shipSelector.onChange(
      function(newShipName) {
        this.setPredefinedShip(newShipName);
      }.bind(this)
    );

    // Material selector:
    const dummy = {skin: this.materialNames[this.materialIndex]};
    gui.add(dummy, 'skin', this.materialNames).name("SKIN").onChange( (value) => { this.handleMaterialIndexChange(value) } );

    // params:
    const that = this;
    for (var folder in this.controlConfiguration) {
      var controls = gui.addFolder(folder);
      let paramsInFolder = this.controlConfiguration[folder];
      // add a checkbox per folder
      const toggle_name = folder + '_toggle';
      this.controlParams[toggle_name] = true;

      let toggle = controls.add( this.controlParams, toggle_name, true ).name("VISIBLE");
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
        ).name(this.splitAtCaps(key));
        ref.onChange(function(){ this.dirty = true }.bind(this));
        ref.listen();
      }
    }
  }

  splitAtCaps(str) {
    return str.replace(/([a-z])([A-Z])/g, '$1 $2');
  }
} // class


var shipBuilder = new Builder(window);

window.sayback = (back) => {
  console.log("you said:", back);
}

function animate() {
  requestAnimationFrame( animate );
  shipBuilder.render();
}
animate();
