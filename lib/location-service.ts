/**
 * Location Service
 * 
 * Centralized service for Vietnam administrative divisions
 * Supports multiple providers with fallback strategy
 * 
 * Usage:
 *   const cities = await LocationService.getCities()
 *   const districts = await LocationService.getDistricts(cityId)
 *   const wards = await LocationService.getWards(districtId)
 */

export interface Location {
    id: string
    code: number | string
    name: string
    nameEn?: string | null
}

export interface LocationProvider {
    name: string
    getCities(): Promise<Location[]>
    getDistricts(cityId: string): Promise<Location[]>
    getWards(districtId: string): Promise<Location[]>
}

import { OpenAPIProvider } from './location-providers/openapi-provider'
import { FallbackProvider } from './location-providers/fallback-provider'
import { resumeToPipeableStream } from 'react-dom/server'

class LocationServiceClass {
    private providers: LocationProvider[]
    private currentProviderIndex: number = 0

    constructor() {
        // Primary provider: External API
        // Secondary provider: Fallback data
        this.providers = [
            new OpenAPIProvider(),
            new FallbackProvider()
        ]
    }

    /**
    * Get current provider
    */
    private get currentProvider(): LocationProvider {
        return this.providers[this.currentProviderIndex]
    }
    
    /**
    * Switch to next provider (failover)
    */
    private switchToNextProvider(): boolean {
        if (this.currentProviderIndex < this.providers.length - 1) {
            this.currentProviderIndex++
            console.log(`[LocationService] Switched to provider: ${this.currentProvider.name}`)
            return true
        }
        return false
    }

    /**
    * Execute with retry logic
    */
    private async executeWithRetry<T>(
        operation: (provider: LocationProvider) => Promise<T>,
        operationName: string
    ): Promise<T> {
        let lastError: Error | null = null

        // Try all providers
        for (let i = 0; i < this.providers.length; i++) {
            try {
                const provider = this.providers[i]
                console.log(`[LocationService] ${operationName} using ${provider.name}`)

                const result = await operation(provider)

                // Success - reset to primary provider for next time
                if (i !== 0) {
                    this.currentProviderIndex = 0
                }

                return result
            } catch (error) {
                lastError = error as Error
                console.error(`[LocationService] ${operationName} failed with ${this.providers[i].name}:`, error)

                // If not last provider, try next
                if (i < this.providers.length -1) {
                    console.log('[LocationService] Trying next provider...')
                    continue
                }
            }
        }

        // All providers failed
        throw new Error(`All providers failed for ${operationName}: ${lastError?.message}`)
    }

    /**
    * Get all cities/provinces
    */
    async getCities(): Promise<Location[]> {
        return this.executeWithRetry(
            (provider) => provider.getCities(),
            'getCities'
        )
    }

    /**
    * Get districts by city
    */
   async getDistricts(cityId: string): Promise<Location[]> {
        if(!cityId) {
            throw new Error('CityId is required')
        }

        return this.executeWithRetry(
            (provider) => provider.getDistricts(cityId),
            `getDistricts(${cityId})`
        )
   }

   /**
    * Get wards by district
    */
   async getWards(districtId: string): Promise<Location[]> {
        if (!districtId) {
            throw new Error('DistrictId is required')
        }

        return this.executeWithRetry(
            (provider) => provider.getWards(districtId),
            `getWards(${districtId})`
        )
   }

   /**
    * Get full address hierarchy
    */
   async getFullHierarchy(cityId: string, districtId?: string) {
        const cities = await this.getCities()
        const city = cities.find(c => c.id === cityId)

        if (!city) {
            throw new Error(`City not found: ${cityId}`)
        }

        const districts = await this.getDistricts(cityId)

        if (districtId) {
            const district = districts.find(d => d.id === districtId)

            if (!district) {
                throw new Error(`District not found: ${districtId} in city ${cityId}`)
            }

            const wards = await this.getWards(districtId)

            return {
                city,
                district,
                wards
            }
        }

        return {
            city,
            districts
        }
   }

   /**
    * Search locations by name
    */
   async searchCities(query: string): Promise<Location[]> {
    const cities = await this.getCities()
    const lowerQuery = query.toLowerCase()

    return cities.filter(city =>
        city.name.toLowerCase().includes(lowerQuery) ||
        city.nameEn?.toLowerCase().includes(lowerQuery)
    )
   }
}    

// Export singleton instance
export const LocationService = new LocationServiceClass()