import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { dest_api } from '../config/target_config'

const apiClient: AxiosInstance = axios.create({
    baseURL: dest_api,
    headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
    },
    withCredentials: true, 
})

// Backend использует cookie-based аутентификацию
// Axios автоматически отправляет cookies с запросами
// Не нужно добавлять Authorization header

// Interceptor для обработки ошибок авторизации
apiClient.interceptors.request.use(
    (config) => {
        if (config.headers['X-Skip-Auth']) {
            config.withCredentials = false
        }
        return config
    },
    (error) => Promise.reject(error)
)

apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response
    },
    (error) => {
        if (error.response?.status === 401) {
            // Сессия истекла или недействительна
            localStorage.removeItem('isAuthenticated')
            // Можно добавить редирект на страницу логина
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default apiClient
