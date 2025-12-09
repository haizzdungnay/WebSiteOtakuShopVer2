/**
 * Fallback Provider
 * 
 * Hardcoded data for major cities
 * Used when external API fails
 * Only includes: HCM, Hanoi, Da Nang + their main districts
 */

import { Location, LocationProvider } from '../location-types'

export class FallbackProvider implements LocationProvider {
    name = 'Fallback VietNam Provinces' // Hardcoded data

    private readonly cities: Location[] = [
        { id: '79', code: 79, name: 'Hồ Chí Minh', nameEn: 'Ho Chi Minh' },
        { id: '01', code: 1, name: 'Hà Nội', nameEn: 'Ha Noi' },
        { id: '48', code: 48, name: 'Đà Nẵng', nameEn: 'Da Nang' },
        { id: '92', code: 92, name: 'Cần Thơ', nameEn: 'Can Tho' },
        { id: '31', code: 31, name: 'Hải Phòng', nameEn: 'Hai Phong' }
    ]

    private readonly districts: { [cityId: string]: Location[] } = {
        // Hồ Chí Minh
        '79': [
            { id: '760', code: 760, name: 'Quận 1', nameEn: 'District 1' },
            { id: '769', code: 769, name: 'Quận 3', nameEn: 'District 3' },
            { id: '770', code: 770, name: 'Quận 7', nameEn: 'District 7' },
            { id: '771', code: 771, name: 'Quận 10', nameEn: 'District 10' },
            { id: '774', code: 774, name: 'Quận 9', nameEn: 'District 9' },
            { id: '778', code: 778, name: 'Quận Thủ Đức', nameEn: 'Thu Duc District' },
            { id: '783', code: 783, name: 'Quận Bình Thạnh', nameEn: 'Binh Thanh District' },
            { id: '784', code: 784, name: 'Quận Tân Bình', nameEn: 'Tan Binh District' },
            { id: '785', code: 785, name: 'Quận Tân Phú', nameEn: 'Tan Phu District' },
            { id: '786', code: 786, name: 'Quận Phú Nhuận', nameEn: 'Phu Nhuan District' }
        ],
        // Hà Nội
        '01': [
            { id: '001', code: 1, name: 'Quận Ba Đình', nameEn: 'Ba Dinh District' },
            { id: '002', code: 2, name: 'Quận Hoàn Kiếm', nameEn: 'Hoan Kiem District' },
            { id: '003', code: 3, name: 'Quận Hai Bà Trưng', nameEn: 'Hai Ba Trung District' },
            { id: '004', code: 4, name: 'Quận Đống Đa', nameEn: 'Dong Da District' },
            { id: '005', code: 5, name: 'Quận Cầu Giấy', nameEn: 'Cau Giay District' },
            { id: '006', code: 6, name: 'Quận Thanh Xuân', nameEn: 'Thanh Xuan District' }
        ],
        // Đà Nẵng
        '48': [
            { id: '490', code: 490, name: 'Quận Hải Châu', nameEn: 'Hai Chau District' },
            { id: '491', code: 491, name: 'Quận Thanh Khê', nameEn: 'Thanh Khe District' },
            { id: '492', code: 492, name: 'Quận Sơn Trà', nameEn: 'Son Tra District' },
            { id: '493', code: 493, name: 'Quận Ngũ Hành Sơn', nameEn: 'Ngu Hanh Son District' }
        ]
    }

    private readonly wards: Record<string, Location[]> = {
        // Quận 7 (sample data)
        '770': [
            { id: '27259', code: 27259, name: 'Phường Tân Phong', nameEn: 'Tan Phong Ward' },
            { id: '27262', code: 27262, name: 'Phường Tân Phú', nameEn: 'Tan Phu Ward' },
            { id: '27265', code: 27265, name: 'Phường Tân Quy', nameEn: 'Tan Quy Ward' },
            { id: '27268', code: 27268, name: 'Phường Tân Thuận Đông', nameEn: 'Tan Thuan Dong Ward' },
            { id: '27271', code: 27271, name: 'Phường Tân Thuận Tây', nameEn: 'Tan Thuan Tay Ward' }
        ]
    }

    async getCities(): Promise<Location[]> {
        // Simulate async
        return Promise.resolve([...this.cities])
    }

    async getDistricts(cityId: string): Promise<Location[]> {
        const districts = this.districts[cityId] || []
        return Promise.resolve([...districts])
    }

    async getWards(districtId: string): Promise<Location[]> {
        const wards = this.wards[districtId] || []
        return Promise.resolve([...wards])
    }
}