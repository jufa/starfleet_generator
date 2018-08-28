var THREE = require('three');
var dat = require('./dat.gui.min.js');
require('./FirstPersonControls.js');
import Curtain from './Curtain.js';
import CurtainStacked from './CurtainStacked.js';
import Stars from './Stars.js';
import Moon from './Moon.js';

var container, stats;
var camera, controls, scene, sceneForeground, renderer;
var mesh, meshGround, texture, geometry, geometryGround, material, materialGround;
var worldWidth = 256, worldDepth = 256,
worldHalfWidth = worldWidth / 2, worldHalfDepth = worldDepth / 2;
var clock = new THREE.Clock();
var curtains = [];

var controlParams = {
  f0Amp: 0.4,
  f0VerticalDistributionA: 0.6,
  f0VerticalDistributionB: 6.0,

  f1Amp: 0.65,
  f1SpatialFreq: 0.02,
  f1TimeFreq: 0.07,
  f1VerticalDistributionA: 0.7,
  f1VerticalDistributionB: 1.0,

  verticalCenter: -1.7,
  rayStretch: 0.0,
  rayFrequency: 0.23,
  bottomSharpness: 29.66,
  maxBrightnessCenter: 3.25,
  
  f3Amp: 0.27,
  f3SpatialFreq: 0.01,
  f3TimeFreq: -0.08,
  f3VerticalDistributionA: 8.3,
  f3VerticalDistributionB: 2.7,
  
  v0Amp: 1000,
  v0SpatialFreq: 0.162,
  v0TimeFreq: 0.05,

  spiralAmp: 0.0,
  spiralFreq: 2.0,
  spiralPhase: 0.0,
};

const SNOW_COLOUR = 0xbbbbee;
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

	// moon
  var moon = new Moon();
  moon.position.set( 300, 3900, -3600);
	scene.add(moon);

  // light for Moon
	var light = new THREE.PointLight( 0xffffff, 2.5, 10000 );
	light.position.set( 1500, 3000, 0 );
	
  scene.add(light);
  
	//aurora curtain
	// curtains.push(new Curtain({x: -100000, phase: 0.0}));
	// curtains.push(new Curtain({x: 500000, phase: 1000.}));
  // curtains.push(new Curtain({x: -500000, phase: 1222.}));
  // curtains.push(new Curtain({x: 0, phase: 1000.}));

  // curtains.push(new Curtain({x: 20000, phase: 5000.}));
  // curtains.push(new Curtain({x: 40000, phase: 10000.}));
  // curtains.push(new Curtain({x: 60000, phase: 14000.}));
  // curtains.push(new Curtain({x: 80000, phase: 25000.}));
  // curtains.push(new Curtain({x: 80000, phase: 3600.}));
  var textureLoader = new THREE.TextureLoader();
  
  var material = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthTest: false, // http://learningwebgl.com/blog/?p=859 This is a little more interesting; we have to switch off depth testing. If we don’t do this, then the blending will happen in some cases and not in others. 
    lights: false
  });
  
  material.map = textureLoader.load( "image/textures/helmholtz_speckle.png" );

  var max = 50;
  var spacing = 12.0;
  var clonedMaterial;
  var alpha = 0.0;
  var hueShift = 0.0;
  for (var i = 1; i <= max; i++) {
    clonedMaterial = material.clone();
    let color = new THREE.Color();
    alpha = 1.0 - parseFloat(i) / parseFloat(max);

    hueShift = 1.0 - parseFloat(i) / parseFloat(max);
    hueShift = Math.pow(hueShift, 8.0);
    color.setHSL(0.3 - hueShift, 0.3, 0.07 * alpha * alpha);
    clonedMaterial.color = color;
    curtains.push(new CurtainStacked({width: 200, height: 400, material: clonedMaterial, y: spacing * i + 50.0}));
  }
	curtains.forEach( c => scene.add(c.mesh()));

	// ground
	geometryGround = new THREE.PlaneGeometry( 20000, 20000, 300, 300 );
	geometryGround.rotateX( -Math.PI / 2 );

	var v = geometryGround.vertices;
	for (var i=0; i< v.length; i++){
		v[i].y = Math.sin(v[i].z/200) * 40;
		v[i].y += Math.sin(v[i].x/221) * 32;
		v[i].y -= (Math.sin(v[i].x / 2100 * Math.PI) + 0.5) * 120;
		v[i].y -= (Math.sin(v[i].z / 2000 * Math.PI) + 0.5) * 200;
	}
	materialGround = new THREE.MeshPhongMaterial( {
		color: SNOW_COLOUR,
		wireframe: false,
		lights: true,
		shading: THREE.FlatShading
	  } );
	meshGround = new THREE.Mesh( geometryGround, materialGround );
	meshGround.translateY(-400);
  sceneForeground.add( meshGround );
  
  var stars = new Stars({scene: scene});

	renderer = new THREE.WebGLRenderer({
    depth:false,
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
  curtains.forEach( c => c.animate(time, controlParams));
  
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
  f0.add(params, 'f0VerticalDistributionA', -5.0, 15.0, 0.01);
  f0.add(params, 'f0VerticalDistributionB', -5.0, 15.0, 0.01);

  var f1 = gui.addFolder('pixel shader 1: fine');
  f1.add(params, 'f1Amp', 0.0, 2.0, 0.01);
  f1.add(params, 'f1SpatialFreq', 0.0, 5.0, 0.001);
  f1.add(params, 'f1TimeFreq', -5.0, 5.0, 0.01);
  f1.add(params, 'f1VerticalDistributionA', -5.0, 15.0, 0.01);
  f1.add(params, 'f1VerticalDistributionB', -5.0, 15.0, 0.01);

  var f2 = gui.addFolder('vertical rays');
  f2.add(params, 'verticalCenter', -12.0, 12.0, 0.01);
  f2.add(params, 'rayStretch', 0.0, 1.0, 0.001);
  f2.add(params, 'rayFrequency', -5.0, 5.0, 0.01);
  f2.add(params, 'bottomSharpness', 0.0, 45.0, 0.01);
  f2.add(params, 'maxBrightnessCenter', -5.0, 15.0, 0.01);

  var f3 = gui.addFolder('pixel shader 3: travelling');
  f3.add(params, 'f3Amp', 0.0, 2.0, 0.01);
  f3.add(params, 'f3SpatialFreq', 0.0, 1.0, 0.001);
  f3.add(params, 'f3TimeFreq', -5.0, 5.0, 0.01);
  f3.add(params, 'f3VerticalDistributionA', -5.0, 15.0, 0.01);
  f3.add(params, 'f3VerticalDistributionB', -5.0, 15.0, 0.01);

  var v0 = gui.addFolder('vertex displacement');
  v0.add(params, 'v0Amp', 0.0, 1000.0, 0.1);
  v0.add(params, 'v0SpatialFreq', 0.0, 1.0, 0.001);
  v0.add(params, 'v0TimeFreq', -5.0, 5.0, 0.01);

  var s1 = gui.addFolder('spiral');
  s1.add(params, 'spiralAmp', -5.0, 15.0, 0.01);
  s1.add(params, 'spiralFreq', -5.0, 15.0, 0.01);
  s1.add(params, 'spiralPhase', -5.0, 15.0, 0.01);
}
