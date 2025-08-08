'use client'

import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import Link from 'next/link';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-black">
      <Head>
        <title>Admin Login | Flamingo</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      {/* Mobile & Tablet: Full-width black background */}
      <div className="w-full md:w-1/3 bg-black flex flex-col justify-center items-center p-6 md:p-10">
        <div className="w-full max-w-xs">
          <h2 className="text-white text-2xl font-bold mb-6">ADMIN</h2>
          <form className="space-y-6 w-full" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white">
                EMAIL
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border-b border-gray-300 bg-transparent text-white focus:outline-none focus:ring-0 focus:border-white sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white">
                PASSWORD
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border-b border-gray-300 bg-transparent text-white focus:outline-none focus:ring-0 focus:border-white sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-yellow-200 hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Signing in...' : 'LOGIN'}
              </button>
            </div>

            <div className="text-center text-sm text-gray-300">
              Don&apos;t have an account?{' '}
              <Link href="/admin/register" className="font-medium text-yellow-200 hover:text-yellow-300">
                Register here
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Desktop: Right side with image (hidden on mobile) */}
      <div className="hidden md:flex md:w-2/3 bg-gray-100 justify-center items-center relative">
        <img
          src="/assets/images/hero-section.jpg"
          alt="Flamingo Background"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="text-center relative z-10">
          <h1 className="text-4xl font-bold text-gray-800">Welcome to Flamingo</h1>
          <h2 className="text-2xl font-semibold text-gray-600 mt-2">Your One-Stop Solution</h2>
          <p className="mt-4 text-gray-500 max-w-md">
            Flamingo brings together dynamic branches, each dedicated to enhancing your lifestyle with delicious meals to essential household goods, seamless internet connectivity, and real estate services. We cater to all your needs.
          </p>
        </div>
      </div>
    </div>
  );
}