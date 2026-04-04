const path = require("path");
const react = require("@vitejs/plugin-react");
const { defineConfig, transformWithEsbuild } = require("vite");

module.exports = defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, "index.html"),
        static: path.resolve(__dirname, "static/index.html"),
        "hello-user": path.resolve(__dirname, "hello-user/index.html"),
        "show-more-text": path.resolve(__dirname, "show-more-text/index.html"),
        "show-more": path.resolve(__dirname, "show-more/index.html"),
        asynchronous: path.resolve(__dirname, "asynchronous/index.html")
      }
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx"
      }
    }
  },
  plugins: [
    react(),
    {
      name: "examples-jsx-loader",
      async transform(code, id) {
        if (id.includes("/examples/") && id.endsWith(".js")) {
          return transformWithEsbuild(code, id, {
            jsx: "automatic",
            loader: "jsx"
          });
        }

        return null;
      }
    }
  ],
  resolve: {
    alias: {
      "@sivaraj-v/dom-element-to-react": path.resolve(
        __dirname,
        "../packages/dom-element-to-react/src/index.ts"
      )
    }
  }
});