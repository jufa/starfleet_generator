var simpleNoise = require('./noise.js').simpleNoise;
var skewedGuassian = require('./skewedGuassian.js').skewedGuassian;
var fbmNoise = require('./fbmNoise.js').fbmNoise;
var THREE = require('three');

export default class Curtain {

  constructor (
    { 
      segmentsHigh = 1, 
      segmentsWide = 400,
      width = 3000000,
      height = 280000,
      x = 0,
      y = 200000,
      z = 0,
      phase = 0.0 
    } = {},
    
  ) {
		this.segmentsHigh = segmentsHigh;
		this.segmentsWide = segmentsWide;
		this.x = x; // displacement along normal of curtains parallel to earth
		this.y = y; // + is away from center of earth
		this.z = z; // along length of curtain parallel to surface
		this.height = height;
		this.width = width;
    this.phase = phase;
	}
  

  shaderMaterial () {
    var vShader =
      `
      ${simpleNoise}
      ${fbmNoise}

      uniform float time;
      uniform float phase;
      varying vec2 vUv;

      uniform float v0Amp;
      uniform float v0SpatialFreq;
      uniform float v0TimeFreq;

      void main () {
        vUv = uv;
        float m_time = time * 0.001;
        vec2 st = vec2(m_time * v0SpatialFreq, vUv.y * v0TimeFreq * 10. * m_time);
        float f = fbm(st);
        float noise = f;

        noise *= v0Amp * 1000.0;
        vec3 newPos = position;
        newPos += normal * noise;
        newPos += vec3(0, 0.25, 0) * noise;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
      }
      `

      var fShader3 =
      `
      ${skewedGuassian}
      ${fbmNoise}
      ${simpleNoise}

      // emmission colours
      vec3 e630 = vec3(1.0, 79.0 / 255.0, 0.0);
      vec3 e558 = vec3(189.0 / 255.0, 1.0, 0.0);
      vec3 e428 = vec3(70.0 / 255.0, 0.0, 1.0);

      // emmision colour A/B distribution params for power curve and max amplitudes:
      vec3 dist630 = vec3(1.8, 5.65, 0.2);
      vec3 dist558 = vec3(14.75, 1.78, 1.0);
      vec3 dist428 = vec3(4.75, 1.78, 0.5);
      
      uniform float time;

      uniform float f0Amp;
      uniform float f0VerticalDistributionA;
      uniform float f0VerticalDistributionB;

      uniform float f1Amp;
      uniform float f1SpatialFreq;
      uniform float f1TimeFreq;
      uniform float f1VerticalDistributionA;
      uniform float f1VerticalDistributionB;

      uniform float verticalCenter;
      uniform float rayStretch;
      uniform float rayFrequency;
      uniform float bottomSharpness;
      uniform float maxBrightnessCenter;

      uniform float f3Amp;
      uniform float f3SpatialFreq;
      uniform float f3TimeFreq;
      uniform float f3VerticalDistributionA;
      uniform float f3VerticalDistributionB;

      uniform float phase;
      varying vec2 vUv;
      
      void main() {
        float m_time = time * .1;
        vec2 st = vec2(vUv.x * 100. * rayStretch, vUv.y * 100. * rayFrequency);
        vec4 color = vec4(0.0);
    
        vec2 q = vec2(0.);
        q.x = fbm( st );
        q.y = fbm( st + vec2(1.0));
    
        vec2 r = vec2(0.);
        r.x = fbm( st + 1.0 * q + vec2( 1.7, 9.2 ) + 0.45 * m_time * 0.6);
        r.y = fbm( st + 1.0 * q + vec2( 8.3, 2.8 ) + 0.126 * m_time * 0.6);
        float f = fbm(st + r);
        float structure = f * f * f + 0.6 * f * f + 0.5 * f;
        
        float red, g, b, a;
        red = 0.3;
        g = 0.7;
        b = 0.6 * structure;
        
        a = skewedGuassian(bottomSharpness, maxBrightnessCenter * vUv.x + verticalCenter + structure/4.);
        a = clamp(structure * a, 0.0, 1.0); 

        gl_FragColor = vec4(red, g, b, a);
      }
      `
      // to read about NS on GPU: http://jamie-wong.com/2016/08/05/webgl-fluid-simulation/

    var uniforms = {
      time: { type: "f", value: 1.0 },

      f0Amp: { type: "f", value: 0.0 },
      f0VerticalDistributionA: { type: "f", value: 1.0 },
      f0VerticalDistributionB: { type: "f", value: 1.0 },

      f1Amp: { type: "f", value: 0.5 },
      f1SpatialFreq: { type: "f", value: 0.0 },
      f1TimeFreq: { type: "f", value: 0.0 },
      f1VerticalDistributionA: { type: "f", value: 1.0 },
      f1VerticalDistributionB: { type: "f", value: 1.0 },

      verticalCenter: { type: "f", value: 0.0 },
      rayStretch: { type: "f", value: 0.0 },
      rayFrequency: { type: "f", value: 0.0 },
      bottomSharpness: { type: "f", value: 1.0 },
      maxBrightnessCenter: { type: "f", value: 1.0 },
      
      f3Amp: { type: "f", value: 0.0 },
      f3SpatialFreq: { type: "f", value: 0.0 },
      f3TimeFreq: { type: "f", value: 0.0 },
      f3VerticalDistributionA: { type: "f", value: 1.0 },
      f3VerticalDistributionB: { type: "f", value: 1.0 },

      v0Amp: { type: "f", value: 0.0 },
      v0SpatialFreq: { type: "f", value: 0.0 },
      v0TimeFreq: { type: "f", value: 0.0 },
      v0VerticalDistributionA: { type: "f", value: 1.0 },
      v0VerticalDistributionB: { type: "f", value: 1.0 },
      
      phase: { type: "f", value: Math.random() * 3.14 },
    };

    var shaderMaterial =
      new THREE.ShaderMaterial({
        uniforms: uniforms,
        fragmentShader: fShader3,
        vertexShader: vShader,
        wireframe: false,
        side: THREE.DoubleSide,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthTest: false, // http://learningwebgl.com/blog/?p=859 This is a little more interesting; we have to switch off depth testing. If we don’t do this, then the blending will happen in some cases and not in others. 
        lights: false
      });
    return shaderMaterial;
  }

