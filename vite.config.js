import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dsv from '@rollup/plugin-dsv';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dsv({
      processRow: (row, id) => {
        Object.keys(row).forEach((key) => {
          var value = row[key];
          row[key] = isNaN(+value) ? value : +value;
        });
      },
    }),
  ],
  // Set base to repo name for Vite deploy to GitHub Pages - https://vitejs.dev/guide/static-deploy.html#github-pages
  base: '/dvs-soti-2022/',
  // root: 'src',
  // build: {
  //   outDir: 'docs',
  //   // emptyOutDir: true,
  // },
});
