import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { createHtmlPlugin } from "vite-plugin-html";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          // Default meta tags (can be overridden per route)
          title: "Barin Ecommerce V1",
          description: "Welcome Barin Ecommerce",
          keywords: "ecommerce, barin",
        },
      },
    }),
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000", // Your Express server
        changeOrigin: true,
      },
    },
  },
});
