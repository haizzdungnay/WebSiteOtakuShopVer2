'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (password.length < 8) {
      setError('Mật khẩu phải có ít nhất 8 ký tự');
      return;
    }

    if (fullName.length < 2) {
      setError('Họ tên phải có ít nhất 2 ký tự');
      return;
    }

    setLoading(true);

    try {
      const result = await register(email, fullName, password, phone);
      if (result.success) {
        // Redirect to login page after successful registration
        router.push('/login?registered=true');
      } else {
        setError(result.error || 'Đăng ký không thành công. Email đã tồn tại.');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi đăng ký');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container-custom py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="hidden lg:block">
            <Sidebar />
          </div>

          {/* Register Form */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
              {/* Header */}
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  TẠO TÀI KHOẢN MỚI
                </h1>
                <p className="text-gray-600 text-sm">
                  Điền thông tin để đăng ký:
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Register Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="input-field"
                  />
                </div>

                {/* Full Name */}
                <div>
                  <input
                    type="text"
                    placeholder="Họ và tên"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    minLength={2}
                    className="input-field"
                  />
                </div>

                {/* Phone (optional) */}
                <div>
                  <input
                    type="tel"
                    placeholder="Số điện thoại (không bắt buộc)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input-field"
                  />
                </div>

                {/* Password */}
                <div>
                  <input
                    type="password"
                    placeholder="Mật khẩu (ít nhất 8 ký tự)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="input-field"
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <input
                    type="password"
                    placeholder="Xác nhận mật khẩu"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    className="input-field"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                </button>
              </form>

              {/* Footer Links */}
              <div className="mt-6 text-center text-sm">
                <p className="text-gray-600">
                  Đã có tài khoản?{' '}
                  <Link
                    href="/login"
                    className="text-accent-red font-semibold hover:underline"
                  >
                    Đăng nhập ngay
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
