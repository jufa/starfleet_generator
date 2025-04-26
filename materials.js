import * as THREE from "three";

  const roughness = 0.55;
  const metalness = 0.8;

  const cubeLoader = new THREE.CubeTextureLoader();
  cubeLoader.setPath("./images/cubemap/");

  const skyboxTexture = cubeLoader.load
  ([
    "right.jpg", // +X (right)
    "left.jpg", // -X (left)
    "top.jpg", // +Y (top)
    "bottom.jpg", // -Y (bottom)
    "front.jpg", // +Z (front)
    "back.jpg",  // -Z (back)
  ]);

  const nacelleDefaultRotation = Math.PI * 0.0;
  const texturePorcEqui = new THREE.TextureLoader().load( './images/porcEqui.jpg' );
  texturePorcEqui.mapping = THREE.EquirectangularReflectionMapping;
  texturePorcEqui.colorSpace = THREE.SRGBColorSpace;

  var texNacellePorc = new THREE.TextureLoader().load( "./images/nacelle_porc.jpg");
  texNacellePorc.wrapS = THREE.MirroredRepeatWrapping;
  texNacellePorc.wrapT = THREE.MirroredRepeatWrapping;
  texNacellePorc.repeat.set( 1, 3 );
  texNacellePorc.rotation = nacelleDefaultRotation;
  texNacellePorc.colorSpace = THREE.SRGBColorSpace;

  var texNacelle = new THREE.TextureLoader().load( "./images/nacelle.png");
  texNacelle.wrapS = THREE.MirroredRepeatWrapping;
  texNacelle.wrapT = THREE.MirroredRepeatWrapping;
  texNacelle.repeat.set( 2, 1 );
  texNacelle.rotation = nacelleDefaultRotation;
  texNacelle.offset.set(0.0, 0.0); // Set rotation center to the middle of the texture

  var texNacelleEm = new THREE.TextureLoader().load( "./images/nacelle_em2.png");
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

  
  var texNacellePorcEm = new THREE.TextureLoader().load( "./images/nacelle_porc_emmissive.jpg");
  texNacellePorcEm.wrapS = THREE.MirroredRepeatWrapping;
  texNacellePorcEm.wrapT = THREE.MirroredRepeatWrapping;
  texNacellePorcEm.repeat.set( 2, 1 );
  texNacellePorcEm.rotation =  Math.PI * 1.0;
  const rotation = - Math.PI * 1.0;

  var texPylon = new THREE.TextureLoader().load( "./images/pylon.png");
  texPylon.wrapS = THREE.MirroredRepeatWrapping;
  texPylon.wrapT = THREE.MirroredRepeatWrapping;
  texPylon.rotation = rotation;
  texPylon.repeat.set( -0.5, 0.5);
  texPylon.offset.set( -1, -1);

  var texPylonSp = new THREE.TextureLoader().load( "./images/pylon_sp.png");
  texPylonSp.wrapS = THREE.MirroredRepeatWrapping;
  texPylonSp.wrapT = THREE.MirroredRepeatWrapping;
  texPylonSp.rotation = rotation;
  texPylonSp.repeat.set( 1.0, 0.5);

  var texPylonEm = new THREE.TextureLoader().load( "./images/pylonEm2.png");
  texPylonEm.wrapS = THREE.MirroredRepeatWrapping;
  texPylonEm.wrapT = THREE.MirroredRepeatWrapping;
  texPylonEm.rotation = rotation;
  texPylonEm.repeat.set(1, 1);
  texPylonEm.offset.set(0.0, 0.0);
  texPylonEm.colorSpace = THREE.SRGBColorSpace

  var texPylonSp_03 = new THREE.TextureLoader().load( "./images/pylonEm2.png");
  texPylonSp_03.wrapS = THREE.MirroredRepeatWrapping;
  texPylonSp_03.wrapT = THREE.MirroredRepeatWrapping;
  texPylonSp_03.rotation = rotation;
  texPylonSp_03.repeat.set(2, 2);
  texPylonSp_03.offset.set(0.0, 0.0);
  texPylonSp_03.colorSpace = THREE.SRGBColorSpace

  var texNeck = new THREE.TextureLoader().load( "./images/engineering.png");
  texNeck.wrapS = THREE.MirroredRepeatWrapping;
  texNeck.wrapT = THREE.MirroredRepeatWrapping;
  texNeck.repeat.set( 2, 0.5 );

  var texNeckSp = new THREE.TextureLoader().load( "./images/engineering_sp.png");
  texNeckSp.wrapS = THREE.MirroredRepeatWrapping;
  texNeckSp.wrapT = THREE.MirroredRepeatWrapping;
  texNeckSp.repeat.set( 2, 0.5 );
  var texNeckNm = new THREE.TextureLoader().load( "./images/neck2_nm.png");

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

  const texSaucer = new THREE.TextureLoader().load( "./images/saucer.png");
  texSaucer.wrapS = THREE.MirroredRepeatWrapping;
  texSaucer.wrapT = THREE.MirroredRepeatWrapping;
  texSaucer.repeat.set( 4, 6 );
  texSaucer.colorSpace = THREE.SRGBColorSpace;

  const texSaucerEm = new THREE.TextureLoader().load( "./images/saucer_em.png");
  texSaucerEm.wrapS = THREE.MirroredRepeatWrapping;
  texSaucerEm.wrapT = THREE.MirroredRepeatWrapping;
  texSaucerEm.repeat.set( 8, 5 );
  texSaucerEm.colorSpace = THREE.SRGBColorSpace;

  const texSaucerInvertEm = new THREE.TextureLoader().load( "./images/saucer_invert_em.jpg");
  texSaucerInvertEm.wrapS = THREE.MirroredRepeatWrapping;
  texSaucerInvertEm.wrapT = THREE.MirroredRepeatWrapping;
  texSaucerInvertEm.repeat.set( 6,6 );
  texSaucerInvertEm.colorSpace = THREE.SRGBColorSpace;

  const texSaucerSp = new THREE.TextureLoader().load( "./images/saucer_sp.png");
  texSaucerSp.wrapS = THREE.MirroredRepeatWrapping;
  texSaucerSp.wrapT = THREE.MirroredRepeatWrapping;
  texSaucerSp.repeat.set( 6, 2 );
  texSaucerSp.colorSpace = THREE.SRGBColorSpace;

  const texBussard = new THREE.TextureLoader().load( "./images/bussard_em.png");
  texBussard.wrapS = THREE.RepeatWrapping;
  texBussard.wrapT = THREE.RepeatWrapping;
  texBussard.repeat.set( 9, 1.5 );
  texBussard.colorSpace = THREE.SRGBColorSpace;

  var texEng = new THREE.TextureLoader().load( "./images/engineering.png");
  texEng.wrapS = THREE.MirroredRepeatWrapping;
  texEng.wrapT = THREE.MirroredRepeatWrapping;
  texEng.repeat.set( 2, 1 );

  var texEngSp = new THREE.TextureLoader().load( "./images/engineering_sp.png");
  texEngSp.wrapS = THREE.MirroredRepeatWrapping;
  texEngSp.wrapT = THREE.MirroredRepeatWrapping;
  texEngSp.repeat.set( 4, 4 );

  var texEngPorc = new THREE.TextureLoader().load( "./images/eng_porcelain.jpg");
  texEngPorc.wrapS = THREE.MirroredRepeatWrapping;
  texEngPorc.wrapT = THREE.RepeatWrapping;
  texEngPorc.repeat.set( 2, 1.0 );
  texEngPorc.offset.set(0.0, 0.0);

  var texEngEm = new THREE.TextureLoader().load( "./images/saucer_em.png");
  texEngEm.wrapS = THREE.MirroredRepeatWrapping;
  texEngEm.wrapT = THREE.MirroredRepeatWrapping;
  texEngEm.repeat.set( 4, 2);
  texEngEm.rotation = Math.PI * 1.0;
  texEngEm.offset.set(0.0, 0.01);
  texEngEm.colorSpace = THREE.SRGBColorSpace;

  const texDesk = new THREE.TextureLoader().load( "./images/saucer.png");
  texDesk.wrapS = THREE.MirroredRepeatWrapping;
  texDesk.wrapT = THREE.MirroredRepeatWrapping;
  texDesk.repeat.set( 1, 2 );

  const tex1963 = new THREE.TextureLoader().load( "./images/saucer2.jpg");
  tex1963.wrapS = THREE.MirroredRepeatWrapping;
  tex1963.wrapT = THREE.MirroredRepeatWrapping;
  tex1963.repeat.set( 3, 6 );
  tex1963.colorSpace = THREE.SRGBColorSpace;

  var texDishSp = new THREE.TextureLoader().load( "./images/dish_sp.png");
  texDishSp.wrapS = THREE.MirroredRepeatWrapping;
  texDishSp.wrapT = THREE.MirroredRepeatWrapping;
  texDishSp.repeat.set( 12, 2 );

  var texDishEm = new THREE.TextureLoader().load( "./images/dish_sp.png");
  texDishEm.wrapS = THREE.MirroredRepeatWrapping;
  texDishEm.wrapT = THREE.MirroredRepeatWrapping;
  texDishEm.repeat.set( 24, 4 );
  texDishEm.colorSpace = THREE.SRGBColorSpace;

  var texDish = new THREE.TextureLoader().load( "./images/dish.png");
  texDish.wrapS = THREE.MirroredRepeatWrapping;
  texDish.wrapT = THREE.MirroredRepeatWrapping;
  texDish.repeat.set( 6, 2 );

  const goldMaterial = new THREE.MeshMatcapMaterial( {
    color: 0xffffff,
    emissive: 0x99aaff,
    side: THREE.DoubleSide,
    matcap: new THREE.TextureLoader().load( "./images/matcap_gold.jpeg"),
    map: texDesk,
  } );

  // const goldDishMaterial = new THREE.MeshMatcapMaterial( {
  //   color: 0xffffff,
  //   side: THREE.DoubleSide,
  //   matcap: new THREE.TextureLoader().load( "./images/matcap_gold.jpeg"),
  //   map: texDish,
  //   bumpMap: texDish,
  //   bumpScale: 0.006
  // } );

  const goldDishMaterial = new THREE.MeshStandardMaterial({
    color: 0xffaa22,
    emissive: 0xff9922,
    side: THREE.DoubleSide,
    // matcap: new THREE.TextureLoader().load( "./images/matcap-porcelain-white.jpg"),
    envMap: texturePorcEqui,
    envMapIntensity: 4.0,
    emissiveMap: texSaucerEm,
    emissiveIntensity: 5.1,
    roughness: 0.9,
    roughnessMap: texDishEm,
    metallessMap: texDish,
    metalness: 0.9,
    map: texDish,
    // bumpMap: texDishSp,
    // bumpScale: 0.006,
} );

  const porcEnvMapIntesity = 1.5;

  const porcMaterial = new THREE.MeshStandardMaterial( {
    color: 0xffffff,
    emissive: 0xffffff,
    side: THREE.DoubleSide,
    map: texNacellePorc,
    envMap: texturePorcEqui,
    envMapIntensity: porcEnvMapIntesity,
    // emissiveMap: texSaucerEm,
    emissiveIntensity: 0.0,
    roughnessMap: texNacelleSp,
    roughness: 1.5,
    metalness: 0.0,
  } );

  const porcNacelleMaterial = new THREE.MeshStandardMaterial( {
    color: 0xffffff,
    emissive: 0xaaccff,
    side: THREE.DoubleSide,
    map: texNacellePorc,
    envMap: texturePorcEqui,
    envMapIntensity: porcEnvMapIntesity,
    emissiveMap: texNacelleEm,
    emissiveIntensity: 0.6,
    roughnessMap: texNacelleSp,
    roughness: 1.5,
    metalness: 0.0,
  } );

  const porcEngMaterial = new THREE.MeshStandardMaterial( {
    color: 0xffffff,
    emissive: 0xffffff,
    side: THREE.DoubleSide,
    // matcap: new THREE.TextureLoader().load( "./images/matcap-porcelain-white.jpg"),
    map: texEngPorc,
    envMap: texturePorcEqui,
    envMapIntensity: porcEnvMapIntesity,
    emissiveMap: texEngEm,
    emissiveIntensity: 0.9,
    roughnessMap: texEngSp,
    roughness: 0.5,
    metalness: 0.1,
  } );

  const porcSaucerMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      side: THREE.DoubleSide,
      // matcap: new THREE.TextureLoader().load( "./images/matcap-porcelain-white.jpg"),
      envMap: texturePorcEqui,
      envMapIntensity: porcEnvMapIntesity,
      emissiveMap: texSaucerEm,
      emissiveIntensity: 0.6,
      roughness: 0.4,
      metalness: 0.2,
      roughnessMap: texSaucer,
      map: tex1963,
  } );

  const wireframeMaterial = new THREE.MeshStandardMaterial( {
    color: 0xffffff,
    emissive: 0x99aaff,
    emissiveIntensity: 0.2,
    side: THREE.DoubleSide,
    wireframe: true,
    map: texDesk,
  } );

  const chromeMaterial = new THREE.MeshMatcapMaterial( {
    color: 0xffffff,
    emissive: 0x99aaff,
    side: THREE.DoubleSide,
    matcap: new THREE.TextureLoader().load( "./images/matcap_chrome.jpg"),
    map: texDesk,
  } );

  export const hullMaterial = [];
  const hullMaterial_01 = new THREE.MeshStandardMaterial({
    color: 0xeeeeef,
    emissive: 0xeeeeff,
    side: THREE.DoubleSide,
    flatShading: false,
    wireframe: false,
    map: texSaucer,
    emissiveMap: texSaucerEm,
    emissiveIntensity: 0.8,
    metalnessMap: texSaucerSp,
    metalness: 0.9,
    roughness: roughness,
  });
  const hullMaterial_02 = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
    side: THREE.DoubleSide,
    flatShading: false,
    wireframe: false,
    emissiveMap: texSaucerEm,
    emissiveIntensity: 0.8,
    metalnessMap: texSaucer,
    metalness: 0.7,
    roughness: 0.6,
  });
  const hullMaterial_03 = new THREE.MeshStandardMaterial({
    color: 0x222222,
    emissive: 0x00ffff,
    side: THREE.DoubleSide,
    flatShading: false,
    wireframe: false,
    emissiveMap: texSaucerEm,
    emissiveIntensity: 1.1,
    metalnessMap: texSaucer,
    metalness: 1.0,
    roughness: 0.6,
  });
  hullMaterial.push(hullMaterial_01);
  hullMaterial.push(hullMaterial_02);
  hullMaterial.push(hullMaterial_03);
  hullMaterial.push(goldMaterial);
  hullMaterial.push(chromeMaterial);
  hullMaterial.push(wireframeMaterial);
  hullMaterial.push(porcSaucerMaterial);

  export const bridgeMaterial = [];
  const bridgeMaterial_01 = new THREE.MeshStandardMaterial({
    color: 0xeeeeef,
    emissive: 0xeeeeff,
    side: THREE.DoubleSide,
    flatShading: false,
    wireframe: false,
    map: texSaucer,
    emissiveMap: texBridgeEm,
    emissiveIntensity: 0.8,
    metalnessMap: texBridgeSp,
    metalness: 1.0,
    roughness: roughness,
  });
  const bridgeMaterial_02 = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
    side: THREE.DoubleSide,
    flatShading: false,
    wireframe: false,
    emissiveMap: texBridgeEm,
    emissiveIntensity: 0.7,
    metalnessMap: texBridge,
    metalness: 0.6,
    roughness: 0.6,
  });
  const bridgeMaterial_03 = new THREE.MeshStandardMaterial({
    color: 0x222222,
    emissive: 0x00ffff,
    side: THREE.DoubleSide,
    flatShading: false,
    wireframe: false,
    emissiveMap: texBridgeEm,
    emissiveIntensity: 0.7,
    metalnessMap: texBridge,
    metalness: 1,
    roughness: 0.6,
  });
  bridgeMaterial.push(bridgeMaterial_01);
  bridgeMaterial.push(bridgeMaterial_02);
  bridgeMaterial.push(bridgeMaterial_03);
  bridgeMaterial.push(goldMaterial);
  bridgeMaterial.push(chromeMaterial);
  bridgeMaterial.push(wireframeMaterial);
  bridgeMaterial.push(porcSaucerMaterial);

  export const notchMaterial = [];
  const notchMaterial_01 = new THREE.MeshStandardMaterial({
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
    roughness: roughness,
  });
  const notchMaterial_02 = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
    side: THREE.DoubleSide,
    flatShading: false,
    wireframe: false,
    emissiveMap: texNotchEm,
    emissiveIntensity: 1.0,
    metalnessMap: texNotchSp,
    metalness: 0.5,
    roughness: roughness,
  });
  const notchMaterial_03 = new THREE.MeshStandardMaterial({
    color: 0x222222,
    emissive: 0x00ffff,
    side: THREE.DoubleSide,
    flatShading: false,
    wireframe: false,
    emissiveMap: texNotchEm,
    emissiveIntensity: 1.0,
    metalnessMap: texNotchSp,
    metalness: 1.0,
    roughness: roughness,
  });
  notchMaterial.push(notchMaterial_01);
  notchMaterial.push(notchMaterial_02);
  notchMaterial.push(notchMaterial_03);
  notchMaterial.push(goldMaterial);
  notchMaterial.push(chromeMaterial);
  notchMaterial.push(wireframeMaterial);
  notchMaterial.push(porcMaterial);

  

  export const engMaterial = [];
  const engMaterial_01 = new THREE.MeshStandardMaterial({
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
    roughness: roughness,
  });
  const engMaterial_02 = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveMap: texEngEm,
    emissiveIntensity: 0.7,
    side: THREE.DoubleSide,
    flatShading: false,
    wireframe: false,
    metalnessMap: texEngSp,
    metalness: 0.3,
    roughness: roughness,
  });
  const engMaterial_03 = new THREE.MeshStandardMaterial({
    color: 0x222222,
    emissive: 0x00ffff,
    emissiveMap: texEngEm,
    emissiveIntensity: 0.7,
    side: THREE.DoubleSide,
    flatShading: false,
    wireframe: false,
    metalnessMap: texEngSp,
    metalness: 1,
    roughness: roughness,
  });
  engMaterial.push(engMaterial_01);
  engMaterial.push(engMaterial_02);
  engMaterial.push(engMaterial_03);
  engMaterial.push(goldMaterial);
  engMaterial.push(chromeMaterial);
  engMaterial.push(wireframeMaterial);
  engMaterial.push(porcEngMaterial);

  export const neckMaterial = [];
  const neckMaterial_01 = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0x000000,
    emissiveIntensity: 0.5,
    side: THREE.DoubleSide,
    flatShading: false,
    wireframe: false,
    map: texNeck,
    metalnessMap: texNeckSp,
    metalness: 0.4,
    roughness: roughness,
  });
  const neckMaterial_02 = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 0.0,
    side: THREE.DoubleSide,
    flatShading: false,
    wireframe: false,
    metalnessMap: texNeckSp,
    metalness: 0.3,
    roughness: roughness,
  });
  const neckMaterial_03 = new THREE.MeshStandardMaterial({
    color: 0x222222,
    emissive: 0x00ffff,
    emissiveIntensity: 0.0,
    side: THREE.DoubleSide,
    flatShading: false,
    wireframe: false,
    metalnessMap: texNeckSp,
    metalness: 1,
    roughness: roughness,
  });
  neckMaterial.push(neckMaterial_01);
  neckMaterial.push(neckMaterial_02);
  neckMaterial.push(neckMaterial_03);
  neckMaterial.push(goldMaterial);
  neckMaterial.push(chromeMaterial);
  neckMaterial.push(wireframeMaterial);
  neckMaterial.push(porcMaterial);
  
  

  export const pylonMaterial = [];
  const pylonMaterial_01 = new THREE.MeshStandardMaterial({
    color: 0xeeeeef,
    side: THREE.DoubleSide,
    map: texPylon,
    metalnessMap: texPylonSp,
    metalness: 1.0,
    roughness: roughness,
  });
  const pylonMaterial_02 = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    metalnessMap: texPylonSp,
    metalness: 1.0,
    roughness: roughness,
  });
  const pylonMaterial_03 = new THREE.MeshStandardMaterial({
    color: 0x222222,
    emissive: 0x00ffff,
    side: THREE.DoubleSide,
    metalnessMap: texPylonSp_03,
    metalness: 1.0,
    emissiveMap: texPylonEm,
    emissiveIntensity: 1,
    roughness: roughness,
  });
  pylonMaterial.push(pylonMaterial_01);
  pylonMaterial.push(pylonMaterial_02);
  pylonMaterial.push(pylonMaterial_03);
  pylonMaterial.push(goldMaterial);
  pylonMaterial.push(chromeMaterial);
  pylonMaterial.push(wireframeMaterial);
  pylonMaterial.push(porcMaterial);

  export const nacelleMaterial = [];
  const nacelleMaterial_01 = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xccccff,
    side: THREE.DoubleSide,
    flatShading: false,
    wireframe: false,
    map: texNacelle,
    emissiveMap: texNacelleEm,
    emissiveIntensity: 1.2,
    metalnessMap: texNacelleSp,
    metalness: 0.8,
    roughness: roughness,
  });
  const nacelleMaterial_02 = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xccffff,
    side: THREE.DoubleSide,
    flatShading: false,
    wireframe: false,
    emissiveMap: texNacelleEm,
    emissiveIntensity: 0.8,
    metalnessMap: texNacelleSp,
    metalness: 0.7,
    roughness: 0.6,
  });
  const nacelleMaterial_03 = new THREE.MeshStandardMaterial({
    color: 0x222222,
    emissive: 0x00ffff,
    side: THREE.DoubleSide,
    flatShading: false,
    wireframe: false,
    emissiveMap: texNacelleEm,
    emissiveIntensity: 0.8,
    metalnessMap: texNacelleSp,
    metalness: 1,
    roughness: 0.6,
  });
  nacelleMaterial.push(nacelleMaterial_01);
  nacelleMaterial.push(nacelleMaterial_02);
  nacelleMaterial.push(nacelleMaterial_03);
  nacelleMaterial.push(goldMaterial);
  nacelleMaterial.push(chromeMaterial);
  nacelleMaterial.push(wireframeMaterial);
  nacelleMaterial.push(porcNacelleMaterial);

  export const deflectorMaterial = [];
  const deflectorMaterial_01 = new THREE.MeshStandardMaterial( {
    color: 0xffdd22,
    emissive: 0xdd9900,
    emissiveMap: texDishEm,
    emissiveIntensity: 3.0,
    side: THREE.DoubleSide,
    flatShading: false,
    map: texDishSp,
    metalnessMap: texDishSp,
    metalness: 7.0,
    roughness: 0.55,
  } );
  const deflectorMaterial_02 = new THREE.MeshStandardMaterial( {
    color: 0xffffff,
    emissive: 0x99ddff,
    emissiveMap: texDishEm,
    emissiveIntensity: 3.0,
    side: THREE.DoubleSide,
    flatShading: false,
    metalness: 0.9,
    roughness: 1.0,
  } );
  const deflectorMaterial_03 = new THREE.MeshStandardMaterial( {
    color: 0x222222,
    emissive: 0x00ffff,
    emissiveMap: texDishEm,
    emissiveIntensity: 3.0,
    side: THREE.DoubleSide,
    flatShading: false,
    metalness: 0.9,
    roughness: 1.0,
  } );

  deflectorMaterial.push(deflectorMaterial_01);
  deflectorMaterial.push(deflectorMaterial_02);
  deflectorMaterial.push(deflectorMaterial_03);
  deflectorMaterial.push(goldMaterial);
  deflectorMaterial.push(chromeMaterial);
  deflectorMaterial.push(wireframeMaterial);
  deflectorMaterial.push(goldDishMaterial);

  export const bussardMaterial = [];
  const bussardMaterial_01 = new THREE.MeshStandardMaterial({
    color: 0xff0000,
    emissive: 0xff0000,
    emissiveIntensity: 0.6,
    opacity: 0.8,
    transparent: true,
    flatShading: false,
    metalnessMap: texBussard,
    roughnessMap: texBussard,
    envMap: texturePorcEqui,
    envMapIntensity: 10,
    metalness: 2,
    roughness: 0.5,
  });

  const bussardMaterial_02 = new THREE.MeshStandardMaterial({
    color: 0x00ffff,
    emissive: 0x99aaff,
    emissiveIntensity: 0.2,
    opacity: 0.6,
    transparent: true,
    flatShading: false,
    metalnessMap: texBussard,
    roughnessMap: texBussard,
    metalness: 0,
    roughness: 0.7,
  });

  const bussardMaterial_03 = new THREE.MeshStandardMaterial({
    color: 0x00ffff,
    emissive: 0x00ffff,
    emissiveIntensity: 0.2,
    opacity: 0.8,
    transparent: true,
    flatShading: false,
    metalnessMap: texBussard,
    roughnessMap: texBussard,
    metalness: 0,
    roughness: 0.7,
  });

  bussardMaterial.push(bussardMaterial_01);
  bussardMaterial.push(bussardMaterial_02);
  bussardMaterial.push(bussardMaterial_03);
  bussardMaterial.push(goldMaterial);
  bussardMaterial.push(chromeMaterial);
  bussardMaterial.push(wireframeMaterial);
  bussardMaterial.push(bussardMaterial_01);
  
  export const bussardInnerMaterial = [];
  const bussardInnerMaterial_01 = new THREE.MeshStandardMaterial({
    color: 0xffaa00,
    emissive: 0xffdd00,
    emissiveIntensity: 2,
    transparent: false,
    flatShading: false,
    emissiveMap: texBussard.clone(),
    metalnessMap: texBussard,
    // roughnessMap: texBussard,
    metalness: 0,
    roughness: 0,
    alphaMap: texBussard,
    alphaTest: 0.01,
  });
  const bussardInnerMaterial_02 = new THREE.MeshStandardMaterial({
    color: 0x000000,
    emissive: 0x99ffff,
    emissiveIntensity: 8,
    transparent: false,
    flatShading: false,
    emissiveMap: texBussard.clone(),
    metalnessMap: texBussard,
    alphaMap: texBussard,
    alphaTest: 0.01,
    metalness: 0.6,
    roughness: 1.0,
  });
  const bussardInnerMaterial_03 = new THREE.MeshStandardMaterial({
    color: 0x000000,
    emissive: 0x99ffff,
    emissiveIntensity: 4,
    transparent: false,
    flatShading: false,
    emissiveMap: texBussard.clone(),
    metalnessMap: texBussard,
    alphaMap: texBussard,
    alphaTest: 0.01,
    metalness: 0.6,
    roughness: 1.0,
  });

  bussardInnerMaterial.push(bussardInnerMaterial_01);
  bussardInnerMaterial.push(bussardInnerMaterial_02);
  bussardInnerMaterial.push(bussardInnerMaterial_03);
  bussardInnerMaterial.push(goldMaterial);
  bussardInnerMaterial.push(chromeMaterial);
  bussardInnerMaterial.push(wireframeMaterial);
  bussardInnerMaterial.push(bussardInnerMaterial_01);

