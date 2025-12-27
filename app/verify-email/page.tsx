'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'no-token'>('loading');
  const [message, setMessage] = useState('');
  const [resendEmail, setResendEmail] = useState('');
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('no-token');
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await response.json();

        if (data.success) {
          setStatus('success');
          setMessage(data.message);
          // Redirect to login after 3 seconds
          setTimeout(() => {
            router.push('/login?verified=true');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(data.error || 'Xác nhận email thất bại');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Không thể kết nối đến máy chủ');
      }
    };

    verifyEmail();
  }, [token, router]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail) return;

    setResending(true);
    setResendMessage('');

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resendEmail })
      });

      const data = await response.json();
      setResendMessage(data.message || (data.success ? 'Đã gửi email xác nhận!' : 'Gửi email thất bại'));
    } catch (error) {
      setResendMessage('Không thể kết nối đến máy chủ');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          {/* Loading */}
          {status === 'loading' && (
            <>
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader2 size={40} className="text-blue-500 animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Đang xác nhận email...</h1>
              <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
            </>
          )}

          {/* Success */}
          {status === 'success' && (
            <>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-green-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Xác nhận thành công!</h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <p className="text-sm text-gray-500 mb-4">Đang chuyển hướng đến trang đăng nhập...</p>
              <Link
                href="/login"
                className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
              >
                Đăng nhập ngay
              </Link>
            </>
          )}

          {/* Error */}
          {status === 'error' && (
            <>
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle size={40} className="text-red-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Xác nhận thất bại</h1>
              <p className="text-gray-600 mb-6">{message}</p>

              <div className="border-t pt-6 mt-6">
                <p className="text-sm text-gray-600 mb-4">Gửi lại email xác nhận:</p>
                <form onSubmit={handleResend} className="space-y-3">
                  <input
                    type="email"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    placeholder="Nhập email của bạn"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                  <button
                    type="submit"
                    disabled={resending}
                    className="w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
                  >
                    {resending ? 'Đang gửi...' : 'Gửi lại email xác nhận'}
                  </button>
                </form>
                {resendMessage && (
                  <p className="mt-3 text-sm text-green-600">{resendMessage}</p>
                )}
              </div>
            </>
          )}

          {/* No Token */}
          {status === 'no-token' && (
            <>
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail size={40} className="text-yellow-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Xác nhận Email</h1>
              <p className="text-gray-600 mb-6">
                Vui lòng kiểm tra hộp thư email để lấy link xác nhận tài khoản.
              </p>

              <div className="border-t pt-6 mt-6">
                <p className="text-sm text-gray-600 mb-4">Chưa nhận được email? Gửi lại:</p>
                <form onSubmit={handleResend} className="space-y-3">
                  <input
                    type="email"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    placeholder="Nhập email của bạn"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                  <button
                    type="submit"
                    disabled={resending}
                    className="w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
                  >
                    {resending ? 'Đang gửi...' : 'Gửi email xác nhận'}
                  </button>
                </form>
                {resendMessage && (
                  <p className="mt-3 text-sm text-green-600">{resendMessage}</p>
                )}
              </div>

              <div className="mt-6">
                <Link href="/login" className="text-primary hover:text-primary-dark font-medium">
                  Quay lại đăng nhập
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
