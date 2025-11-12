import { Comet } from '../types'
import { COMETS_MOCK } from './mock'
import { dest_api, use_mock_fallback } from '../config/target_config'

const API_BASE_URL = `${dest_api}/comets`

export const getComets = async (search?: string): Promise<Comet[]> => {
    try {
        const url = search
            ? `${API_BASE_URL}/?name=${encodeURIComponent(search)}`
            : `${API_BASE_URL}/`

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        let comets: Comet[] = []
        
        if (Array.isArray(data.results)) {
            comets = data.results
        } else if (Array.isArray(data)) {
            comets = data
        } else {
            throw new Error(`Unexpected data format: ${JSON.stringify(data)}`)
        }

        return comets
    } catch (error) {
        if (!use_mock_fallback) {
            throw error
        }
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
        const response = await fetch(`${API_BASE_URL}/${id}/`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        return data
    } catch (error) {
        if (!use_mock_fallback) {
            throw error
        }
        const mockComet = COMETS_MOCK.find(comet => comet.id === id)
        return mockComet || null
    }
}

