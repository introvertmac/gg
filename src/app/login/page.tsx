"use client";

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { AuthResult } from '@/types/auth';
import { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';

export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const { credential } = credentialResponse;
      if (!credential) {
        throw new Error('No credential received from Google');
      }
      const response = await axios.post<AuthResult>('/api/authenticate', { id_token: credential });
      if (response.data?.status === 'success') {
        localStorage.setItem('authToken', response.data.data?.auth_token ?? '');
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      setError('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.error('Google login failed');
    setError('Google login failed. Please try again.');
  };

  return (
    <div className="min-h-screen flex flex-col font-[family-name:var(--font-geist-sans)] bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900">
      <header className="py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
          GlobalGear
        </Link>
      </header>

      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
            <p className="mt-2 text-sm text-gray-600">
              And start your global commerce journey
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <FaSpinner className="animate-spin text-4xl text-blue-600" />
              <p className="text-lg font-medium text-gray-700">Authenticating...</p>
            </div>
          ) : (
            <div className="mt-8 flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                theme="filled_blue"
                size="large"
                width="300px"
              />
            </div>
          )}
          
          {error && (
            <div className="mt-4 text-red-600 text-sm text-center">{error}</div>
          )}
        </div>
      </main>

      <footer className="py-4 text-center text-sm text-gray-600">
        © 2024 GlobalGear. All rights reserved.
      </footer>
    </div>
  );
}
