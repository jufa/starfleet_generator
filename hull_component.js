import * as THREE from 'three';

export default class HullComponent {

  calculateUVs(geometry){
    geometry.computeVertexNormals(); // Needed for shading
    geometry.computeBoundingBox(); // Ensure bounding box exists

    const bbox = geometry.boundingBox;
    const min = bbox.min || 0;
    const max = bbox.max || 1;

    const offset = new THREE.Vector2(-min.x, -min.y);
    const range = new THREE.Vector2(max.x - min.x, max.y - min.y);

    const positions = geometry.attributes.position.array;
    const uvs = new Float32Array((positions.length / 3) * 2); // 2 UV values per vertex

    for (let i = 0, j = 0; i < positions.length; i += 3, j += 2) {
        let x = positions[i];
        let y = positions[i + 1];

        // Normalize to [0,1] using bounding box
        uvs[j] = (x + offset.x) / range.x; // U coordinate
        uvs[j + 1] = (y + offset.y) / range.y; // V coordinate
    }

    // Assign UVs to BufferGeometry
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    geometry.uvsNeedUpdate = true;
  }
}