import * as THREE from "three";

  const roughness = 0.55;
  const metalness = 0.8;
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

  export const hullMaterial = new THREE.MeshStandardMaterial({
    color: 0xeeeeef,
    emissive: 0xeeeeff,
    side: THREE.DoubleSide,
    flatShading: false,
    wireframe: false,
    map: tex,
    emissiveMap: texSaucerEm,
    emissiveIntensity: 0.8,
    metalnessMap: texSaucerSp,
    metalness: 0.9,
    // roughnessMap: tex,
    roughness: roughness,
    // bumpMap:texSaucerEm,
    // bumpScale: 12,
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

  export const bridgeMaterial = new THREE.MeshStandardMaterial({
    color: 0xeeeeef,
    emissive: 0xeeeeff,
    side: THREE.DoubleSide,
    flatShading: false,
    wireframe: false,
    map: tex,
    emissiveMap: texBridgeEm,
    emissiveIntensity: 0.8,
    metalnessMap: texBridgeSp,
    metalness: 1.0,
    // roughnessMap: texBridge,
    roughness: roughness,
  });

  var texNotch = new THREE.TextureLoader().load( "./images/saucer.png");
  texNotch.wrapS = THREE.MirroredRepeatWrapping;
  texNotch.wrapT = THREE.MirroredRepeatWrapping;
  texNotch.repeat.set( 0.15,0.5 );
  texNotch.colorSpace = THREE.SRGBColorSpace;

  var texNotchEm = new THREE.TextureLoader().load( "./images/saucer_em.png");
  texNotchEm.wrapS = THREE.MirroredRepeatWrapping;
  texNotchEm.wrapT = THREE.MirroredRepeatWrapping;
  texNotchEm.repeat.set( 0.25,0.5 );
  texNotchEm.colorSpace = THREE.SRGBColorSpace;

  var texNotchSp = new THREE.TextureLoader().load( "./images/saucer_sp.png");
  texNotchSp.wrapS = THREE.MirroredRepeatWrapping;
  texNotchSp.wrapT = THREE.MirroredRepeatWrapping;
  texNotchSp.repeat.set( 0.2,0.5 );
  texNotchSp.colorSpace = THREE.SRGBColorSpace;

  export const notchMaterial = new THREE.MeshStandardMaterial({
    color: 0xaaaaaa,
    emissive: 0xeeeeff,
    side: THREE.DoubleSide,
    flatShading: false,
    wireframe: false,
    map: texNotch,
    emissiveMap: texNotchEm,
    emissiveIntensity: 1.0,
    metalnessMap: texNotchSp,
    metalness: 0.5,
    // roughnessMap: texNotchSp,
    roughness: roughness,
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
  texEngEm.repeat.set( 4, 2);
  texEngEm.rotation = Math.PI * 1.0;
  texEngEm.offset.set(0.0, 0.01);
  texEngEm.colorSpace = THREE.SRGBColorSpace;

  export const engMaterial = new THREE.MeshStandardMaterial({
    color: 0xeeeeef,
    emissive: 0xffffff,
    emissiveMap: texEngEm,
    emissiveIntensity: 0.7,
    side: THREE.DoubleSide,
    flatShading: false,
    wireframe: false,
    map: texEng,
    metalnessMap: texEngSp,
    metalness: 0.3,
    // roughnessMap: texEng,
    roughness: roughness,
  });

  var texNeck = new THREE.TextureLoader().load( "./images/engineering.png");
  texNeck.wrapS = THREE.MirroredRepeatWrapping;
  texNeck.wrapT = THREE.MirroredRepeatWrapping;
  texNeck.repeat.set( 2, 0.5 );


  var texNeckSp = new THREE.TextureLoader().load( "./images/engineering_sp.png");
  texNeckSp.wrapS = THREE.MirroredRepeatWrapping;
  texNeckSp.wrapT = THREE.MirroredRepeatWrapping;
  texNeckSp.repeat.set( 2, 0.5 );


  var texNeckNm = new THREE.TextureLoader().load( "./images/neck2_nm.png");

  // var texNeckEm = new THREE.TextureLoader().load( "./images/neck2_em.png");
  // texNeckEm.wrapS = THREE.MirroredRepeatWrapping;
  // texNeckEm.wrapT = THREE.MirroredRepeatWrapping;
  // texNeckEm.offset.set(0, 0);
  // texNeckEm.repeat.set( 2, 2 );
  // texNeckEm.colorSpace = THREE.SRGBColorSpace;

  export const neckMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0x000000,
    // emissiveMap: texNeckEm,
    emissiveIntensity: 0.5,
    side: THREE.DoubleSide,
    flatShading: false,
    wireframe: false,
    map: texNeck,
    metalnessMap: texNeckSp,
    metalness: 0.4,
    // roughnessMap: texNeck,
    roughness: roughness,
    // normalMap: texNeckNm,
    // normalScale: new THREE.Vector2(0.5, 0.5),
  });

  const rotation = - Math.PI * 1.0;
  var texPylon = new THREE.TextureLoader().load( "./images/pylon.png");
  // var texPylon = new THREE.TextureLoader().load( "./images/uv_grid_opengl.jpg");
  texPylon.wrapS = THREE.MirroredRepeatWrapping;
  texPylon.wrapT = THREE.MirroredRepeatWrapping;
  texPylon.rotation = rotation;
  texPylon.repeat.set( -0.5, 0.5);
  texPylon.offset.set( -1, -1);
  // texPylon.center.set(0.0, 0.0);

  var texPylonSp = new THREE.TextureLoader().load( "./images/pylon_sp.png");
  texPylonSp.wrapS = THREE.MirroredRepeatWrapping;
  texPylonSp.wrapT = THREE.MirroredRepeatWrapping;
  texPylonSp.rotation = rotation;
  texPylonSp.repeat.set( 1.0, 0.5);
  // texPylonSp.offset.set( -0.5, -0.5);
  // texPylonSp.center.set(0.0, 0.0);

  // var texPylonEm = new THREE.TextureLoader().load( "./images/pylon_em.png");
  // texPylonEm.wrapS = THREE.MirroredRepeatWrapping;
  // texPylonEm.wrapT = THREE.MirroredRepeatWrapping;
  // texPylonEm.rotation = rotation;
  // texPylonEm.repeat.set(1, 1);
  // texPylonEm.offset.set(0.05, 0.0);
  // texPylonEm.colorSpace = THREE.SRGBColorSpace

  export const pylonMaterial = new THREE.MeshStandardMaterial({
    color: 0xeeeeef,
    // emissive: 0xffffff,
    side: THREE.DoubleSide,
    // flatShading: true,
    // wireframe: true,
    // wireframeLineWidth: 10,
    map: texPylon,
    metalnessMap: texPylonSp,
    metalness: 1.0,
    // emissiveMap: texPylonEm,
    // emissiveIntensity: 0.2,
    // roughnessMap: texPylon,
    roughness: roughness,
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

  export const nacelleMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xccccff,
    side: THREE.DoubleSide,
    flatShading: false,
    wireframe: false,
    map: texNacelle,
    // roughnessMap: texNacelle,
    emissiveMap: texNacelleEm,
    emissiveIntensity: 1.2,
    metalnessMap: texNacelleSp,
    metalness: 0.8,
    roughness: roughness,
  });

  var tex = new THREE.TextureLoader().load( "./images/dish.png");
  tex.wrapS = THREE.MirroredRepeatWrapping;
  tex.wrapT = THREE.MirroredRepeatWrapping;
  tex.repeat.set( 4, 1 );

  var texSp = new THREE.TextureLoader().load( "./images/dish_sp.png");
  texSp.wrapS = THREE.MirroredRepeatWrapping;
  texSp.wrapT = THREE.MirroredRepeatWrapping;
  texSp.repeat.set( 12, 1 );

  var texEm = new THREE.TextureLoader().load( "./images/dish_sp.png");
  texEm.wrapS = THREE.MirroredRepeatWrapping;
  texEm.wrapT = THREE.MirroredRepeatWrapping;
  texEm.repeat.set( 24, 4 );
  texEm.colorSpace = THREE.SRGBColorSpace;

  export const deflectorMaterial = new THREE.MeshStandardMaterial( {
    color: 0xffdd22,
    emissive: 0xdd9900,
    emissiveMap: texEm,
    emissiveIntensity: 3.0,
    side: THREE.DoubleSide,
    flatShading: false,
    map: texSp,
    metalnessMap: texSp,
    metalness: 7.0,
    // roughnessMap: tex,
    roughness: 0.55,
    // bumpMap: texSp,
    // bumpScale: 0.09,
  } );

  const texBussard = new THREE.TextureLoader().load( "./images/bussard_em.png");
  texBussard.wrapS = THREE.RepeatWrapping;
  texBussard.wrapT = THREE.RepeatWrapping;
  texBussard.repeat.set( 9, 1.5 );
  texBussard.colorSpace = THREE.SRGBColorSpace;

  export const bussardMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000,
    emissive: 0xff0000,
    emissiveIntensity: 2,
    opacity: 0.2,
    transparent: true,
    flatShading: false,
    metalnessMap: texBussard,
    roughnessMap: texBussard,
    metalness: 1,
    roughness: 0.9,
  });
    

  export const bussardInnerMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000,
    emissive: 0xff4400,
    emissiveIntensity: 5,
    transparent: false,
    flatShading: false,
    // map: tex,
    emissiveMap: texBussard.clone(),
    metalnessMap: texBussard,
    roughnessMap: texBussard,
    // alphaMap: tex,
    // alphaTest: -0.01,
    // bumpMap: tex,
    // bumpScale: 1.0,
    metalness: 0.6,
    roughness: 0.5,
  });

