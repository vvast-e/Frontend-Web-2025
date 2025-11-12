
export const target_tauri = true

export const use_mock_fallback = !target_tauri

export const api_proxy_addr = "http://172.20.10.4:8000/api"
export const img_proxy_addr = "http://172.20.10.4:9002" 


export const dest_api = api_proxy_addr
export const dest_img = img_proxy_addr

export const dest_root = ''

export const getDefaultImagePath = () => '/default-comet.png'


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

