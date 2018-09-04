var THREE = require('three');
var dat = require('./dat.gui.min.js');
require('./orbit_controls.js');
import Stars from './Stars.js';
import Nacelle from './nacelle.js';
import Engineering from './engineering.js';
import Primary from './primary.js';
import Neck from './neck.js';

var container, stats;
var camera, controls, scene, sceneForeground, renderer;
var clock = new THREE.Clock();

var controlParams = {
  f0Amp: 0.4,
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
  sceneForeground = new THREE.Scene();

  
	// lights
	addLights(scene);
  
  // ship
  var ship = new THREE.Group(); 
  
  // axes helper
  var axesHelper = new THREE.AxesHelper( 10 );
  ship.add( axesHelper );

  //materials
  var mainMaterial = new THREE.MeshPhongMaterial( { shininess: 99.9, color: 0x156289, emissive: 0x072534, side: THREE.DoubleSide, flatShading: true } );
  
  var primary = new Primary({thickness: 0.25, radius: 10.0, material: mainMaterial});
  primary.group.position.set(0.0, 0.0, 0.0);
  ship.add(primary.group);

  var separation = 6.0;
  var aft = 24.0;
  var height = -3.4;
  var length = 1.3;
  var width = 0.8;

  var nacelle_port= new Nacelle({length: length, width: width, material: mainMaterial});
  nacelle_port.position.set(separation, -aft, -height);
  ship.add(nacelle_port);

  var nacelle_starboard = new Nacelle({length: length, width: width, material: mainMaterial});
  nacelle_starboard.position.set(-separation, -aft, -height);
  ship.add(nacelle_starboard);

  var engineering = new Engineering({length: 1.6, width: 1.6, material: mainMaterial});
  engineering.group.position.set(0.0, -20.0, 6.0);
  ship.add(engineering.group);

  var neck = new Neck({primary: primary, engineering: engineering, material: mainMaterial});
  ship.add(neck);

  ship.rotateX(Math.PI * 0.5);
  ship.translateY(10.0);

  scene.add(ship);

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

  // controls.update( delta );
  renderer.clear();
  renderer.render( scene, camera );
  renderer.clearDepth();
  renderer.render( sceneForeground, camera );
}

function initControls(params){
  var gui = new dat.GUI( { autoPlace: true, width: 600 } );
  var f0 = gui.addFolder('base illumination level');
  f0.add(params, 'f0Amp', 0.0, 2.0, 0.01);
}
