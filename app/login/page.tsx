'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        router.push('/');
      } else {
        setError('Email hoặc mật khẩu không đúng');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi đăng nhập');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth
    alert('Tính năng đăng nhập Google đang được phát triển');
  };

  const handleFacebookLogin = () => {
    // TODO: Implement Facebook OAuth
    alert('Tính năng đăng nhập Facebook đang được phát triển');
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container-custom py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="hidden lg:block">
            <Sidebar />
          </div>

          {/* Login Form */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
              {/* Header */}
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  ĐĂNG NHẬP TÀI KHOẢN
                </h1>
                <p className="text-gray-600 text-sm">
                  Nhập email và mật khẩu của bạn:
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Input */}
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

                {/* Password Input */}
                <div>
                  <input
                    type="password"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="input-field"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>
              </form>

              {/* Social Login Buttons */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  onClick={handleGoogleLogin}
                  className="flex items-center justify-center gap-2 bg-[#DB4437] text-white py-3 rounded-lg font-semibold hover:bg-[#C33527] transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="text-sm">Đăng nhập Google</span>
                </button>

                <button
                  onClick={handleFacebookLogin}
                  className="flex items-center justify-center gap-2 bg-[#4267B2] text-white py-3 rounded-lg font-semibold hover:bg-[#365899] transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span className="text-sm">Đăng nhập Facebook</span>
                </button>
              </div>

              {/* Footer Links */}
              <div className="mt-6 text-center text-sm space-y-2">
                <p className="text-gray-600">
                  Khách hàng mới?{' '}
                  <Link
                    href="/register"
                    className="text-accent-red font-semibold hover:underline"
                  >
                    Tạo tài khoản
                  </Link>
                </p>
                <p>
                  <Link
                    href="/forgot-password"
                    className="text-gray-600 hover:text-accent-red transition-colors"
                  >
                    Quên mật khẩu? <span className="font-semibold">Khôi phục mật khẩu</span>
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
