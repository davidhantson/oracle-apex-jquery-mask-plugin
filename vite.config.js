import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
  plugins: [
    viteStaticCopy({     // ▼ alles wat in targets staat → dist/
      targets: [
        { src: 'node_modules/jquery-mask-plugin/dist/jquery.mask.min.js', dest: 'vendor/' } // dist/vendor/jquery.mask.min.js
      ]
    })
  ],

  esbuild: {
    sourcemap: isProd ? false : 'inline'          // forceer inline maps voor tussen-bundles
  },

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    lib: {
      entry   : 'src/apex.jquery.mask.js',
      name    : 'apexJQueryMask',
      formats : ['umd'],
      fileName: 'apex.jquery.mask'
    },
    rollupOptions: {
      external: ['apex','jquery', 'jquery-mask-plugin'],
      output: { 
        entryFileNames: 'apex.jquery.mask.js',
        assetFileNames: asset =>
          asset.name === 'style.css'                   // ← standaardnaam
            ? 'apex.jquery.mask.css'                    //   hernoemen
            : asset.name,
        name: 'apexJQueryMask'
      }
    }
  },

  resolve: {
    alias: isProd
      ? {}                                // in PROD geen alias nodig
      : {                                 // ★ DEV-mode aliases
          apex  : '/src/apex.mock.js'     // mock de APEX-namespace in demo.html
        }
  },

  server: {
    open: '/src/demo.html'     // of '/demo.html' als hij in root staat
  }
});
