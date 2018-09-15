var THREE = require('three');
var dat = require('./dat.gui.min.js');
require('./orbit_controls.js');
import Stars from './Stars.js';
import Nacelle from './nacelle.js';
import Engineering from './engineering.js';
import Primary from './primary.js';
import Neck from './neck.js';
import Pylon from './pylon.js';

var container, stats;
var camera, controls, scene, renderer;
var clock = new THREE.Clock();

var controlConfiguration = {
  // folderName: {paramName: [default, min, max, step]}
  // refer to controlParams.folderName_paramName
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
var controlParams = {};

const SKY_COLOUR = 0x111133;
const CLEAR_COLOUR = 0xffffff;

init();
initControls(controlConfiguration, controlParams);
animate();

function addLights(scene) {
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

function buildShip(scene) {
  var prevShip = scene.getObjectByName('ship');
  scene.remove( prevShip );
  
  var ship = new THREE.Group(); 
  ship.name = 'ship'

  // axes helper
  var axesHelper = new THREE.AxesHelper( 10 );
  ship.add( axesHelper );

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
  nacellePort.group.position.set(separation, -aft, -height);
  ship.add(nacellePort.group);

  var nacelleStarboard = new Nacelle({length: length, width: width, material: mainMaterial});
  nacelleStarboard.group.position.set(-separation, -aft, -height);
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

function init() {
	container = document.getElementById( 'container' );

	// camera & controls
  camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 1600000 );
  camera.position.z = 40;
  controls = new THREE.OrbitControls( camera, container );
  controls.lookSpeed = 0.3;

	// scenes
  scene = new THREE.Scene();
  scene.background = new THREE.Color( SKY_COLOUR );

	// lights
  addLights(scene);
  
  // BG stars  
  var stars = new Stars({scene: scene});

	renderer = new THREE.WebGLRenderer({
    depth: true,
    alpha: true,
    transparency: THREE.OrderIndependentTransperancy,
    antialias: true
  });
  renderer.autoClear = false; // we need to renderers - one for aurora, one for FG since aurora have bo depth test (https://stackoverflow.com/questions/12666570)
  renderer.setClearColor( CLEAR_COLOUR );
	renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  
	container.innerHTML = "";
	container.appendChild( renderer.domElement );
	window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
	controls.handleResize();
}

function animate() {
	requestAnimationFrame( animate );
	render();
}

function render() {
	var delta = clock.getDelta(),
  time = clock.getElapsedTime() * 10;
  
  buildShip(scene);

  controls.update( delta );
  renderer.clear();
  renderer.render( scene, camera );
  renderer.clearDepth();
}

function initControls(config, params){
  var gui = new dat.GUI( { autoPlace: true, width: 400 } );
  // var controls = gui.addFolder('ship shape');
  for (var folder in config) {
    var controls = gui.addFolder(folder);
      let paramsInFolder = config[folder];
      for (var key in paramsInFolder) {
        params[folder + '_' + key] = paramsInFolder[key][0];
        controls.add(
          params, 
          folder + '_' + key, 
          paramsInFolder[key][1],
          paramsInFolder[key][2],
          paramsInFolder[key][3]
        )
      }
  }
  
}
