var THREE = require('three');
var dat = require('./dat.gui.min.js');
// require('./FirstPersonControls.js');
require('./orbit_controls.js');
import Stars from './Stars.js';
import Saucer from './saucer.js';

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
  lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
  lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
  lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

  lights[ 0 ].position.set( 0, 200, 0 );
  lights[ 1 ].position.set( 100, 200, 100 );
  lights[ 2 ].position.set( - 100, - 200, - 100 );

  scene.add( lights[ 0 ] );
  scene.add( lights[ 1 ] );
  scene.add( lights[ 2 ] );
}

function init() {
	container = document.getElementById( 'container' );

	// camera & controls
  camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 1, 1600000 );
  camera.position.z = 30;
  // controls = new THREE.FirstPersonControls(camera, container);
  controls = new THREE.OrbitControls( camera, container );
  // controls.movementSpeed = 100.0;
  controls.lookSpeed = 0.3;

	// scenes
  scene = new THREE.Scene();
  scene.background = new THREE.Color( SKY_COLOUR );

  sceneForeground = new THREE.Scene();

	// lights
	addLights(scene);

  // saucer
  var saucer = new Saucer();
  saucer.position.set(0.0, 0.0, 0.0);
  scene.add(saucer);
  camera.lookAt(saucer.position);

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
