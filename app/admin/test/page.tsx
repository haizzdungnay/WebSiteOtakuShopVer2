'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function AdminTestPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 shadow-xl">
          <h1 className="text-3xl font-bold mb-6">Admin Test Page</h1>

          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-green-800 font-semibold">✅ You can access this page!</p>
              <p className="text-sm text-green-600 mt-2">This means middleware is working correctly</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg">
              <h2 className="font-semibold mb-2">User Information:</h2>
              {user ? (
                <pre className="text-sm bg-slate-900 text-white p-4 rounded overflow-auto">
                  {JSON.stringify(user, null, 2)}
                </pre>
              ) : (
                <p className="text-slate-600">No user data found</p>
              )}
            </div>

            <div className="flex gap-4">
              <Link
                href="/admin"
                className="px-6 py-3 bg-slate-900 text-white rounded-full font-semibold hover:bg-slate-800"
              >
                Go to Admin Dashboard
              </Link>
              <Link
                href="/"
                className="px-6 py-3 bg-slate-200 text-slate-900 rounded-full font-semibold hover:bg-slate-300"
              >
                Go to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
