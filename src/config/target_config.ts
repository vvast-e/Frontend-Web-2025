/**
 * Конфигурация для Tauri
 * 
 * Для настройки Tauri:
 * 1. Узнайте IP адрес вашего компьютера командой: ipconfig (в командной строке)
 * 2. Найдите IPv4-адрес (например, 192.168.1.74)
 * 3. Обновите api_proxy_addr и img_proxy_addr с вашим IP адресом
 * 4. Убедитесь, что бэкенд запущен на 0.0.0.0:8000 (не localhost!)
 * 5. Убедитесь, что MinIO запущен и доступен по порту 9002
 */

// Переключение между режимами
export const target_tauri = true

export const use_mock_fallback = !target_tauri

export const api_proxy_addr = "http://172.16.239.76:8000/api"  // /api для API endpoints
export const img_proxy_addr = "http://172.16.239.76:9002" // MinIO на порту 9002!


export const dest_api = api_proxy_addr
export const dest_img = img_proxy_addr

export const dest_root = ''

export const getDefaultImagePath = () => '/default-comet.png'


export const getImageUrl = (imageUrl: string | null): string => {
    if (!imageUrl) {
        return getDefaultImagePath()
    }

    // Если это уже полный URL (http://...), возвращаем как есть
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        return imageUrl
    }

    // Если это относительный путь, начинающийся с /img-proxy, заменяем на dest_img для Tauri
    if (imageUrl.startsWith('/img-proxy')) {
        return imageUrl.replace('/img-proxy', img_proxy_addr)
    }

    // Для других относительных путей возвращаем как есть
    return imageUrl
}

