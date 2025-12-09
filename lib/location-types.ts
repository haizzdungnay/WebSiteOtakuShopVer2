/**
 * Location Types
 * Shared types for location service and providers
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
