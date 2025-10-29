export interface Comet {
    id: number
    name: string
    description: string
    price: number
    image_key: string | null
    image_url: string | null
    k_x: string
    k_y: string
    k_z: string
}

export interface ApiResponse<T> {
    count?: number
    next?: string | null
    previous?: string | null
    results?: T[]
}

