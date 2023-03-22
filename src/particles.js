import * as THREE from 'three';

import vertexShader from '../shaders/particles/vertex.glsl';
import fragmentShader from '../shaders/particles/fragment.glsl';
const count = 1000;

const positions = new Float32Array(count * 3);
const scales = new Float32Array(count);
const randomness = new Float32Array(count * 3);

for (let i = 0; i < count; i++) {
  const i3 = i * 3;
  scales[i] = Math.random() * 10;
  positions[i3 + 0] = (Math.random() - 0.5) * 2;
  positions[i3 + 1] = (Math.random() - 0.5) * 0.7;
  positions[i3 + 2] = Math.random() - 0.5;
  randomness[i3 + 0] = Math.random() - 0.5 * 1;
  randomness[i3 + 1] = Math.random() - 0.5 * 1;
  randomness[i3 + 2] = Math.random() - 0.5 * 1;
}

const particlesGeometry = new THREE.BufferGeometry();

particlesGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(positions, 3)
);
particlesGeometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
particlesGeometry.setAttribute(
  'aRandomness',
  new THREE.BufferAttribute(randomness, 3)
);

export { particlesGeometry };
