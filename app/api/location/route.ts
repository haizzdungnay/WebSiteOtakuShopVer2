import { NextRequest, NextResponse } from 'next/server'
import { LocationService } from '@/lib/location-service'
import type { Location } from '@/lib/location-types'

/**
 * Locations API
 * 
 * Returns Vietnam administrative divisions (cities, districts, wards)
 * 
 * Endpoints:
 *   GET /api/locations?type=cities
 *   GET /api/locations?type=districts&cityId=79
 *   GET /api/locations?type=wards&districtId=770
 * 
 * Features:
 *   - Multiple provider support with automatic failover
 *   - Caching for performance
 *   - Sorted results in Vietnamese alphabetical order
 * 
 * @example
 *   // Get all cities
 *   fetch('/api/locations?type=cities')
 * 
 *   // Get districts of Ho Chi Minh City
 *   fetch('/api/locations?type=districts&cityId=79')
 * 
 *   // Get wards of District 7
 *   fetch('/api/locations?type=wards&districtId=770')
 */

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const cityId = searchParams.get('cityId')
    const districtId = searchParams.get('districtId')

    try {
        // Validate type parameter
        if (!type || !['cities', 'districts', 'wards'].includes(type)) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Tham số type không hợp lệ. Phải là: cities, districts, hoặc wards',
                    usage: {
                        cities: '/api/locations?type=cities',
                        districts: '/api/locations?type=districts&cityId=79',
                        wards: '/api/locations?type=wards&districtId=770'
                    }
                },
                { status: 400 }
            )
        }

        let data: Location[] = []

        // Handle different types
        switch (type) {
            case 'cities':
                data = await LocationService.getCities()
                break

            case 'districts':
                if (!cityId) {
                    return NextResponse.json(
                        {
                            success: false,
                            error: 'Tham số cityId là bắt buộc để lấy danh sách quận/huyện',
                            example: '/api/locations?type=districts&cityId=79'
                        },
                        { status: 400 }
                    )
                }
                data = await LocationService.getDistricts(cityId)
                break

            case 'wards':
                if (!districtId) {
                    return NextResponse.json(
                        {
                            success: false,
                            error: 'Tham số districtId là bắt buộc để lấy danh sách phường/xã',
                            example: '/api/locations?type=wards&districtId=770'
                        },
                        { status: 400 }
                    )
                }
                data = await LocationService.getWards(districtId)
                break
        }

        return NextResponse.json({
            success: true,
            message: `Lấy ${data.length} ${type} thành công`,
            data: data,
            count: data.length
        })
    } catch (error) {
        console.error('Locations API error:', error)

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Không thể lấy dữ liệu địa điểm',
                details: 'Vui lòng thử lại sau hoặc liên hệ hỗ trợ nếu vấn đề vẫn tiếp diễn.'
            },
            { status: 500 }
        )
    }
}