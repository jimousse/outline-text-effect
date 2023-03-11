import * as THREE from 'three';

export const addLights = (scene) => {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.castShadow = true;
  directionalLight.position.set(20, 20, -10);
  scene.add(directionalLight);
};
