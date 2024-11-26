import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
    plugins: [ react() ],
    base: /shorty-url-shortener/,
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    build: {
        outDir: path.join(__dirname, "dist"),
        emptyOutDir: true
    },
    server: {
        host: true,
        port: 80
    }
})