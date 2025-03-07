import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import dts from "vite-plugin-dts";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default defineConfig({
    define: {
        global: 'window',
    },
    plugins: [
        react(),
        dts({
            include: ["src"],
            exclude: ["**/*.test.tsx", "**/*.stories.tsx"],
            rollupTypes: true,
            insertTypesEntry: true,
        }),
        cssInjectedByJsPlugin(),
    ],
    build: {
        lib: {
            entry: path.resolve(__dirname, "src/index.ts"),
            name: "lit-login-kit",
            formats: ["es"],
            fileName: (format) => `index.mjs`,
        },
        rollupOptions: {
            external: [
                "react",
                "react-dom",
                "react/jsx-runtime",
                "react-router-dom",
                "ethers",
                /^@lit-protocol\/.*/,
                /^@ethersproject\/.*/,
                "@radix-ui/react-radio-group",
                "@simplewebauthn/browser",
                "@stytch/react",
                "@stytch/vanilla-js",
                "wagmi"
            ],
            output: {
                globals: {
                    react: "React",
                    "react-dom": "ReactDOM",
                },
                sourcemap: true,
                exports: "named",
            },
        },
        sourcemap: true,
        minify: "terser",
        target: "esnext",
        emptyOutDir: true,
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        port: 3000,
    },
});
