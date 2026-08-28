import path from "path";
import dns from "node:dns";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// Align Node's localhost resolution with the browser (avoids HMR WS failures on Windows/Node 17+).
dns.setDefaultResultOrder("verbatim");

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const usePolling =
  process.env.VITE_DEV_POLL === "1" ||
  /OneDrive|Dropbox|Google Drive/i.test(__dirname);

/** Cursor / embedded preview browsers often block ws:// to localhost; set VITE_DISABLE_HMR=1 to silence WS errors (no hot reload). */
const disableHmr = process.env.VITE_DISABLE_HMR === "1";

/** Default 127.0.0.1 (stable HMR on Windows). Set VITE_DEV_HOST=all for 0.0.0.0 / LAN. */
const serverHost =
  process.env.VITE_DEV_HOST === "all" || process.env.VITE_DEV_HOST === "0.0.0.0"
    ? true
    : process.env.VITE_DEV_HOST || "127.0.0.1";

const hmrClientHost =
  serverHost === true || serverHost === "0.0.0.0"
    ? process.env.VITE_HMR_HOST || "127.0.0.1"
    : serverHost;

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
  },
  base: "/",
  define: {
    "import.meta.env.VITE_API_URL": JSON.stringify(
      process.env.VITE_API_URL || "https://server.rootstunisia.com"
    ),
  },
  plugins: [
    react(),
    tailwindcss({
      config: "./tailwind.config.js",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    dedupe: ["react", "react-dom"],
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
  },
  server: {
    port: 5173,
    host: serverHost,
    strictPort: true,
    hmr: disableHmr
      ? false
      : {
          protocol: "ws",
          host: hmrClientHost,
          port: 5173,
          clientPort: 5173,
        },
    ...(usePolling
      ? {
          watch: {
            usePolling: true,
            interval: 1000,
          },
        }
      : {}),
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/d3")) {
            return "d3-vendor";
          }
          if (id.includes("node_modules/jspdf") || id.includes("node_modules/pdfjs-dist")) {
            return "pdf-vendor";
          }
          if (id.includes("node_modules/leaflet") || id.includes("node_modules/react-leaflet")) {
            return "leaflet-vendor";
          }
          if (id.includes("node_modules/framer-motion") || id.includes("node_modules/gsap")) {
            return "motion-vendor";
          }
          if (id.includes("node_modules/lucide-react")) {
            return "icons-vendor";
          }
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/") ||
            id.includes("node_modules/react-router-dom/") ||
            id.includes("node_modules/@tanstack/") ||
            id.includes("node_modules/zustand")
          ) {
            return "framework-vendor";
          }
        },
      },
    },
  },
});
