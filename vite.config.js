import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      img: resolve('resources/img'),
      fonts: resolve('resources/css/fonts'),
    }
  },
  server: {
    host: 'arenenberg.ch.test',
    hmr: {
      host: 'arenenberg.ch.test'
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization'
    }
  },
  plugins: [
    laravel({
      input: [
        'resources/css/app.css',
        'resources/js/main.js',
        'resources/js/db.js',
        'resources/js/sw.js',
      ],
      refresh: ['resources/views/**/*.blade.php'],
      buildDirectory: 'assets', // This removes the 'build' directory
      manifestFilename: '../manifest.json', // Move manifest up one directory
    }),
  ],
  build: {
    outDir: 'public/assets', // Sets the base output directory to public
    rollupOptions: {
        output: {
            assetFileNames: (assetInfo) => {
                let extType = assetInfo.name.split('.').at(1);
                if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
                    extType = 'images';
                }
                return `${extType}/[name][extname]`;
            },
            chunkFileNames: 'js/[name].js',
            entryFileNames: 'js/[name].js',
        },
    },
},
});