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

// IP адрес компьютера в локальной сети
// ЗАМЕНИТЕ НА ВАШ IP АДРЕС когда будете настраивать Tauri
// Найти IP можно командой: ipconfig (в командной строке)
// Текущий IP: 192.168.1.74 (обновляйте при смене сети)
// Альтернативный IP: 192.168.56.1 (если первый не работает)
export const api_proxy_addr = "http://192.168.1.74:8000"
export const img_proxy_addr = "http://192.168.1.74:9002" // MinIO на порту 9002!

// Для Tauri используем прямые IP адреса
export const dest_api = api_proxy_addr
export const dest_img = img_proxy_addr

// Basename для роутинга - пустая строка для Tauri
export const dest_root = ''

// Функция для получения пути к изображению по умолчанию
export const getDefaultImagePath = () => '/default-comet.png'

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
    if (imageUrl.startsWith('/img-proxy')) {
        return imageUrl.replace('/img-proxy', img_proxy_addr)
    }
    
    // Для других относительных путей возвращаем как есть
    return imageUrl
}

