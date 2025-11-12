import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Конфигурация для GitHub Pages
const REPO_NAME = 'Frontend-Web-2025'
// Для GitHub Pages используем base = /RepoName, для локальной разработки = /
// При сборке (npm run build) автоматически будет использоваться base для GitHub Pages
const isProduction = process.env.NODE_ENV === 'production'
const BASE_PATH = isProduction ? `/${REPO_NAME}` : '/'
const START_URL = isProduction ? `/${REPO_NAME}/` : '/'
const ICON_PATH = isProduction ? `/${REPO_NAME}/icon-192.png` : '/icon-192.png'

// https://vitejs.dev/config/
export default defineConfig({
    base: BASE_PATH,
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
                start_url: START_URL,
                display: 'standalone',
                background_color: '#ffffff',
                theme_color: '#f64137',
                orientation: 'portrait-primary',
                icons: [
                    {
                        src: isProduction ? `/${REPO_NAME}/icon-192.png` : '/icon-192.png',
                        type: 'image/png',
                        sizes: '192x192',
                    },
                    {
                        src: isProduction ? `/${REPO_NAME}/icon-512.png` : '/icon-512.png',
                        type: 'image/png',
                        sizes: '512x512',
                    },
                ],
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
            },
            injectManifest: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
            },
        }),
        // Плагин для замены пути к apple-touch-icon в HTML
        {
            name: 'html-transform',
            transformIndexHtml(html) {
                return html.replace(
                    /href="\/icon-192\.png"/g,
                    `href="${ICON_PATH}"`
                )
            },
        },
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

