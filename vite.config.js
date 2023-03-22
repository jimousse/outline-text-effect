import glsl from 'vite-plugin-glsl';

export default {
  plugins: [glsl()],
  publicDir: '../public/',
  root: 'src/',
  base: './',
  server: {
    host: true,
    open: true,
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    sourcemap: true,
  },
  optimizeDeps: {
    include: ['three-bmfont-text-es'],
  },
};
