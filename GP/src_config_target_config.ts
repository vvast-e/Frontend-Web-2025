/**
 * Конфигурация для GitHub Pages
 */

// Название репозитория для GitHub Pages
const REPO_NAME = "Frontend-Web-2025"

// Для веб-режима используем прокси
export const dest_api = "/api"
export const dest_img = "/img-proxy"

// Basename для роутинга определяется автоматически на основе текущего URL
// На GitHub Pages будет /Frontend-Web-2025, локально - пустая строка
function getBasePath(): string {
    if (typeof window === 'undefined') return ''
    
    // Проверяем, работаем ли мы на GitHub Pages
    const isGitHubPages = window.location.hostname.includes('github.io')
    
    if (isGitHubPages) {
        // Извлекаем basename из текущего URL
        const path = window.location.pathname
        const match = path.match(/^\/([^/]+)/)
        if (match && match[1] === REPO_NAME) {
            return `/${REPO_NAME}`
        }
    }
    
    return ''
}

export const dest_root = getBasePath()

// Функция для получения пути к изображению по умолчанию с учетом базового пути
export const getDefaultImagePath = () => `${dest_root}/default-comet.png`

