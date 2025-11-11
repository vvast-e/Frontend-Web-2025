import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            devOptions: {
                enabled: true,
            },
            manifest: {
                name: 'Расчёт расстояния комет от Солнца',
                short_name: 'Кометы',
                start_url: '/', // Будет изменено при настройке GitHub Pages
                display: 'standalone',
                background_color: '#ffffff',
                theme_color: '#f64137',
                orientation: 'portrait-primary',
                icons: [
                    {
                        src: '/default-comet.png',
                        type: 'image/png',
                        sizes: '192x192',
                    },
                    {
                        src: '/default-comet.png',
                        type: 'image/png',
                        sizes: '512x512',
                    },
                ],
            },
        }),
    ],
    server: {
        port: 3000,
        proxy: {
            '/api': {
                target: 'http://localhost:8000',
                changeOrigin: true,
            },
            '/img-proxy': {
                target: 'http://localhost:9002',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/img-proxy/, ''),
            },
        },
        watch: {
            usePolling: true,
        },
        host: true,
        strictPort: true,
    },
})

