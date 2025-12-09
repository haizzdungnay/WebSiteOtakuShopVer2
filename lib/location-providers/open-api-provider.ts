/**
 * Open API Provider
 * 
 * Uses provinces.open-api.vn
 * Free, no authentication required
 * Data may not be up-to-date with latest Vietnam administrative changes
 */

import { Location, LocationProvider } from '../location-types'

const BASE_URL = 'https://provinces.open-api.vn/api'
const CACHE_DURATION = 86400 // 1 day in seconds

export class OpenAPIProvider implements LocationProvider {
    name = 'OpenAPI VietNam Provinces'

    private async fetchWithTimeout(url: string, timeout = 5000): Promise<Response> {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), timeout)

        try {
            const response = await fetch(url, {
                signal: controller.signal,
                next: { revalidate: CACHE_DURATION }
            })
            clearTimeout(timeoutId)
            return response
        } catch (error) {
            clearTimeout(timeoutId)
            throw error
        }
    }

    async getCities(): Promise<Location[]> {
        try {
            const response = await this.fetchWithTimeout(`${BASE_URL}/p/`)

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`)
            }

            const data = await response.json()

            return data.map((item: any) => ({
                id: item.code.toString(),
                code: item.code,
                name: item.name,
                nameEn: item.name_en || null
            })).sort((a: Location, b: Location) =>
                a.name.localeCompare(b.name, 'vi')
            )
        } catch (error) {
            console.error('[OpenAPIProvider] getCities error:', error)
                throw new Error(`Failed to fetch cities: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }

    async getDistricts(cityId: string): Promise<Location[]> {
        try {
            const response = await this.fetchWithTimeout(`${BASE_URL}/d/${cityId}?depth=2`)

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`)
            }
            
            const data = await response.json()

            if (!data.districts || !Array.isArray(data.districts)) {
                throw new Error('Invalid data format: districts not found')
            }

            return data.districts.map((item: any) => ({
                id: item.code.toString(),
                code: item.code,
                name: item.name,
                nameEn: item.name_en || null
            })).sort((a: Location, b: Location) =>
                a.name.localeCompare(b.name, 'vi')
            )
        } catch (error) {
            console.error('[OpenAPIProvider] getDistricts error:', error)
            throw new Error(`Failed to fetch districts: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }

    async getWards(districtId: string): Promise<Location[]> {
        try {
            const response = await this.fetchWithTimeout(`${BASE_URL}/w/${districtId}?depth=2`)

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`)
            }

            const data = await response.json()

            if (!data.wards || !Array.isArray(data.wards)) {
                throw new Error('Invalid data format: wards not found')
            }

                return data.wards.map((item: any) => ({
                id: item.code.toString(),
                code: item.code,
                name: item.name,
                nameEn: item.name_en || null
            })).sort((a: Location, b: Location) =>
                a.name.localeCompare(b.name, 'vi')
            )
        } catch (error) {
            console.error('[OpenAPIProvider] getWards error:', error)
            throw new Error(`Failed to fetch wards: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }
}