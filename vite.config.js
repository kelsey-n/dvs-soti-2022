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
  base: '/dvs-soti-2022/',
  // root: 'src',
  // build: {
  //   outDir: 'docs',
  //   // emptyOutDir: true,
  // },
});
