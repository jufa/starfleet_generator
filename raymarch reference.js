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
const float OFFSET = EPS * 100.0;
const vec3 lightDir = vec3( -0.48666426339228763, 0.8111071056538127, -0.3244428422615251 );

// distance functions
// these tell you how far it is to a given object. 
// This is also where having a distance map texture could be handy

vec3 opRep( vec3 p, float interval ) {

  vec2 q = mod( p.xz, interval ) - interval * 0.5;
  return vec3( q.x, p.y, q.y );

}

float sphereDist( vec3 p, float r ) {
  return length( opRep( p, 1.0 ) ) - r ;

}

float floorDist( vec3 p ){
  
  // dot is a magnitude
  // betweent the input pov vector( which has a magnitude of say 1.0 to start)

  return dot(p, vec3( 0.0, 1.0, 0.0 ) ) + 3.0;

}

float wallDist( vec3 p ){

  return dot(p, vec3( 0.0, 0.0, 1.0 ) ) - 2.0* sin(p.x * 0.2) + 5.0;

}

vec4 minVec4( vec4 a, vec4 b ) {

  return ( a.a < b.a ) ? a : b;

}

// what is the ar here?
float checkeredPattern( vec3 p ) {

  float u = 1.0 - floor( mod( p.x, 2.0 ) );
  float v = 1.0 - floor( mod( p.z, 2.0 ) );

  if ( ( u == 1.0 && v < 1.0 ) || ( u < 1.0 && v == 1.0 ) ) {

    return 0.0;

  } else {

    return 1.0;

  }

}

// what is the ar here?
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

float sceneDist( vec3 p ) {
  // return 100.0;
  // return sphereDist( p, 1.0 );
  return min(
    wallDist( p ),
    floorDist( p )
  );
  return min(
    sphereDist( p, 0.25 ),
    floorDist( p )
  );

}

vec4 sceneColor( vec3 p ) {

  return minVec4(
    // 3 * 6 / 2 = 9
    vec4( vec3( 0.5 ) * checkeredPatternVertical( p ), wallDist( p ) ),
    vec4( vec3( 0.5 ) * checkeredPattern( p ), floorDist( p ) )
  );

  return vec4( vec3( 0.95 ) * checkeredPattern( p ), floorDist( p ) );
  // return vec4( hsv2rgb(vec3( ( p.z + p.x ) / 9.0, 1.0, 1.0 ) ), sphereDist( p, 1.0 ) );
  
  return minVec4(
    // 3 * 6 / 2 = 9
    vec4( hsv2rgb(vec3( ( p.z + p.x ) / 9.0, 1.0, 1.0 ) ), sphereDist( p, 1.0 ) ),
    vec4( vec3( 0.5 ) * checkeredPattern( p ), floorDist( p ) )
  );

}

vec3 getNormal( vec3 p ) {

  return normalize(vec3(
    sceneDist(p + vec3( EPS, 0.0, 0.0 ) ) - sceneDist(p + vec3( -EPS, 0.0, 0.0 ) ),
    sceneDist(p + vec3( 0.0, EPS, 0.0 ) ) - sceneDist(p + vec3( 0.0, -EPS, 0.0 ) ),
    sceneDist(p + vec3( 0.0, 0.0, EPS ) ) - sceneDist(p + vec3( 0.0, 0.0, -EPS ) )
  ));

}

float getShadow( vec3 ro, vec3 rd ) {

  float h = 0.0;
  float c = 0.0;
  float r = 1.0;
  float shadowCoef = 0.5;

  for ( float t = 0.0; t < 50.0; t++ ) {

    h = sceneDist( ro + rd * c );

    if ( h < EPS ) return shadowCoef;

    r = min( r, h * 16.0 / c );
    c += h;

  }
  return 1.0;
  return 1.0 - shadowCoef + r * shadowCoef;

}

