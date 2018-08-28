var THREE = require('three');
var dat = require('./dat.gui.min.js');
require('./FirstPersonControls.js');
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

function init() {
	container = document.getElementById( 'container' );

	// camera & controls
	camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 1, 1600000 );
  controls = new THREE.FirstPersonControls(camera, container);
  controls.movementSpeed = 100.0;
  controls.lookSpeed = 0.3;
  controls.handleResize();

	// scenes
  scene = new THREE.Scene();
  scene.background = new THREE.Color( SKY_COLOUR );

  sceneForeground = new THREE.Scene();

	// light for Ground
	var light = new THREE.PointLight( 0xffffff, 1.5, 10000 );
	light.position.set( 500, 2500, 0 );
	
	sceneForeground.add(light);

	// saucer
  var saucer = new Saucer();
  saucer.position.set(1.0, 100.0, 100.0);
  scene.add(saucer);

  // light for Moon
	var light = new THREE.PointLight( 0xffffff, 2.5, 10000 );
	light.position.set( 1500, 3000, 0 );
	
  scene.add(light);
  
  var stars = new Stars({scene: scene});

	renderer = new THREE.WebGLRenderer({
    depth: true,
    alpha: true,
    transparency: THREE.OrderIndependentTransperancy
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
  
  controls.update( delta );
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
