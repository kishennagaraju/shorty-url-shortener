import react from "@vitejs/plugin-react"
import path from "path"
import { defineConfig } from "vite"

export default defineConfig({
    plugins: [ react() ],
    base: "/shorty-url-shortener",
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    }
})