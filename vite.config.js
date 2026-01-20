import path from "path"


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext",
    },
    include: [
      "@finos/perspective",
      "@finos/perspective-viewer",
      "@finos/perspective-viewer-datagrid",
      "@finos/perspective-viewer-d3fc",
      "react-chartjs-2",
      "chart.js",
      "primereact/tabview",
      "primereact/chart"
    ],
    exclude: ['plotly.js-dist']
  },
  define: {
    global: 'window',
  },
  build: {
    target: "esnext"
  }
})
