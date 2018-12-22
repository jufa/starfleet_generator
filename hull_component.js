import * as THREE from 'three';

export default class HullComponent {

  calculateUVs(geometry){
    var geometry = this.geometry;
      geometry.computeBoundingBox();

      var max = geometry.boundingBox.max,
          min = geometry.boundingBox.min;
      var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
      var range = new THREE.Vector2(max.x - min.x, max.y - min.y);
      var faces = geometry.faces;
          
      this.geometry.computeVertexNormals(); // needed for material shading
      geometry.faceVertexUvs[0] = [];

      for (var i = 0; i < faces.length ; i++) {
          var v1 = geometry.vertices[faces[i].a], 
              v2 = geometry.vertices[faces[i].b], 
              v3 = geometry.vertices[faces[i].c];

          geometry.faceVertexUvs[0].push([
              new THREE.Vector2((v1.x + offset.x)/range.x ,(v1.y + offset.y)/range.y),
              new THREE.Vector2((v2.x + offset.x)/range.x ,(v2.y + offset.y)/range.y),
              new THREE.Vector2((v3.x + offset.x)/range.x ,(v3.y + offset.y)/range.y)
          ]);
      }
      geometry.uvsNeedUpdate = true;
    }
}