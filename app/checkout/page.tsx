'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronRight, MapPin, CreditCard, Truck, Receipt, AlertTriangle, ChevronDown, Check, BookUser } from 'lucide-react';

interface ShippingInfo {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  district: string;
  ward: string;
  city: string;
  note: string;
}

interface SavedAddress {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  city: string;
  district: string;
  ward: string | null;
  address: string;
  isDefault: boolean;
}

type PaymentMethod = 'cod' | 'bank-transfer' | 'qr' | 'store-pickup' | 'vnpay' | 'momo';
type ShippingMethod = 'standard' | 'express' | 'store-pickup';

function CheckoutContent() {
  const { items, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('standard');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [needInvoice, setNeedInvoice] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Saved addresses state
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
  const [, setLoadingAddresses] = useState(false);

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    district: '',
    ward: '',
    city: '',
    note: '',
  });

  const searchParams = useSearchParams();

  useEffect(() => {
    // Check for error parameters from VNPAY return
    const error = searchParams.get('error');
    if (error) {
      const errorMessages: { [key: string]: string } = {
        'invalid_signature': 'Chữ ký thanh toán không hợp lệ',
        'order_not_found': 'Không tìm thấy đơn hàng',
        'payment_config_error': 'Lỗi cấu hình thanh toán',
        'processing_error': 'Lỗi xử lý thanh toán',
        'transaction_failed': 'Giao dịch thất bại',
        'transaction_reversed': 'Giao dịch đã bị đảo ngược',
        'processing': 'Giao dịch đang được xử lý',
        'suspicious_transaction': 'Giao dịch đáng ngờ',
        'refund_rejected': 'Từ chối hoàn tiền',
        'wrong_credentials': 'Thông tin đăng nhập không đúng',
        'timeout': 'Quá thời gian chờ thanh toán',
        'account_locked': 'Tài khoản bị khóa',
        'wrong_otp': 'Mã OTP không đúng',
        'cancelled': 'Giao dịch đã bị hủy',
        'insufficient_funds': 'Không đủ số dư',
        'exceeded_limit': 'Vượt quá hạn mức',
        'maintenance': 'Hệ thống đang bảo trì',
        'wrong_password': 'Mật khẩu không đúng',
        'unknown_error': 'Lỗi không xác định'
      };

      setErrorMessage(errorMessages[error] || 'Có lỗi xảy ra trong quá trình thanh toán');
    }
  }, [searchParams]);

  // Fetch saved addresses when user is logged in
  useEffect(() => {
    if (user) {
      fetchSavedAddresses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchSavedAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const response = await fetch('/api/addresses', { credentials: 'include' });
      const data = await response.json();
      if (data.success && data.data.addresses) {
        setSavedAddresses(data.data.addresses);
        // Auto-select default address if exists
        const defaultAddress = data.data.addresses.find((addr: SavedAddress) => addr.isDefault);
        if (defaultAddress) {
          selectAddress(defaultAddress);
        }
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const selectAddress = (address: SavedAddress) => {
    setSelectedAddressId(address.id);
    setShippingInfo({
      ...shippingInfo,
      fullName: address.fullName,
      phone: address.phone,
      address: address.address,
      ward: address.ward || '',
      district: address.district,
      city: address.city
    });
    setShowAddressDropdown(false);
  };

  const clearSelectedAddress = () => {
    setSelectedAddressId(null);
    setShippingInfo({
      fullName: '',
      phone: '',
      email: shippingInfo.email,
      address: '',
      district: '',
      ward: '',
      city: '',
      note: shippingInfo.note
    });
  };

  const subtotal = getTotalPrice();
  const shippingFee = shippingMethod === 'express' ? 50000 : shippingMethod === 'store-pickup' ? 0 : 30000;
  const totalAmount = subtotal + shippingFee - discount;

  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      setPromoError('Vui lòng nhập mã khuyến mãi');
      return;
    }

    setPromoLoading(true);
    setPromoError(null);

    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          code: promoCode.toUpperCase(),
          subtotal: subtotal
        }),
      });

      const data = await response.json();

      if (data.success) {
        setDiscount(data.data.calculation.discountAmount);
        setPromoApplied(true);
        setPromoError(null);
      } else {
        setPromoError(data.error || 'Mã khuyến mãi không hợp lệ');
        setPromoApplied(false);
        setDiscount(0);
      }
    } catch (error) {
      console.error('Error validating promo code:', error);
      setPromoError('Không thể kiểm tra mã khuyến mãi. Vui lòng thử lại.');
    } finally {
      setPromoLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    if (!shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.address) {
      alert('Vui lòng điền đầy đủ thông tin giao hàng');
      return;
    }

    if (!shippingInfo.district || !shippingInfo.city) {
      alert('Vui lòng nhập quận/huyện và thành phố');
      return;
    }

    // Email bắt buộc cho khách vãng lai và user chưa xác minh email
    if ((!user || !user.emailVerified) && !shippingInfo.email) {
      alert('Vui lòng nhập địa chỉ email');
      return;
    }

    if (items.length === 0) {
      alert('Giỏ hàng trống');
      return;
    }

    setIsProcessing(true);

    try {
      // Map payment method to API value
      let apiPaymentMethod = 'COD';
      if (paymentMethod === 'cod') apiPaymentMethod = 'COD';
      else if (paymentMethod === 'bank-transfer') apiPaymentMethod = 'BANK_TRANSFER';
      else if (paymentMethod === 'vnpay') apiPaymentMethod = 'VNPAY';
      else if (paymentMethod === 'momo') apiPaymentMethod = 'MOMO';
      else apiPaymentMethod = 'COD';

      // Xác định email cho đơn hàng
      // - Nếu user đã verified: customerEmail = user.email, notificationEmail = email nhập (nếu khác)
      // - Nếu guest hoặc chưa verified: customerEmail = email nhập
      const customerEmail = user?.emailVerified ? user.email : (shippingInfo.email || '');
      const notificationEmail = user?.emailVerified && shippingInfo.email && shippingInfo.email !== user.email
        ? shippingInfo.email
        : null;

      // Gọi API tạo đơn hàng
      const response = await fetch('/api/orders/guest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          customerName: shippingInfo.fullName,
          customerPhone: shippingInfo.phone,
          customerEmail: customerEmail,
          notificationEmail: notificationEmail,
          shippingAddress: shippingInfo.address,
          shippingWard: shippingInfo.ward || '',
          shippingDistrict: shippingInfo.district,
          shippingCity: shippingInfo.city,
          items: items.map(item => ({
            productId: item.id,
            quantity: item.quantity
          })),
          paymentMethod: apiPaymentMethod,
          note: shippingInfo.note || ''
        }),
      });

      const data = await response.json();

      if (data.success) {
        const orderId = data.data.order?.id;
        const orderNumber = data.data.orderNumber;

        // Handle VNPAY payment
        if (paymentMethod === 'vnpay') {
          try {
            // Call VNPAY API to create payment URL
            const vnpayResponse = await fetch('/api/payment/vnpay', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                orderId: orderId,
                amount: totalAmount,
                orderInfo: `Thanh toan don hang ${orderNumber}`,
                bankCode: '' // Let user choose on VNPAY
              }),
            });

            const vnpayData = await vnpayResponse.json();

            if (vnpayData.success) {
              // Clear cart and redirect to VNPAY
              clearCart();
              window.location.href = vnpayData.paymentUrl;
              return; // Don't set isProcessing to false
            } else {
              // VNPAY failed, cancel the order
              alert('Không thể tạo thanh toán VNPAY. Vui lòng thử lại.');
              return;
            }
          } catch (error) {
            console.error('VNPAY payment error:', error);
            alert('Lỗi thanh toán VNPAY. Vui lòng thử lại.');
            return;
          }
        }

        // Handle MoMo payment
        if (paymentMethod === 'momo') {
          try {
            // Call MoMo API to create payment URL
            const momoResponse = await fetch('/api/payment/momo/create', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                orderId: orderId,
              }),
            });

            const momoData = await momoResponse.json();

            if (momoData.success && momoData.payUrl) {
              // Clear cart and redirect to MoMo
              clearCart();
              window.location.href = momoData.payUrl;
              return; // Don't set isProcessing to false
            } else {
              // MoMo failed
              alert(momoData.error || 'Không thể tạo thanh toán MoMo. Vui lòng thử lại.');
              return;
            }
          } catch (error) {
            console.error('MoMo payment error:', error);
            alert('Lỗi thanh toán MoMo. Vui lòng thử lại.');
            return;
          }
        }

        // For non-online payments (COD, bank transfer, etc.)
        clearCart();
        alert(`Đặt hàng thành công! Mã đơn hàng: ${orderNumber}`);
        router.push('/');
      } else {
        alert(data.error || 'Không thể đặt hàng. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Giỏ hàng trống</h1>
            <p className="text-gray-600 mb-6">Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
            <Link
              href="/products"
              className="inline-block bg-accent-red text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6">
          <Link href="/" className="text-gray-600 hover:text-accent-red">Trang chủ</Link>
          <ChevronRight size={16} className="text-gray-400" />
          <span className="text-gray-900 font-medium">Thanh toán</span>
        </nav>

        <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertTriangle size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-red-800 font-semibold">Lỗi thanh toán</h3>
              <p className="text-red-700 mt-1">{errorMessage}</p>
              <p className="text-red-600 text-sm mt-2">
                Vui lòng thử lại hoặc chọn phương thức thanh toán khác.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <MapPin className="text-accent-red" />
                  Thông tin giao hàng
                </h2>

                {/* Saved Address Selector - Only show for logged in users */}
                {user && savedAddresses.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <BookUser size={16} className="text-accent-red" />
                      Chọn địa chỉ đã lưu
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowAddressDropdown(!showAddressDropdown)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left flex items-center justify-between hover:border-accent-red transition-colors"
                      >
                        <span className={selectedAddressId ? 'text-gray-900' : 'text-gray-500'}>
                          {selectedAddressId
                            ? savedAddresses.find(a => a.id === selectedAddressId)?.label || 'Địa chỉ đã chọn'
                            : 'Chọn địa chỉ đã lưu...'}
                        </span>
                        <ChevronDown size={20} className={`text-gray-400 transition-transform ${showAddressDropdown ? 'rotate-180' : ''}`} />
                      </button>

                      {showAddressDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                          {savedAddresses.map((address) => (
                            <button
                              key={address.id}
                              type="button"
                              onClick={() => selectAddress(address)}
                              className={`w-full px-4 py-3 text-left hover:bg-gray-50 border-b last:border-b-0 ${selectedAddressId === address.id ? 'bg-red-50' : ''
                                }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{address.label}</span>
                                    {address.isDefault && (
                                      <span className="px-2 py-0.5 text-xs bg-red-100 text-red-600 rounded">
                                        Mặc định
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {address.fullName} - {address.phone}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {address.address}
                                    {address.ward && `, ${address.ward}`}
                                    , {address.district}, {address.city}
                                  </p>
                                </div>
                                {selectedAddressId === address.id && (
                                  <Check size={20} className="text-accent-red flex-shrink-0" />
                                )}
                              </div>
                            </button>
                          ))}

                          {/* Option to enter new address */}
                          <button
                            type="button"
                            onClick={() => {
                              clearSelectedAddress();
                              setShowAddressDropdown(false);
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 text-accent-red font-medium border-t"
                          >
                            + Nhập địa chỉ mới
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Link to manage addresses */}
                    <Link
                      href="/profile/addresses"
                      className="text-sm text-accent-red hover:underline mt-2 inline-block"
                    >
                      Quản lý địa chỉ của bạn
                    </Link>
                  </div>
                )}

                {/* Divider */}
                {user && savedAddresses.length > 0 && (
                  <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">
                        {selectedAddressId ? 'Thông tin địa chỉ đã chọn' : 'Hoặc nhập thông tin mới'}
                      </span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.fullName}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-red focus:border-transparent outline-none"
                      placeholder="Đinh Tuấn Dương"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-red focus:border-transparent outline-none"
                      placeholder="0389836514"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      Email {(!user || !user.emailVerified) && <span className="text-red-500">*</span>}
                      {user?.emailVerified && (
                        <span className="text-gray-500 font-normal ml-1">(Tùy chọn)</span>
                      )}
                    </label>
                    <input
                      type="email"
                      required={!user || !user.emailVerified}
                      value={shippingInfo.email}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-red focus:border-transparent outline-none"
                      placeholder={user?.emailVerified ? `Mặc định: ${user.email}` : "example@gmail.com"}
                    />
                    {user?.emailVerified && (
                      <p className="text-sm text-gray-500 mt-1">
                        {shippingInfo.email && shippingInfo.email !== user.email
                          ? `Thông báo sẽ được gửi đến cả ${user.email} và ${shippingInfo.email}`
                          : `Thông báo sẽ được gửi đến ${user.email}`
                        }
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      Địa chỉ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-red focus:border-transparent outline-none"
                      placeholder="Nhập địa chỉ nhà"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Quận/Huyện</label>
                    <input
                      type="text"
                      value={shippingInfo.district}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, district: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-red focus:border-transparent outline-none"
                      placeholder="Quận/Huyện"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phường/Xã</label>
                    <input
                      type="text"
                      value={shippingInfo.ward}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, ward: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-red focus:border-transparent outline-none"
                      placeholder="Phường/Xã"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Tỉnh/Thành phố</label>
                    <input
                      type="text"
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-red focus:border-transparent outline-none"
                      placeholder="Tỉnh/Thành phố"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Ghi chú</label>
                    <textarea
                      value={shippingInfo.note}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, note: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-red focus:border-transparent outline-none resize-none"
                      placeholder="Ghi chú, yêu cầu đặc biệt..."
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Method */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Truck className="text-accent-red" />
                  Phương thức giao hàng
                </h2>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-accent-red transition-colors">
                    <input
                      type="radio"
                      name="shipping"
                      value="standard"
                      checked={shippingMethod === 'standard'}
                      onChange={(e) => setShippingMethod(e.target.value as ShippingMethod)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-semibold">Giao hàng tiêu chuẩn</div>
                      <div className="text-sm text-gray-600">Thời gian giao hàng: 3-5 ngày làm việc</div>
                      <div className="text-sm font-semibold text-accent-red mt-1">30.000đ</div>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-accent-red transition-colors">
                    <input
                      type="radio"
                      name="shipping"
                      value="express"
                      checked={shippingMethod === 'express'}
                      onChange={(e) => setShippingMethod(e.target.value as ShippingMethod)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-semibold">Giao hàng nhanh</div>
                      <div className="text-sm text-gray-600">Thời gian giao hàng: 1-2 ngày làm việc</div>
                      <div className="text-sm font-semibold text-accent-red mt-1">50.000đ</div>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-accent-red transition-colors">
                    <input
                      type="radio"
                      name="shipping"
                      value="store-pickup"
                      checked={shippingMethod === 'store-pickup'}
                      onChange={(e) => setShippingMethod(e.target.value as ShippingMethod)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-semibold">Nhận tại cửa hàng</div>
                      <div className="text-sm text-gray-600">Miễn phí - Nhận hàng tại cửa hàng</div>
                      <div className="text-sm font-semibold text-green-600 mt-1">Miễn phí</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <CreditCard className="text-accent-red" />
                  Phương thức thanh toán
                </h2>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-accent-red transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-semibold">Thanh toán khi nhận hàng (COD)</div>
                      <div className="text-sm text-gray-600">
                        Thanh toán COD khi sử dụng kèm sản phẩm Gọi Hàng. Tức Phí...
                      </div>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-accent-red transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="bank-transfer"
                      checked={paymentMethod === 'bank-transfer'}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-semibold">Chuyển khoản ngân hàng</div>
                      <div className="text-sm text-gray-600">Chuyển khoản trực tiếp vào tài khoản ngân hàng</div>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-accent-red transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="qr"
                      checked={paymentMethod === 'qr'}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-semibold">Chuyển khoản qua QR - Techcombank</div>
                      <div className="text-sm text-gray-600">Quét mã QR để thanh toán nhanh chóng</div>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-accent-red transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="vnpay"
                      checked={paymentMethod === 'vnpay'}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-semibold">Thanh toán qua VNPAY</div>
                      <div className="text-sm text-gray-600">Thanh toán an toàn qua cổng VNPAY với nhiều phương thức</div>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-accent-red transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="momo"
                      checked={paymentMethod === 'momo'}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-semibold flex items-center gap-2">
                        <span className="text-pink-500">●</span> Ví MoMo
                      </div>
                      <div className="text-sm text-gray-600">Thanh toán nhanh chóng qua ví điện tử MoMo</div>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-accent-red transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="store-pickup"
                      checked={paymentMethod === 'store-pickup'}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-semibold">Tại nhà lấy cửa hàng</div>
                      <div className="text-sm text-gray-600">Thanh toán trực tiếp tại cửa hàng khi nhận hàng</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Invoice */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Receipt className="text-accent-red" />
                  Hóa đơn điện tử
                </h2>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={needInvoice}
                    onChange={(e) => setNeedInvoice(e.target.checked)}
                    className="w-5 h-5"
                  />
                  <span className="text-sm">Tôi muốn xuất hóa đơn điện tử</span>
                </label>
                {needInvoice && (
                  <div className="mt-4">
                    <input
                      type="text"
                      placeholder="Tên công ty / Cá nhân"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-red focus:border-transparent outline-none mb-3"
                    />
                    <input
                      type="text"
                      placeholder="Mã số thuế"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-red focus:border-transparent outline-none"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-4">Giỏ hàng</h2>

                {/* Cart Items */}
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={item.image || '/placeholder-product.jpg'}
                          alt={item.name}
                          fill
                          sizes="64px"
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium line-clamp-2">{item.name}</h3>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-sm text-gray-600">x{item.quantity}</span>
                          <span className="text-sm font-semibold text-accent-red">
                            {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo Code */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Mã khuyến mãi</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => {
                        setPromoCode(e.target.value.toUpperCase());
                        setPromoError(null);
                      }}
                      disabled={promoApplied || promoLoading}
                      placeholder="Nhập mã khuyến mãi"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-red focus:border-transparent outline-none disabled:bg-gray-100"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      disabled={promoApplied || !promoCode || promoLoading}
                      className="px-4 py-2 bg-accent-red text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed min-w-[90px]"
                    >
                      {promoLoading ? '...' : 'Áp dụng'}
                    </button>
                  </div>
                  {promoApplied && (
                    <p className="text-sm text-green-600 mt-2">✓ Mã giảm giá đã được áp dụng</p>
                  )}
                  {promoError && (
                    <p className="text-sm text-red-500 mt-2">{promoError}</p>
                  )}
                  {!user && !promoApplied && (
                    <p className="text-sm text-gray-500 mt-2">
                      <Link href="/login" className="text-accent-red hover:underline">Đăng nhập</Link> để sử dụng mã giảm giá
                    </p>
                  )}
                </div>

                {/* Order Summary */}
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tạm tính:</span>
                    <span className="font-semibold">{subtotal.toLocaleString('vi-VN')}đ</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phí vận chuyển:</span>
                    <span className="font-semibold">{shippingFee.toLocaleString('vi-VN')}đ</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Giảm giá:</span>
                      <span className="font-semibold text-green-600">-{discount.toLocaleString('vi-VN')}đ</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                    <span className="font-bold text-lg">Tổng cộng:</span>
                    <span className="font-bold text-xl text-accent-red">
                      {totalAmount.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full mt-6 bg-accent-red text-white py-3 rounded-lg font-bold text-lg hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Đang xử lý...' : 'Đặt hàng'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-red mx-auto mb-4"></div>
        <p className="text-gray-600">Đang tải trang thanh toán...</p>
      </div>
    </div>
  );
}

// Page component wrap với Suspense
export default function CheckoutPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CheckoutContent />
    </Suspense>
  );
}
