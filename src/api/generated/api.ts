import apiClient from '../client'
import {
    User,
    LoginRequest,
    RegisterRequest,
    LoginResponse,
    Distance,
    RequestComet,
    Comet,
    ApiResponse,
    UpdateCometRequest,
    CartInfo
} from '../types'

// Auth API
export const authApi = {
    login: async (data: LoginRequest): Promise<LoginResponse> => {
        const response = await apiClient.post('/users/login/', data)
        return response.data
    },

    register: async (data: RegisterRequest): Promise<User> => {
        const response = await apiClient.post('/users/register/', data)
        return response.data
    },

    logout: async (): Promise<void> => {
        await apiClient.post('/users/logout/')
    },

    getProfile: async (): Promise<User> => {
        const response = await apiClient.get('/users/profile/')
        return response.data
    },

    updateProfile: async (data: Partial<User>): Promise<User> => {
        const response = await apiClient.put('/users/profile/', data)
        return response.data
    }
}

// Comets API
export const cometsApi = {
    getComets: async (search?: string): Promise<Comet[]> => {
        const params = search ? { search } : {}
        const response = await apiClient.get('/comets/', {
            params,
            headers: { 'X-Skip-Auth': 'true' },
        })
        return response.data.results || response.data
    },

    getComet: async (id: number): Promise<Comet> => {
        const response = await apiClient.get(`/comets/${id}/`, {
            headers: { 'X-Skip-Auth': 'true' },
        })
        return response.data
    }
}

// Distance/Requests API
export const requestsApi = {
    getUserRequests: async (): Promise<Distance[]> => {
        const response = await apiClient.get('/distance/')
        return response.data.results || response.data
    },

    getCartInfo: async (): Promise<CartInfo> => {
        const response = await apiClient.get('/distance/cart_info/')
        return response.data
    },

    getRequest: async (id: number): Promise<Distance> => {
        const response = await apiClient.get(`/distance/${id}/`)
        return response.data
    },

    updateRequest: async (id: number, data: Partial<Distance>): Promise<Distance> => {
        const response = await apiClient.put(`/distance/${id}/`, data)
        return response.data
    },

    deleteRequest: async (id: number): Promise<void> => {
        await apiClient.delete(`/distance/${id}/`)
    },

    updateCometInRequest: async (requestId: number, cometId: number, data: UpdateCometRequest): Promise<RequestComet> => {
        const response = await apiClient.put(`/distance/${requestId}/comets/update/`, {
            comet_id: cometId,
            ...data
        })
        return response.data
    },

    removeCometFromRequest: async (requestId: number, cometId: number): Promise<void> => {
        await apiClient.delete(`/distance/${requestId}/comets/delete/`, {
            data: { comet_id: cometId }
        })
    }
}

// Операции на стороне услуг
export const cometActionsApi = {
    addCometToDraft: async (cometId: number, data?: {
        quantity?: number,
        coords_x?: number,
        coords_y?: number,
        coords_z?: number
    }): Promise<Distance> => {
        const response = await apiClient.post(`/comets/${cometId}/addToRequest/`, {
            quantity: data?.quantity ?? 1,
            coords_x: data?.coords_x ?? 0,
            coords_y: data?.coords_y ?? 0,
            coords_z: data?.coords_z ?? 0,
        })
        return response.data
    }
}
