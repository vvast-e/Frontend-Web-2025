// Типы для API ответов и запросов

export interface User {
    id: number
    email: string
    is_staff: boolean
}

export interface LoginRequest {
    email: string
    password: string
}

export interface RegisterRequest {
    email: string
    password: string
}

export interface LoginResponse {
    user: User
    token: string
}

export interface Distance {
    id: number
    status: 'draft' | 'deleted' | 'formed' | 'completed' | 'rejected'
    created_at: string
    astronomer: number
    formed_at?: string
    completed_at?: string
    moderator?: number
    astronomers_list: string[]
    telescopes_list: string[]
    total_distance_au?: number
    distance_comets: RequestComet[]
}

export interface RequestComet {
    id: number
    request: number
    comet: Comet
    quantity: number
    sort_order: number
    is_main: boolean
    coords_x: number
    coords_y: number
    coords_z: number
}

export interface Comet {
    id: number
    name: string
    description: string
    price: number
    image_key: string | null
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

export interface UpdateCometRequest {
    quantity?: number
    coords_x?: number
    coords_y?: number
    coords_z?: number
}

export interface CreateRequestData {
    // Пустой объект для создания новой заявки
}




