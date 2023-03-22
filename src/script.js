import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { addLights } from './lights';
import { particlesGeometry } from './particles';
import { createTextGeometry } from 'three-bmfont-text-es';
import fragmentShader from '../shaders/font/fragment.glsl';
import vertexShader from '../shaders/font/vertex.glsl';
import fragmentParticlesShader from '../shaders/particles//fragment.glsl';
import vertexParticlesShader from '../shaders/particles/vertex.glsl';

import robotoFont from '../public/font/Roboto-Medium-msdf.json';
const robotoFontImg = './font/Roboto-Medium.png';

import manifoldFont from '../public/font/manifold.json';
const manifoldFontImg = './font/manifold.png';

import kalamFont from '../public/font/Kalam-Regular-msdf.json';
const kalamFontImg = './font/Kalam-Regular.png';

import crimsonFont from '../public/font/CrimsonText-Regular-msdf.json';
const crimsonFontImg = './font/CrimsonText-Regular.png';

const currentFont = crimsonFont;
const currentFontImg = crimsonFontImg;

// const currentFont = robotoFont;
// const currentFontImg = robotoFontImg;

// const currentFont = kalamFont;
// const currentFontImg = kalamFontImg;

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

let textMaterial;
let textGeometry;
let textTexture;

new THREE.TextureLoader().load(currentFontImg, (texture) => {
  textTexture = texture;

  textGeometry = createTextGeometry({
    text: 'Three.js',
    font: currentFont,
    align: 'center',
    flipY: texture.flipY,
  });

  textMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: {
        value: 0,
      },
      uMouse: { value: new THREE.Vector2(0, 0) },
      viewport: {
        value: new THREE.Vector2(sizes.width, sizes.height),
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
  text.scale.multiplyScalar(0.02);
  text.rotation.z = Math.PI;
  text.position.x = 1.3;
  text.position.y = -0.4;
  scene.add(text);
});

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

addLights(scene);

// particles
const particlesMaterial = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: false,
  vertexShader: vertexParticlesShader,
  fragmentShader: fragmentParticlesShader,
  uniforms: {
    time: { value: 0 },
    uMouse: { value: new THREE.Vector2() },
    viewport: {
      value: new THREE.Vector2(sizes.width, sizes.height),
    },
  },
});
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

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
  particlesMaterial.uniforms.uMouse.value = new THREE.Vector2(
    mouseCoordinates.x,
    mouseCoordinates.y
  );
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
  particlesMaterial.uniforms.viewport.value = new THREE.Vector2(
    sizes.width,
    sizes.height
  );

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
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
camera.position.z = -2;
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
  particlesMaterial.uniforms.time.value = elapsedTime;
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
