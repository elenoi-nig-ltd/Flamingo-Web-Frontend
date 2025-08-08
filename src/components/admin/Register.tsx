'use client'

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import Link from 'next/link';

export default function AdminRegister() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('staff');
  const { register, loading, error } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    await register(name, email, password, role);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Head>
        <title>Admin Registration | Flamingo</title>
      </Head>
      
      <div className="w-full md:w-1/3 bg-black flex flex-col justify-center items-center p-6 sm:p-8 md:p-10">
        <h2 className="text-white text-2xl sm:text-3xl font-bold mb-6">REGISTER</h2>
        <form className="space-y-5 w-full max-w-xs sm:max-w-sm" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-3">
              <div className="flex">
                <div className="ml-2">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white">
              FULL NAME
            </label>
            <div className="mt-1">
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border-b border-gray-300 bg-transparent text-white focus:outline-none focus:ring-0 focus:border-white text-sm sm:text-base"
              />
            </div>
          </div>

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
                className="appearance-none block w-full px-3 py-2 border-b border-gray-300 bg-transparent text-white focus:outline-none focus:ring-0 focus:border-white text-sm sm:text-base"
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
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border-b border-gray-300 bg-transparent text-white focus:outline-none focus:ring-0 focus:border-white text-sm sm:text-base"
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-white">
              CONFIRM PASSWORD
            </label>
            <div className="mt-1">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border-b border-gray-300 bg-transparent text-white focus:outline-none focus:ring-0 focus:border-white text-sm sm:text-base"
              />
            </div>
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-white">
              ROLE
            </label>
            <div className="mt-1">
              <select
                id="role"
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border-b border-gray-300 bg-transparent text-white focus:outline-none focus:ring-0 focus:border-white text-sm sm:text-base"
              >
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-yellow-200 hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Registering...' : 'REGISTER'}
            </button>
          </div>

          <div className="text-center text-sm text-gray-300">
            Already have an account?{' '}
            <Link href="/admin/login" className="font-medium text-yellow-200 hover:text-yellow-300">
              Login here
            </Link>
          </div>
        </form>
      </div>

      <div className="hidden md:flex md:w-2/3 bg-gray-100 justify-center items-center relative">
        <img
          src="/assets/images/hero-section.jpg"
          alt="Flamingo Background"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Welcome to Flamingo</h1>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-600 mt-2">Your One-Stop Solution</h2>
          <p className="mt-4 text-gray-500 max-w-md text-sm sm:text-base">
            Flamingo brings together dynamic branches, each dedicated to enhancing your lifestyle with delicious meals to essential household goods, seamless internet connectivity, and real estate services. We cater to all your needs.
          </p>
        </div>
      </div>
    </div>
  );
}