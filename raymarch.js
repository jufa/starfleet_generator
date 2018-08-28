//  Docs: https://qiita.com/gam0022/items/03699a07e4a4b5f2d41f

var THREE = require('three');
var dat = require('./dat.gui.min.js');
require('./FirstPersonControls.js');
var controls;
var time;

var fragmentShader = 
`
precision highp float;
uniform float time;
uniform vec2 resolution;
uniform mat4 viewMatrix;
uniform vec3 cameraPosition;
uniform mat4 cameraWorldMatrix;
uniform mat4 cameraProjectionMatrixInverse;

const float EPS = 0.01; // what is this

vec4 minVec4( vec4 a, vec4 b ) {
  return ( a.a < b.a ) ? a : b;
}

float checkeredPattern( vec3 p ) {
  float u = 1.0 - floor( mod( p.x, 2.0 ) );
  float v = 1.0 - floor( mod( p.z, 2.0 ) );
  if ( ( u == 1.0 && v < 1.0 ) || ( u < 1.0 && v == 1.0 ) ) {
    return 0.0;
  } else {
    return 1.0;
  }
}

float checkeredPatternVertical( vec3 p ) {
  float u = 1.0 - floor( mod( p.y, 2.0 ) );
  float v = 1.0 - floor( mod( p.x, 2.0 ) );
  if ( ( u == 1.0 && v < 1.0 ) || ( u < 1.0 && v == 1.0 ) ) {
    return 0.0;
  } else {
    return 1.0;
  }
}

vec3 hsv2rgb( vec3 c ) {
  vec4 K = vec4( 1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0 );
  vec3 p = abs( fract( c.xxx + K.xyz ) * 6.0 - K.www );
  return c.z * mix( K.xxx, clamp( p - K.xxx, 0.0, 1.0 ), c.y );
}

float curtainDist(vec3 p) {
  float dist = dot(p, vec3( 0.0, 1.0, 0.5 ) )
    - 5.0 * cos(p.z * 0.051 + time * 0.0001)
    - 2.3 * cos(sin(time*0.00053)*p.z + time * 0.0035)
    + 0.05 * cos(p.z * 10.0 - time * 0.01)
    + 2.5;
  return dist;
}

void main(void) {
  // screen position
  vec2 screenPos = ( gl_FragCoord.xy * 2.0 - resolution ) / resolution;

  // ray direction in normalized device coordinate
  vec4 ndcRay = vec4( screenPos.xy, 1.0, 1.0 );

  // convert ray direction from normalized device coordinate to world coordinate
  vec3 ray = ( cameraWorldMatrix * cameraProjectionMatrixInverse * ndcRay ).xyz;
  ray = normalize( ray );

  // camera position
  vec3 cPos = cameraPosition;

  // cast ray
  vec3 color = vec3( 0.0 );
  float alpha = 1.0;

  const int steps = 256;
  const float step_size = 0.05;
  vec3 position;

  vec4 curtain_color;
  alpha = 0.0;

  for ( int i = 0; i < steps; i++ ) {
    position = ray * step_size * float(i);
    if (abs(curtainDist(position)) < 160.0) {
      alpha += 0.007 * smoothstep(0.0, 4.0, 1.0 / abs(curtainDist(position)));
    }
  }
  color = vec3(0.2, 1.0, 0.5) * alpha;
  gl_FragColor = vec4(color, 1.0);
}
`

var vertexShader = 
`
attribute vec3 position;
void main(void) {
  gl_Position = vec4(position, 1.0);
}
`
var dolly, camera, scene, renderer;
var geometry, material, mesh;
var stats;

var config = {
  resolution: '512'
};

init();
render();

function init() {

  renderer = new THREE.WebGLRenderer( { canvas: canvas } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( config.resolution, config.resolution );

  window.addEventListener( 'resize', onWindowResize );

  // Scene
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 130, canvas.width / canvas.height, 1, 2000 );
  camera.position.z = 4;

  geometry = new THREE.PlaneBufferGeometry( 2.0, 2.0 );
  material = new THREE.RawShaderMaterial( {
    uniforms: {
      time: { type: "f", value: 1.0 },
      resolution: { value: new THREE.Vector2( canvas.width, canvas.height ) },
      cameraWorldMatrix: { value: camera.matrixWorld }, // matrixWorld is global pose of the camera
      cameraProjectionMatrixInverse: { value: new THREE.Matrix4().getInverse( camera.projectionMatrix ) } // projectionMatrix
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
  } );
  mesh = new THREE.Mesh( geometry, material );
  mesh.frustumCulled = false;
  scene.add( mesh );

  // Controls
  controls = new THREE.FirstPersonControls( camera, canvas );
  controls.movementSpeed = 0.1;
  controls.lookSpeed = 0.7;
  controls.handleResize();

  // GUI
  var gui = new dat.GUI();
  gui.add( config, 'resolution', [ '256', '512', '800', 'full' ] ).name( 'Resolution' ).onChange( onWindowResize );
}

function onWindowResize() {
  if ( config.resolution === 'full' ) {
    renderer.setSize( window.innerWidth, window.innerHeight );
  } else {
    renderer.setSize( config.resolution, config.resolution );
  }
  camera.aspect = canvas.width / canvas.height;
  camera.updateProjectionMatrix();
  material.uniforms.resolution.value.set( canvas.width, canvas.height );
  material.uniforms.cameraProjectionMatrixInverse.value.getInverse( camera.projectionMatrix );
}

function render( time ) {
  material.uniforms.time.value = time;
  renderer.render( scene, camera);
  controls.update( time * 0.0001);
  requestAnimationFrame( render );
}