	mesh() {
		this.geometry = new THREE.PlaneGeometry( this.height, this.width, this.segmentsHigh, this.segmentsWide );
    this.geometry.rotateX( Math.PI / 2.0 );
    this.geometry.rotateZ( Math.PI / 2.0 + 0.0 );

    this.material = this.shaderMaterial();
    this.mesh = new THREE.Mesh( this.geometry, this.material );

    // uncomment to see normal helpers
    // this.faceNormalsHelper = new THREE.FaceNormalsHelper( this.mesh, 10000 );
    // this.mesh.add( this.faceNormalsHelper );
    // this.vertexNormalsHelper = new THREE.VertexNormalsHelper( this.mesh, 10000 );
    // this.mesh.add( this.vertexNormalsHelper )

    this.geometry.translate(this.x, this.y, this.z);
    
    this.verticalWarp();
    
		return this.mesh;
  }
  
  verticalWarp () {
    var magnitude = 3000.0;
    var frequency = 0.06;
    var v = this.geometry.vertices;
    var stripNum = 0; // strip run from the base of the curtain upwards
    var pos = 0.0;
    const widthPerSegment = this.width / this.segmentsWide;
    for ( var i = 0; i < v.length; i ++ ) {
      stripNum = Math.floor( i / this.segmentsHigh );      
      // vanishing point: curve of earth simulation curves tha ends of the arc downwards:
      pos = -160000 * (Math.cos( ( stripNum / this.segmentsWide) * Math.PI ) + 1.0);
      pos += magnitude * Math.sin( ( v[i].z / widthPerSegment) * frequency );
      v[i].y += pos;
    }
  }
 
	animate(tick, params) {
    this.mesh.material.uniforms.time.value = tick;

    this.mesh.material.uniforms.f0Amp.value = params.f0Amp;
    this.mesh.material.uniforms.f0VerticalDistributionA.value = params.f0VerticalDistributionA;
    this.mesh.material.uniforms.f0VerticalDistributionB.value = params.f0VerticalDistributionB;

    this.mesh.material.uniforms.f1Amp.value = params.f1Amp;
    this.mesh.material.uniforms.f1SpatialFreq.value = params.f1SpatialFreq;
    this.mesh.material.uniforms.f1TimeFreq.value = params.f1TimeFreq;
    this.mesh.material.uniforms.f1VerticalDistributionA.value = params.f1VerticalDistributionA;
    this.mesh.material.uniforms.f1VerticalDistributionB.value = params.f1VerticalDistributionB;

    this.mesh.material.uniforms.verticalCenter.value = params.verticalCenter;
    this.mesh.material.uniforms.rayStretch.value = params.rayStretch;
    this.mesh.material.uniforms.rayFrequency.value = params.rayFrequency;
    this.mesh.material.uniforms.bottomSharpness.value = params.bottomSharpness;
    this.mesh.material.uniforms.maxBrightnessCenter.value = params.maxBrightnessCenter;

    this.mesh.material.uniforms.f3Amp.value = params.f3Amp;
    this.mesh.material.uniforms.f3SpatialFreq.value = params.f3SpatialFreq;
    this.mesh.material.uniforms.f3TimeFreq.value = params.f3TimeFreq;
    this.mesh.material.uniforms.f3VerticalDistributionA.value = params.f3VerticalDistributionA;
    this.mesh.material.uniforms.f3VerticalDistributionB.value = params.f3VerticalDistributionB;

    this.mesh.material.uniforms.v0Amp.value = params.v0Amp;
    this.mesh.material.uniforms.v0SpatialFreq.value = params.v0SpatialFreq;
    this.mesh.material.uniforms.v0TimeFreq.value = params.v0TimeFreq;

    // uncomment to update normal helpers
    // this.vertexNormalsHelper.update();
    // this.faceNormalsHelper.update();
	}
}
