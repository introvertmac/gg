"use client";

import Image from "next/image";
import { FaShoppingCart, FaLock, FaBolt } from 'react-icons/fa';
import { useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface AuthResult {
  status: string;
  data: {
    auth_token: string;
    refresh_auth_token: string;
    device_token: string;
    message: string;
  };
}

interface ErrorResult {
  error: string;
}

export default function Home() {
  const [authResult, setAuthResult] = useState<AuthResult | ErrorResult | null>(null)
  const router = useRouter();

  const authenticateWithOkto = async (idToken: string) => {
    try {
      const response = await axios.post<AuthResult>('/api/authenticate', { id_token: idToken });
      setAuthResult(response.data);
      if (response.data.status === 'success') {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Okto authentication error:', error);
      setAuthResult({ error: 'Authentication failed' });
    }
  }

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const { credential } = credentialResponse;
      if (!credential) {
        throw new Error('No credential received from Google');
      }
      await authenticateWithOkto(credential);
    } catch (error) {
      console.error('Error during authentication:', error);
      setAuthResult({ error: 'Authentication failed' });
    }
  }

  const handleGoogleError = () => {
    console.error('Google login failed');
    setAuthResult({ error: 'Google login failed' });
  };

  return (
    <div className="min-h-screen flex flex-col font-[family-name:var(--font-geist-sans)] bg-white text-gray-900">
      <header className="py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center border-b border-gray-200">
        <h2 className="text-2xl font-bold text-blue-600">GlobalGear</h2>
        <Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          Login using Okto
        </Link>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-center">
          Solana Checkout for <span className="text-blue-600">Global Commerce</span>
        </h1>
        <p className="text-xl mb-10 max-w-2xl text-center text-gray-600">
          Seamless, secure, and lightning-fast transactions for your global business.
        </p>
        <button
          onClick={() => (document.querySelector('button[aria-label="Sign in with Google"]') as HTMLElement)?.click()}
          className="px-8 py-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-lg font-semibold shadow-lg"
        >
          Get Started
        </button>
      </main>

      <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Choose GlobalGear</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<FaShoppingCart className="text-4xl mb-4 text-blue-600" />}
              title="Global Reach"
              description="Multi-currency support and localized checkout experiences."
            />
            <FeatureCard 
              icon={<FaLock className="text-4xl mb-4 text-blue-600" />}
              title="Secure Transactions"
              description="Leverage Solana's blockchain for transparent transactions."
            />
            <FeatureCard 
              icon={<FaBolt className="text-4xl mb-4 text-blue-600" />}
              title="Lightning Fast"
              description="Near-instant settlement times and low fees."
            />
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm mb-4 sm:mb-0">
            © 2024 GlobalGear. All rights reserved.
          </p>
          <nav>
            <ul className="flex space-x-6">
              <li><a href="#" className="text-sm hover:text-blue-400 transition-colors">Privacy</a></li>
              <li><a href="#" className="text-sm hover:text-blue-400 transition-colors">Terms</a></li>
              <li><a href="#" className="text-sm hover:text-blue-400 transition-colors">Contact</a></li>
            </ul>
          </nav>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      {icon}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
