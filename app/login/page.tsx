'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const { login } = useAuth();
  const router = useRouter();

  // Validation
  const emailError = touched.email && !email ? 'Vui lòng nhập email' :
    touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'Email không hợp lệ' : '';
  const passwordError = touched.password && !password ? 'Vui lòng nhập mật khẩu' :
    touched.password && password.length < 8 ? 'Mật khẩu phải có ít nhất 8 ký tự' : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    if (emailError || passwordError || !email || !password) {
      return;
    }

    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        router.push(result.isAdmin ? '/admin' : '/');
      } else {
        setError(result.error || 'Email hoặc mật khẩu không đúng');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi đăng nhập');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-dark-bg min-h-screen transition-colors">
      <div className="container-custom py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="hidden lg:block">
            <Sidebar />
          </div>

          {/* Login Form */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-md bg-white dark:bg-dark-card rounded-lg shadow-lg dark:shadow-2xl p-8 transition-colors">
              {/* Header */}
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  ĐĂNG NHẬP TÀI KHOẢN
                </h1>
                <p className="text-gray-600 dark:text-dark-muted text-sm">
                  Nhập email và mật khẩu của bạn:
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div
                  className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-sm flex items-center gap-2"
                  role="alert"
                  aria-live="polite"
                >
                  <AlertCircle size={18} aria-hidden="true" />
                  <span>{error}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="form-label">
                    Email <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-dark-muted">
                      <Mail size={18} aria-hidden="true" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
                      required
                      aria-required="true"
                      aria-invalid={!!emailError}
                      aria-describedby={emailError ? 'email-error' : undefined}
                      className={`input-field pl-10 ${emailError ? 'border-red-500 dark:border-red-500 focus:ring-red-500' : ''}`}
                      autoComplete="email"
                    />
                  </div>
                  {emailError && (
                    <p id="email-error" className="form-error flex items-center gap-1" role="alert">
                      <AlertCircle size={14} aria-hidden="true" />
                      {emailError}
                    </p>
                  )}
                </div>

                {/* Password Input */}
                <div>
                  <label htmlFor="password" className="form-label">
                    Mật khẩu <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-dark-muted">
                      <Lock size={18} aria-hidden="true" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Nhập mật khẩu"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
                      required
                      aria-required="true"
                      aria-invalid={!!passwordError}
                      aria-describedby={passwordError ? 'password-error' : undefined}
                      className={`input-field pl-10 pr-10 ${passwordError ? 'border-red-500 dark:border-red-500 focus:ring-red-500' : ''}`}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-dark-muted hover:text-gray-600 dark:hover:text-gray-300"
                      aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {passwordError && (
                    <p id="password-error" className="form-error flex items-center gap-1" role="alert">
                      <AlertCircle size={14} aria-hidden="true" />
                      {passwordError}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black dark:bg-white text-white dark:text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Đang đăng nhập...
                    </span>
                  ) : (
                    'Đăng nhập'
                  )}
                </button>
              </form>

              {/* Footer Links */}
              <div className="mt-6 text-center text-sm space-y-2">
                <p className="text-gray-600 dark:text-dark-muted">
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
                    className="text-gray-600 dark:text-dark-muted hover:text-accent-red transition-colors"
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
