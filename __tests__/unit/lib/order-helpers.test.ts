import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  calculateOrderTotals,
  calculateDiscount,
  calculateShippingFee,
} from '@/lib/order-helpers'

// Note: generateOrderNumber and validateStock/validateCoupon use Prisma
// They are tested in integration tests with mocked Prisma

describe('Order Helpers Module', () => {
  describe('calculateOrderTotals', () => {
    it('should calculate correct totals for cart items', () => {
      const cartItems = [
        { quantity: 2, product: { price: 100000 } },
        { quantity: 1, product: { price: 200000 } },
      ]

      const result = calculateOrderTotals(cartItems, 30000, 0)

      expect(result.subtotal).toBe(400000) // 2*100000 + 1*200000
      expect(result.shippingFee).toBe(30000)
      expect(result.discount).toBe(0)
      expect(result.total).toBe(430000) // 400000 + 30000 - 0
    })

    it('should apply discount correctly', () => {
      const cartItems = [
        { quantity: 1, product: { price: 500000 } },
      ]

      const result = calculateOrderTotals(cartItems, 30000, 50000)

      expect(result.subtotal).toBe(500000)
      expect(result.discount).toBe(50000)
      expect(result.total).toBe(480000) // 500000 + 30000 - 50000
    })

    it('should use default shipping fee of 30000', () => {
      const cartItems = [
        { quantity: 1, product: { price: 100000 } },
      ]

      const result = calculateOrderTotals(cartItems)

      expect(result.shippingFee).toBe(30000)
    })

    it('should handle empty cart', () => {
      const result = calculateOrderTotals([], 30000, 0)

      expect(result.subtotal).toBe(0)
      expect(result.total).toBe(30000) // only shipping
    })

    it('should handle free shipping', () => {
      const cartItems = [
        { quantity: 1, product: { price: 100000 } },
      ]

      const result = calculateOrderTotals(cartItems, 0, 0)

      expect(result.shippingFee).toBe(0)
      expect(result.total).toBe(100000)
    })
  })

  describe('calculateDiscount', () => {
    describe('Percentage discount', () => {
      it('should calculate percentage discount correctly', () => {
        const coupon = {
          discountType: 'PERCENTAGE',
          discountValue: 10, // 10%
          maxDiscount: null,
        }

        const discount = calculateDiscount(1000000, coupon)

        expect(discount).toBe(100000) // 10% of 1,000,000
      })

      it('should apply max discount cap', () => {
        const coupon = {
          discountType: 'PERCENTAGE',
          discountValue: 50, // 50%
          maxDiscount: 100000, // max 100k
        }

        const discount = calculateDiscount(1000000, coupon)

        // 50% of 1,000,000 = 500,000 but max is 100,000
        expect(discount).toBe(100000)
      })

      it('should not apply cap if discount is less than max', () => {
        const coupon = {
          discountType: 'PERCENTAGE',
          discountValue: 5, // 5%
          maxDiscount: 100000,
        }

        const discount = calculateDiscount(1000000, coupon)

        // 5% of 1,000,000 = 50,000 which is less than 100,000 cap
        expect(discount).toBe(50000)
      })
    })

    describe('Fixed amount discount', () => {
      it('should apply fixed discount correctly', () => {
        const coupon = {
          discountType: 'FIXED',
          discountValue: 50000,
          maxDiscount: null,
        }

        const discount = calculateDiscount(500000, coupon)

        expect(discount).toBe(50000)
      })

      it('should not exceed subtotal for fixed discount', () => {
        const coupon = {
          discountType: 'FIXED',
          discountValue: 100000,
          maxDiscount: null,
        }

        // Subtotal is less than discount value
        const discount = calculateDiscount(50000, coupon)

        expect(discount).toBe(50000) // Should be subtotal, not discount value
      })
    })

    it('should round to 2 decimal places', () => {
      const coupon = {
        discountType: 'PERCENTAGE',
        discountValue: 33.33,
        maxDiscount: null,
      }

      const discount = calculateDiscount(100000, coupon)

      // 33.33% of 100,000 = 33,330
      expect(discount).toBe(33330)
      // Verify it's properly rounded
      expect(Number.isInteger(discount * 100)).toBe(true)
    })
  })

  describe('calculateShippingFee', () => {
    describe('HCM inner districts (FREE shipping)', () => {
      it('should return 0 for Quận 1', () => {
        expect(calculateShippingFee('Hồ Chí Minh', 'Quận 1')).toBe(0)
      })

      it('should return 0 for Quận Tân Bình', () => {
        expect(calculateShippingFee('Hồ Chí Minh', 'Quận Tân Bình')).toBe(0)
      })

      it('should return 0 for Quận Bình Thạnh', () => {
        expect(calculateShippingFee('TP. Hồ Chí Minh', 'Quận Bình Thạnh')).toBe(0)
      })

      it('should handle various HCM formats', () => {
        expect(calculateShippingFee('HCM', 'Quận 1')).toBe(0)
        expect(calculateShippingFee('tp.hồ chí minh', 'quận 3')).toBe(0)
        expect(calculateShippingFee('Thành phố Hồ Chí Minh', 'Quận 7')).toBe(0)
      })
    })

    describe('HCM outer districts', () => {
      it('should return 30000 for outer districts', () => {
        expect(calculateShippingFee('Hồ Chí Minh', 'Hóc Môn')).toBe(30000)
        expect(calculateShippingFee('Hồ Chí Minh', 'Củ Chi')).toBe(30000)
      })
    })

    describe('Southern region cities', () => {
      it('should return 30000 for Đồng Nai', () => {
        expect(calculateShippingFee('Đồng Nai', 'Biên Hòa')).toBe(30000)
      })

      it('should return 30000 for Bình Dương', () => {
        expect(calculateShippingFee('Bình Dương', 'Thủ Dầu Một')).toBe(30000)
      })

      it('should return 30000 for Cần Thơ', () => {
        expect(calculateShippingFee('Cần Thơ', 'Ninh Kiều')).toBe(30000)
      })
    })

    describe('Central region cities', () => {
      it('should return 35000 for Đà Nẵng', () => {
        expect(calculateShippingFee('Đà Nẵng', 'Hải Châu')).toBe(35000)
      })

      it('should return 35000 for Huế', () => {
        expect(calculateShippingFee('Huế', 'Phú Xuân')).toBe(35000)
      })

      it('should return 35000 for Nha Trang (Khánh Hòa)', () => {
        expect(calculateShippingFee('Khánh Hòa', 'Nha Trang')).toBe(35000)
      })
    })

    describe('Northern region cities', () => {
      it('should return 40000 for Hà Nội', () => {
        expect(calculateShippingFee('Hà Nội', 'Hoàn Kiếm')).toBe(40000)
      })

      it('should return 40000 for Hải Phòng', () => {
        expect(calculateShippingFee('Hải Phòng', 'Hồng Bàng')).toBe(40000)
      })

      it('should return 40000 for Quảng Ninh', () => {
        expect(calculateShippingFee('Quảng Ninh', 'Hạ Long')).toBe(40000)
      })
    })

    describe('Default case', () => {
      it('should return 30000 for unknown cities', () => {
        expect(calculateShippingFee('Unknown City', 'District')).toBe(30000)
      })
    })

    describe('Case insensitivity', () => {
      it('should handle uppercase input', () => {
        expect(calculateShippingFee('HÀ NỘI', 'HOÀN KIẾM')).toBe(40000)
      })

      it('should handle mixed case input', () => {
        expect(calculateShippingFee('Hồ CHÍ minh', 'quận 1')).toBe(0)
      })
    })

    describe('Whitespace handling', () => {
      it('should trim whitespace from city', () => {
        expect(calculateShippingFee('  Hà Nội  ', 'Hoàn Kiếm')).toBe(40000)
      })

      it('should trim whitespace from district', () => {
        expect(calculateShippingFee('Hồ Chí Minh', '  Quận 1  ')).toBe(0)
      })
    })
  })
})
