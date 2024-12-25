import { defineConfig } from 'vite'
// @ts-ignore
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "lib": fileURLToPath(new URL("./lib", import.meta.url)),
      "types": fileURLToPath(new URL("./lib/types", import.meta.url)),
    },
  },
  build: {
    sourcemap: false,
    lib: {
      entry: './index.ts',
      name: 'MapboxglPlugin',
      fileName: 'MapboxglPlugin',
    },
    rollupOptions: {
      external: [
        'mapbox-gl',
        'Mapbox'
      ],
      output: {
        globals: {
          'mapbox-gl': 'mapbox-gl',
          'Mapbox': 'Mapbox',
        }
      }
    }
  },
})
