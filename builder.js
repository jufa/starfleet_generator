import * as THREE from "three";
import { OrbitControls }    from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer }   from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass }       from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass }  from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass }  from "three/examples/jsm/postprocessing/OutputPass.js";

// import * as dat from 'dat.gui';
import * as dat from 'lil-gui';
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
    this.CLEAR_COLOUR = 0x000000;
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
    tex.repeat.set( 4, 6 );
    tex.colorSpace = THREE.SRGBColorSpace;

    var texSaucerEm = new THREE.TextureLoader().load( "./images/saucer_em.png");
    texSaucerEm.wrapS = THREE.MirroredRepeatWrapping;
    texSaucerEm.wrapT = THREE.MirroredRepeatWrapping;
    texSaucerEm.repeat.set( 8, 5 );
    texSaucerEm.colorSpace = THREE.SRGBColorSpace;

    var texSaucerSp = new THREE.TextureLoader().load( "./images/saucer_sp.png");
    texSaucerSp.wrapS = THREE.MirroredRepeatWrapping;
    texSaucerSp.wrapT = THREE.MirroredRepeatWrapping;
    texSaucerSp.repeat.set( 6, 2 );
    texSaucerSp.colorSpace = THREE.SRGBColorSpace;

    this.hullMaterial = new THREE.MeshStandardMaterial({
      color: 0xeeeeef,
      emissive: 0xeeeeff,
      side: THREE.DoubleSide,
      flatShading: false,
      wireframe: false,
      map: tex,
      emissiveMap: texSaucerEm,
      emissiveIntensity: 0.7,
      metalnessMap: texSaucerSp,
      metalness: 0.2,
      roughnessMap: texSaucerSp,
      roughness: 30.0,
      // bumpMap:texSaucerSp,
      // bumpScale: -0.01,
    });

    var texBridge = new THREE.TextureLoader().load( "./images/saucer.png");
    texBridge.wrapS = THREE.MirroredRepeatWrapping;
    texBridge.wrapT = THREE.MirroredRepeatWrapping;
    texBridge.repeat.set( 4, 4 );
    texBridge.colorSpace = THREE.SRGBColorSpace;

    var texBridgeEm = new THREE.TextureLoader().load( "./images/saucer_em.png");
    texBridgeEm.wrapS = THREE.MirroredRepeatWrapping;
    texBridgeEm.wrapT = THREE.MirroredRepeatWrapping;
    texBridgeEm.repeat.set( 2, 6 );
    texBridgeEm.colorSpace = THREE.SRGBColorSpace;

    var texBridgeSp = new THREE.TextureLoader().load( "./images/saucer_sp.png");
    texBridgeSp.wrapS = THREE.MirroredRepeatWrapping;
    texBridgeSp.wrapT = THREE.MirroredRepeatWrapping;
    texBridgeSp.repeat.set( 4, 4 );
    texBridgeSp.colorSpace = THREE.SRGBColorSpace;

    this.bridgeMaterial = new THREE.MeshStandardMaterial({
      color: 0xeeeeef,
      emissive: 0xeeeeff,
      emissiveIntensity: 0.6,
      side: THREE.DoubleSide,
      flatShading: false,
      wireframe: false,
      map: tex,
      emissiveMap: texBridgeEm,
      emissiveIntensity: 0.6,
      metalnessMap: texBridgeSp,
      metalness: 0.8,
      roughnessMap: texBridgeSp,
      roughness: 10.0,
    });


    var texEng = new THREE.TextureLoader().load( "./images/engineering.png");
    texEng.wrapS = THREE.MirroredRepeatWrapping;
    texEng.wrapT = THREE.MirroredRepeatWrapping;
    texEng.repeat.set( 2, 1 );

    var texEngSp = new THREE.TextureLoader().load( "./images/engineering_sp.png");
    texEngSp.wrapS = THREE.MirroredRepeatWrapping;
    texEngSp.wrapT = THREE.MirroredRepeatWrapping;
    texEngSp.repeat.set( 4, 4 );

    var texEngEm = new THREE.TextureLoader().load( "./images/saucer_em.png");
    texEngEm.wrapS = THREE.MirroredRepeatWrapping;
    texEngEm.wrapT = THREE.MirroredRepeatWrapping;
    texEngEm.repeat.set( 2, 2 );
    texEngEm.rotation = Math.PI * 1;
    texEngEm.center.set(0.0, 0.668);
    texEngEm.colorSpace = THREE.SRGBColorSpace;

    this.engMaterial = new THREE.MeshStandardMaterial({
      color: 0xeeeeef,
      emissive: 0xffffff,
      emissiveMap: texEngEm,
      emissiveIntensity: 0.4,
      side: THREE.DoubleSide,
      flatShading: false,
      wireframe: false,
      map: texEng,
      metalnessMap: texEngSp,
      metalness: 0.3,
      roughnessMap: texEng,
      roughness: 0.5,
    });

    var texNeck = new THREE.TextureLoader().load( "./images/neck.png");
    texNeck.wrapS = THREE.RepeatWrapping;
    texNeck.wrapT = THREE.RepeatWrapping;
    texNeck.repeat.set( 10, 2 );
    
    var texNeckSp = new THREE.TextureLoader().load( "./images/neck_sp.png");
    texNeckSp.wrapS = THREE.RepeatWrapping;
    texNeckSp.wrapT = THREE.RepeatWrapping;
    texNeckSp.repeat.set( 10, 2 );

    var texNeckEm = new THREE.TextureLoader().load( "./images/saucer_em.png");
    texNeckEm.wrapS = THREE.MirroredRepeatWrapping;
    texNeckEm.wrapT = THREE.MirroredRepeatWrapping;
    texNeckEm.repeat.set( 2, 2 );
    texNeckEm.rotation = Math.PI * 0.5;
    texNeckEm.center.set(0.0,0.0);
    texNeckEm.colorSpace = THREE.SRGBColorSpace;

    this.neckMaterial = new THREE.MeshStandardMaterial({
      color: 0xeeeeef,
      emissive: 0xffffff,
      emissiveMap: texNeckEm,
      emissiveIntensity: 0.7,
      side: THREE.DoubleSide,
      flatShading: false,
      wireframe: false,
      map: texNeck,
      metalnessMap: texNeckSp,
      metalness: 0.8,
      roughnessMap: texNeckSp,
      roughness: 0.6,
    });

    const rotation = Math.PI * 0.5;
    var texPylon = new THREE.TextureLoader().load( "./images/pylon.png");
    texPylon.wrapS = THREE.MirroredRepeatWrapping;
    texPylon.wrapT = THREE.MirroredRepeatWrapping;
    texPylon.repeat.set( 1, 1);
    texPylon.center.set(0.0, 0.0);
    texPylon.rotation = rotation;

    var texPylonSp = new THREE.TextureLoader().load( "./images/pylon_sp.png");
    texPylonSp.wrapS = THREE.MirroredRepeatWrapping;
    texPylonSp.wrapT = THREE.MirroredRepeatWrapping;
    texPylonSp.repeat.set( 1, 1 );
    texPylonSp.center.set(0.0, 0.0);
    texPylonSp.rotation = rotation;

    // var texPylonEm = new THREE.TextureLoader().load( "./images/pylon_em.png");
    // texPylonEm.wrapS = THREE.MirroredRepeatWrapping;
    // texPylonEm.wrapT = THREE.MirroredRepeatWrapping;
    // texPylonEm.repeat.set(1, 1);
    // texPylonEm.rotation = rotation;
    // texPylonEm.center.set(0.0, 0.0);
    // texPylonEm.colorSpace = THREE.SRGBColorSpace

    this.pylonMaterial = new THREE.MeshStandardMaterial({
      color: 0xeeeeef,
      emissive: 0x000000,
      side: THREE.DoubleSide,
      // flatShading: true,
      // wireframe: true,
      wireframeLineWidth: 10,
      map: texPylon,
      metalnessMap: texPylonSp,
      metalness: 0.8,
      // emissiveMap: texPylonEm,
      emissiveIntensity: 1.0,
      roughnessMap: texPylon,
      roughness: 0.6,
    });
    const nacelleDefaultRotation = Math.PI * 0.0;
    var texNacelle = new THREE.TextureLoader().load( "./images/nacelle.png");
    texNacelle.wrapS = THREE.MirroredRepeatWrapping;
    texNacelle.wrapT = THREE.MirroredRepeatWrapping;
    texNacelle.repeat.set( 2, 1 );
    texNacelle.rotation = nacelleDefaultRotation;
    // texNacelle.center.set(0.0, 0.5); // Set rotation center to the middle of the texture
    
    var texNacelleEm = new THREE.TextureLoader().load( "./images/nacelle_em.png");
    texNacelleEm.wrapS = THREE.MirroredRepeatWrapping;
    texNacelleEm.wrapT = THREE.MirroredRepeatWrapping;
    texNacelleEm.repeat.set( 2, 1 );
    texNacelleEm.rotation = nacelleDefaultRotation;
    texNacelleEm.colorSpace = THREE.SRGBColorSpace;

    var texNacelleSp = new THREE.TextureLoader().load( "./images/nacelle_sp.png");
    texNacelleSp.wrapS = THREE.MirroredRepeatWrapping;
    texNacelleSp.wrapT = THREE.MirroredRepeatWrapping;
    texNacelleSp.repeat.set( 1, 3 );
    texNacelleSp.rotation = nacelleDefaultRotation;

    this.nacelleMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      side: THREE.DoubleSide,
      flatShading: false,
      wireframe: false,
      map: texNacelle,
      emissiveMap: texNacelleEm,
      emissiveIntensity: 0.4,
      metalnessMap: texNacelleSp,
      // bumpMap: texNacelleEm,
      // bumpScale: -1.0,
      metalness: 0.7,
      roughness: 0.4,
    });

    this.controlConfiguration = {
      // folderName: {paramName: [default, min, max, step]}
      // refer to variable in code as controlParams.folderName_paramName
      primary: {
        y: [-10, -30, 50, 0.01],
        z: [0.5, -30, 50, 0.01],
        radius: [12, 1, 30, 0.01],
        thickness: [4, 1, 10, 0.01],
        widthRatio: [1, 0, 10, 0.01],
        pointiness: [0.0, 0, 1.5, 0.01],
        bridgeThickness:  [1.0, 0.5, 5, 0.01],
        bridgeRadius: [0.1, 0.01, 1.2, 0.01],
        bridgeWidthRatio: [1, 0.01, 2, 0.01],
        bridgeZ: [0.0, -1, 2, 0.01],
        notchAngle: [0, 0, Math.PI, 0.01],
      },
      neck: {
        primaryForeOffset: [0.3, 0, 1, 0.01],
        primaryAftOffset: [0.3, 0, 1, 0.01],
        engineeringForeOffset: [0.3, 0, 1, 0.01],
        engineeringAftOffset: [0.3, 0, 1, 0.01],
        thickness: [0.15, 0.01, 5, 0.01],
      },
      engineering: {
        y: [-25, -60, 60, 0.01],
        z: [6, -30, 50, 0.01],
        length: [10, 1, 50, 0.01],
        radius: [1, 0, 10, 0.01],
        widthRatio: [1, 0.1, 10, 0.01],
        skew: [0, -5, 5, 0.01],
      },
      nacelle: {
        y: [40, -30, 50, 0.01],
        x: [2.5, -30, 50, 0.01],
        z: [-3.5, -30, 50, 0.01],
        length: [12, 1, 50, 0.01],
        radius: [1, 0.2, 12, 0.01],
        widthRatio: [1, 0.1, 10, 0.01],
        rotation: [0, -Math.PI / 2, Math.PI / 2, 0.01],
      },
      pylon: {
        nacelleForeOffset: [0.3, 0, 1, 0.01],
        nacelleAftOffset: [0.3, 0, 1, 0.01],
        engineeringForeOffset: [0.3, 0, 1, 0.01],
        engineeringAftOffset: [0.3, 0, 1, 0.01],
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
        rotation: [0, -Math.PI / 2, Math.PI / 2, 0.01],
      },
      pylonLower: {
        nacelleForeOffset: [0.3, 0, 1, 0.01],
        nacelleAftOffset: [0.3, 0, 1, 0.01],
        engineeringForeOffset: [0.3, 0, 1, 0.01],
        engineeringAftOffset: [0.3, 0, 1, 0.01],
        midPointOffset: [0.01, 0.01, 1.5, 0.01],
        thickness: [0.15, 0.01, 5, 0.01],
      },
    };

    this.init();
    this.initControls();
    this.build();
    this.setPredefinedShip(this.predefinedShips[0].name);
  }

  addLights() {
    var lights = [];
    const intensity = 1000;
    const dist = 50;
    lights[ 0 ] = new THREE.PointLight( 0xffffff, intensity, 0 );
    lights[ 1 ] = new THREE.PointLight( 0xffffff, intensity, 0 ); //bottom
    lights[ 2 ] = new THREE.PointLight( 0xffffff, intensity, 0 );

    lights[ 0 ].position.set( dist, dist, 0 );
    lights[ 1 ].position.set( -dist, -dist, 0 );
    lights[ 2 ].position.set( 0, 0, 40 );

    this.scene.add( lights[ 0 ] );
    this.scene.add( lights[ 1 ] );
    this.scene.add( lights[ 2 ] );
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

    this.primary = new Primary({ material: this.hullMaterial, bridgeMaterial: this.bridgeMaterial });
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
      material: this.pylonMaterial
    });
    this.mount(this.ship, this.portUpperPylon.group);

    this.starboardUpperPylon = new Pylon({
      nacelle: this.nacelleUpperStarboard,
      engineering: this.engineering,
      material: this.pylonMaterial
    });
    this.mount(this.ship, this.starboardUpperPylon.group);

    this.portLowerPylon = new Pylon({
      nacelle: this.nacelleLowerPort,
      engineering: this.engineering,
      material: this.pylonMaterial
    });
    this.mount(this.ship, this.portLowerPylon.group);

    this.starboardLowerPylon = new Pylon({
      nacelle: this.nacelleLowerStarboard,
      engineering: this.engineering,
      material: this.pylonMaterial
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
      notchAngle: controlParams.primary_notchAngle,
    });
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
      midpointOffset: controlParams.pylon_midPointOffset,
      thickness: controlParams.pylon_thickness,
    });

    this.starboardUpperPylon.group.visible = this.controlParams.pylon_toggle;
    this.starboardUpperPylon.update({
      nacelleForeOffset: controlParams.pylon_nacelleForeOffset,
      nacelleAftOffset: controlParams.pylon_nacelleAftOffset,
      engineeringForeOffset: controlParams.pylon_engineeringForeOffset,
      engineeringAftOffset: controlParams.pylon_engineeringAftOffset,
      midpointOffset: controlParams.pylon_midPointOffset,
      thickness: controlParams.pylon_thickness,
    });

    this.portLowerPylon.group.visible = this.controlParams.pylonLower_toggle;
    this.portLowerPylon.update({
      nacelleForeOffset: controlParams.pylonLower_nacelleForeOffset,
      nacelleAftOffset: controlParams.pylonLower_nacelleAftOffset,
      engineeringForeOffset: controlParams.pylonLower_engineeringForeOffset,
      engineeringAftOffset: controlParams.pylonLower_engineeringAftOffset,
      midpointOffset: controlParams.pylonLower_midPointOffset,
      thickness: controlParams.pylonLower_thickness,
    });

    this.starboardLowerPylon.group.visible = this.controlParams.pylonLower_toggle;
    this.starboardLowerPylon.update({
      nacelleForeOffset: controlParams.pylonLower_nacelleForeOffset,
      nacelleAftOffset: controlParams.pylonLower_nacelleAftOffset,
      engineeringForeOffset: controlParams.pylonLower_engineeringForeOffset,
      engineeringAftOffset: controlParams.pylonLower_engineeringAftOffset,
      midpointOffset: controlParams.pylonLower_midPointOffset,
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

    //make sure camera is orbiting the new position of the saucer:
    // const target = this.primary.group.position;
    // this.controls.target.set(target.x, target.y, target.z);
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
    this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1600000 );
    this.camera.position.z = 50;
    this.controls = new OrbitControls( this.camera, this.container );
    // this.controls.lookSpeed = 0.3;

    // scenes
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( this.SKY_COLOUR );
    // add skybox:
    // https://tools.wwwtyro.net/space-3d/index.html#animationSpeed=0.24598027238215495&fov=150&nebulae=true&pointStars=true&resolution=2048&seed=92cw15qrv81i&stars=true&sun=false
    
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

    // const material = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: textureCube } );

    // lights
    this.addLights(this.scene);

    // renderer
    this.renderer = new THREE.WebGLRenderer({
      depth: true,
      antialias: true,
      toneMapping: THREE.ACESFilmicToneMapping,
      toneMappingExposure: 1.5,
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
      0.6, // Strength
      0.02, // Radius
      0.5 // Threshold
    );
    this.composer.addPass(bloomPass);

    const outputPass = new OutputPass();
    this.composer.addPass( outputPass );
    

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
    const angle = shipBuilder.clock.getElapsedTime() * 2.0 % 100.0;
    const nacelles = [
      this.nacelleLowerPort,
      this.nacelleLowerStarboard,
      this.nacelleUpperPort,
      this.nacelleUpperStarboard,
    ]
    for (let i in nacelles) {
      nacelles[i].rotateBussard(angle * (-1.0)**i);
    }

    this.controls.update( shipBuilder.clock.getDelta() );
    // this.renderer.render( this.scene, this.camera );
    this.composer.render();
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
