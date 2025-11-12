/**
 * Конфигурация для переключения между веб, Tauri и GitHub Pages режимами
 * 
 * Режимы:
 * - target_tauri = true: для сборки Tauri приложения
 * - target_github_pages = true: для развертывания на GitHub Pages
 * - Оба false: для локальной разработки
 * 
 * Для настройки Tauri:
 * 1. Узнайте IP адрес вашего компьютера командой: ipconfig (в командной строке)
 * 2. Найдите IPv4-адрес (например, 172.16.239.76)
 * 3. Обновите api_proxy_addr и img_proxy_addr с вашим IP адресом
 * 4. Убедитесь, что бэкенд запущен на 0.0.0.0:8000 (не localhost!)
 * 5. Убедитесь, что MinIO запущен и доступен по порту 9002
 * 6. Установите target_tauri = true для сборки Tauri приложения
 */

// Переключение между режимами
export const target_tauri = false

// Название репозитория для GitHub Pages
const REPO_NAME = "Frontend-Web-2025"

// IP адрес компьютера в локальной сети
// ЗАМЕНИТЕ НА ВАШ IP АДРЕС когда будете настраивать Tauri
// Найти IP можно командой: ipconfig (в командной строке)
// Текущий IP: 192.168.1.74 (обновляйте при смене сети)
// Альтернативный IP: 192.168.56.1 (если первый не работает)
export const api_proxy_addr = "http://192.168.1.74:8000"
export const img_proxy_addr = "http://192.168.1.74:9002" // MinIO на порту 9002!

// Для веб-режима используем прокси, для Tauri - прямые IP адреса
export const dest_api = target_tauri ? api_proxy_addr : "/api"
export const dest_img = target_tauri ? img_proxy_addr : "/img-proxy"

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

// Функция для преобразования URL изображения для Tauri
// Если image_url начинается с /img-proxy, заменяем на dest_img
export const getImageUrl = (imageUrl: string | null): string => {
    if (!imageUrl) {
        return getDefaultImagePath()
    }

    // Если это уже полный URL (http://...), возвращаем как есть
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        return imageUrl
    }

    // Если это относительный путь, начинающийся с /img-proxy, заменяем на dest_img для Tauri
    if (target_tauri && imageUrl.startsWith('/img-proxy')) {
        return imageUrl.replace('/img-proxy', img_proxy_addr)
    }

    // Для веб-режима возвращаем как есть (прокси обработает)
    return imageUrl
}