vec3 getRayColor( vec3 origin, vec3 ray, out vec3 pos, out vec3 normal, out bool hit ) {

  // marching loop

  float dist;
  float depth = 0.0;
  pos = origin; // ray starts at the camera pinhole

  // i is iterations. increasing this increases how far we can see but not sure why
  // might be to do with the repetion ofthe scene?

  // the i < XX is XX is the max distance we can see
  for ( int i = 0; i < 64; i++ ){

    // get distance to the surface, magnitude
    // if the ray is parallel to the surface, dist will never get small, because it is a dot prod
    // with the ray vector
    // if it is perpendicular, the dot product will be 0.0 on the first iteration of i and we break
    // so this is kind of how much of an obliqueness we still see.  

    // ...so really this is a trick specific to the geometry of this demo


    dist = sceneDist( pos ); // pos is updated in each loop

    // why is this added to the depth?
    depth += dist;

    // what is pos? its a vector from the pinhole in the direction of the ray that is touching the surface
    pos = origin + depth * ray;

    //  what is EPS? shouldnt dist be increasing??
    // looking below this implies that this case is no surface hit at all
    // if ( abs(dist) < EPS ) break;

  }

  // out of the whole exercise above we get dist, a magnitude...

  // hit check and calc color
  vec3 color;

  if ( abs(dist) < EPS ) {

    normal = getNormal( pos );
    float diffuse = clamp( dot( lightDir, normal ), 0.5, 1.0 ) * 1.0;
    // float specular = pow( clamp( dot( reflect( lightDir, normal ), ray ), 0.0, 1.0 ), 10.0 );
    // float shadow = getShadow( pos + normal * OFFSET, lightDir );
    
    // color = ( sceneColor( pos ).rgb * diffuse + vec3( 0.8 ) * specular ) * max( 0.5, shadow );
    color = ( sceneColor( pos ).rgb * diffuse + vec3( 0.8 ) );

    hit = true;

  } else {

    color = vec3( 0.0 );

  }

  return color - pow( clamp( 0.05 * depth, 0.0, 0.6 ), 2.0 );

}

float curtainDist(vec3 p) {
  return dot(p, vec3( 0.0, 1.0, 0.5 ) )
    - 8.0 * cos(p.z * 0.051 + time * 0.0001)
    - 2.5 * cos(sin(time*0.00053)*p.z + time * 0.0035)
    + 0.15 * sin(p.z * 10.0 - time * 0.005)
    + 4.0;
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
  vec3 pos, normal;
  bool hit;
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
  saveImage: function () {

    renderer.render( scene, camera );
    window.open( canvas.toDataURL() );

  },
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

  dolly = new THREE.Group();
  scene.add( dolly );

  camera = new THREE.PerspectiveCamera( 130, canvas.width / canvas.height, 1, 2000 );
  camera.position.z = 4;
  dolly.add( camera );

  geometry = new THREE.PlaneBufferGeometry( 2.0, 2.0 );
  material = new THREE.RawShaderMaterial( {
    uniforms: {
      time: { type: "f", value: 1.0 },
      resolution: { value: new THREE.Vector2( canvas.width, canvas.height ) },
      cameraWorldMatrix: { value: camera.matrixWorld }, // matrixWorld is global pose of the camera
      //projectionMatrix
      cameraProjectionMatrixInverse: { value: new THREE.Matrix4().getInverse( camera.projectionMatrix ) }
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
  gui.add( config, 'saveImage' ).name( 'Save Image' );
  gui.add( config, 'resolution', [ '256', '512', '800', 'full' ] ).name( 'Resolution' ).onChange( onWindowResize );

  // stats = new Stats();
  // document.body.appendChild( stats.dom );
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

  // stats.begin();

  // dolly.position.z = - time;
  material.uniforms.time.value = time;
  renderer.render( scene, camera);
  controls.update( time * 0.0001);
  // stats.end();
  requestAnimationFrame( render );

}

