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

var controlParams = {
  nacelleY: 40,
  nacelleX: 2.5,
  nacelleZ: -3.5,
  nacelleLength: 2,
  nacelleRadius: 1,
  nacelleWidthRatio: 1,
  engineeringZ: 1,
  engineeringLength: 1,
  engineeringRadius: 1,
  engineeringWidthRatio: 1,
  primaryY: -10,
  primaryZ: 0.5,
  primaryRadius: 12,
  primaryWidthRatio: 1,
};

const SKY_COLOUR = 0x111133;
const CLEAR_COLOUR = 0xffffff;

init();
initControls(controlParams);
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
  
  var primary = new Primary({thickness: 0.25, radius: controlParams.primaryRadius, widthRatio: controlParams.primaryWidthRatio, material: mainMaterial});
  primary.group.position.set(0.0, controlParams.primaryY, controlParams.primaryZ);
  ship.add(primary.group);

  var separation = controlParams.nacelleX * 2.0;
  var aft = controlParams.nacelleY;
  var height = controlParams.nacelleZ;
  var length = controlParams.nacelleLength;
  var width = controlParams.nacelleRadius;

  var nacellePort= new Nacelle({length: length, width: width, material: mainMaterial});
  nacellePort.group.position.set(separation, -aft, -height);
  ship.add(nacellePort.group);

  var nacelleStarboard = new Nacelle({length: length, width: width, material: mainMaterial});
  nacelleStarboard.group.position.set(-separation, -aft, -height);
  ship.add(nacelleStarboard.group);

  var engineering = new Engineering({length: 1.6, width: 0.9, widthRatio: 2.5, material: mainMaterial});
  engineering.group.position.set(0.0, -32.0, 6.0);
  ship.add(engineering.group);

  var neck = new Neck({primary: primary, engineering: engineering, material: mainMaterial});
  ship.add(neck);

  var portUpperPylon = new Pylon({nacelle: nacellePort, engineering: engineering, material: mainMaterial});
  ship.add(portUpperPylon);

  var starboardUpperPylon = new Pylon({nacelle: nacelleStarboard, engineering: engineering, material: mainMaterial});
  ship.add(starboardUpperPylon);

  ship.rotateX(Math.PI * 0.5);
  ship.translateY(10.0);

  scene.add(ship);
}

function init() {
	container = document.getElementById( 'container' );

	// camera & controls
  camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 1600000 );
  camera.position.z = 30;
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

function initControls(params){
  var gui = new dat.GUI( { autoPlace: true, width: 600 } );
  var controls = gui.addFolder('nacelles');
  for (var param in params) {
    controls.add(params, param, -30, 50, 0.1);
  }
}
