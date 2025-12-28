
export const target_tauri = true

export const use_mock_fallback = !target_tauri

// ZeroTier IP адрес (обновить после настройки ZeroTier сети)
// По умолчанию используется localhost, если ZeroTier не настроен
export const zerotier_ip = import.meta.env.VITE_ZEROTIER_IP || 'localhost'
export const frontend_port = import.meta.env.VITE_FRONTEND_PORT || '3000'

// Для dev режима используем прокси через Vite (относительные пути)
// Для production используем прямые адреса
const isDev = import.meta.env.DEV

export const api_proxy_addr = "http://172.20.10.4:8000/api"
export const img_proxy_addr = "http://172.20.10.4:9002" 

// В dev режиме используем прокси через Vite, в production - прямые адреса
export const dest_api = isDev ? "/api" : api_proxy_addr
export const dest_img = isDev ? "/img-proxy" : img_proxy_addr

export const dest_root = ''

export const getDefaultImagePath = () => '/default-comet.png'

/**
 * Формирует URL страницы услуги для QR кода с использованием ZeroTier IP
 * @param cometId - ID услуги (кометы)
 * @returns Полный URL страницы услуги
 */
export const getCometPageUrl = (cometId: number | string): string => {
    return `http://${zerotier_ip}:${frontend_port}/comets/${cometId}`
}

export const getImageUrl = (imageUrl: string | null): string => {
    if (!imageUrl) {
        return getDefaultImagePath()
    }

    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        return imageUrl
    }

    if (imageUrl.startsWith('/img-proxy')) {
        return imageUrl.replace('/img-proxy', img_proxy_addr)
    }

    return imageUrl
}

