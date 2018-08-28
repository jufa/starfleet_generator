var THREE = require('three');

export default class CurtainStacked {

  constructor (
    { 
      segmentsHigh = 1, 
      segmentsWide = 1,
      width = 5000,
      height = 2000,
      x = 0,
      y = 4000,
      z = 0,
      phase = 0.0, 
      color = new THREE.Color(),
      material = new THREE.MeshBasicMaterial(),
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
    this.color = color;
    this.material = material;
	}

  mesh() {
		this.geometry = new THREE.PlaneGeometry( this.height, this.width, this.segmentsHigh, this.segmentsWide );
    this.geometry.rotateX( Math.PI / 2.0 );
    this.mesh = new THREE.Mesh( this.geometry, this.material );
    this.geometry.translate(this.x, this.y, this.z);
		return this.mesh;
  }

	animate(tick, params) {
    this.geometry.translate(Math.sin(tick/1000.0), 0.0, 0.0);
    // uncomment to update normal helpers
    // this.vertexNormalsHelper.update();
    // this.faceNormalsHelper.update();
	}
}
