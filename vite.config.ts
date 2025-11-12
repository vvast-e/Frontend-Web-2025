import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Конфигурация для Tauri
// base = '/' для Tauri приложения
const BASE_PATH = '/'

// https://vitejs.dev/config/
export default defineConfig({
    base: BASE_PATH,
    plugins: [
        react(),
    ],
    server: {
        port: 3000,
        strictPort: true,
        watch: {
            usePolling: true,
        },
    },
})

