import path from "path"


import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'


export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')

  return {
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
      proxy: {
        '/api': {
          target: 'https://nowcast.intellimark.ai',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '/api'),
          router: function (req) {
            const referer = req.headers.referer || '';
            // If request comes from the external dashboard iframe (which is on /tp-optimisation)
            if (referer.includes('tp-optimisation')) {
              return 'http://52.172.42.245:5005';
            }
            return 'https://nowcast.intellimark.ai';
          }
        },
        '/explorer': {
          target: 'https://nowcast.intellimark.ai',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/explorer/, '')
        },
        '/data-api': {
          target: 'https://nowcast.intellimark.ai',
          changeOrigin: true,
          secure: false
        },
        '/alfred': {
          target: 'http://13.71.126.202:8085',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/alfred/, '')
        },
        '/neptune': {
          target: 'http://13.71.126.202:8082',
          changeOrigin: true,
          secure: false
        },
        '/tp-optimisation': {
          target: 'http://52.172.42.245:5005',
          changeOrigin: true,
          secure: false,
          ws: true,
          configure: (proxy, options) => {
            proxy.on('proxyRes', (proxyRes, req, res) => {
              delete proxyRes.headers['x-frame-options'];
              delete proxyRes.headers['X-Frame-Options'];
            });
          }
        },
        '/static': {
          target: 'http://52.172.42.245:5005',
          changeOrigin: true,
          secure: false
        },
        '/manifest.json': {
          target: 'http://52.172.42.245:5005',
          changeOrigin: true,
          secure: false
        },
        '/favicon.ico': {
          target: 'http://52.172.42.245:5005',
          changeOrigin: true,
          secure: false
        },
        '/logo192.png': {
          target: 'http://52.172.42.245:5005',
          changeOrigin: true,
          secure: false
        }
      }
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
  }
})
