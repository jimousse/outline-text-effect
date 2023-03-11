import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';
import { addLights } from './lights';
import { createTextGeometry } from 'three-bmfont-text-es';
import gradientTexture from '../public/font/gradient.png';
import fragmentShader from '../shaders/fragment.glsl';
import vertexShader from '../shaders/vertex.glsl';

import font from '../public/font/manifold.json';

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

let textMaterial;
let textGeometry;
let textTexture;

new THREE.TextureLoader().load('./font/manifold.png', (texture) => {
  textTexture = texture;

  textGeometry = createTextGeometry({
    text: 'HELLO',
    font: font,
    align: 'center',
    flipY: texture.flipY,
  });

  textMaterial = new THREE.ShaderMaterial({
    uniforms: {
      opacity: { value: 1 },
      time: {
        value: 0,
      },
      uMouse: { value: new THREE.Vector2(0, 0) },
      viewport: {
        value: new THREE.Vector2(sizes.width, sizes.height),
      },
      gradientMap: {
        value: new THREE.TextureLoader().load(gradientTexture),
      },
      color: {
        value: new THREE.Color(0xffffff),
      },
      map: {
        value: texture,
      },
    },
    transparent: true,
    side: THREE.DoubleSide,
    vertexShader,
    fragmentShader,
  });

  const text = new THREE.Mesh(textGeometry, textMaterial);
  text.position.set(-1, 0, 0);
  text.scale.multiplyScalar(0.02);
  const textAnchor = new THREE.Object3D();
  textAnchor.add(text);
  textAnchor.rotation.z = Math.PI;
  scene.add(textAnchor);
});

// Debug
const gui = new dat.GUI();
gui.hide();
if (window.location.hash === '#debug') {
  gui.show();
}

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

addLights(scene);

const mouseCoordinates = {};

window.addEventListener('mousemove', (e) => {
  mouseCoordinates.x = e.clientX;
  mouseCoordinates.y = e.clientY;
  if (textMaterial) {
    textMaterial.uniforms.uMouse.value = new THREE.Vector2(
      mouseCoordinates.x,
      mouseCoordinates.y
    );
  }
});

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  if (textMaterial) {
    textMaterial.uniforms.viewport.value = new THREE.Vector2(
      sizes.width,
      sizes.height
    );
  }

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  console.log(window.devicePixelRatio);
  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = -4;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x333333);

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  if (textMaterial) textMaterial.uniforms.time.value = elapsedTime;
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
