import { Comet } from '../types'
import { COMETS_MOCK } from './mock'

const API_BASE_URL = '/api/comets'

export const getComets = async (search?: string): Promise<Comet[]> => {
    try {
        const url = search
            ? `${API_BASE_URL}/?search=${encodeURIComponent(search)}`
            : `${API_BASE_URL}/`

        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        // Если API возвращает пагинацию с results
        if (Array.isArray(data.results)) {
            return data.results
        }

        // Если API возвращает просто массив
        if (Array.isArray(data)) {
            return data
        }

        return []
    } catch (error) {
        console.error('Error fetching comets:', error)
        // Fallback на mock данные
        if (search) {
            return COMETS_MOCK.filter(comet =>
                comet.name.toLowerCase().includes(search.toLowerCase())
            )
        }
        return COMETS_MOCK
    }
}

export const getCometById = async (id: number): Promise<Comet | null> => {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}/`)

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error fetching comet:', error)
        // Fallback на mock данные
        const mockComet = COMETS_MOCK.find(comet => comet.id === id)
        return mockComet || null
    }
}

