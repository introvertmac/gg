"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FaSignOutAlt, FaPlus } from 'react-icons/fa';
import CheckoutBuilder from '../../components/CheckoutBuilder';
import UserDropdown from '../../components/UserDropdown';

interface UserInfo {
  email: string;
  user_id: string;
}

interface WalletInfo {
  address: string;
  network_name: string;
}

interface PortfolioInfo {
  quantity: string;
  token_name: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [portfolioInfo, setPortfolioInfo] = useState<PortfolioInfo | null>(null);
  const [showCheckoutBuilder, setShowCheckoutBuilder] = useState(false);

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      router.push('/');
    } else {
      fetchDashboardData(authToken);
    }
  }, [router]);

  const fetchDashboardData = async (authToken: string) => {
    try {
      const [userResponse, walletResponse, portfolioResponse] = await Promise.all([
        axios.get('/api/user', { headers: { Authorization: `Bearer ${authToken}` } }),
        axios.get('/api/wallet', { headers: { Authorization: `Bearer ${authToken}` } }),
        axios.get('/api/portfolio', { headers: { Authorization: `Bearer ${authToken}` } })
      ]);

      setUserInfo(userResponse.data.data);
      const walletData = walletResponse.data.data.wallets[0];
      setWalletInfo({
        address: walletData.address,
        network_name: walletData.network_name
      });
      const portfolioData = portfolioResponse.data.data.tokens[0];
      setPortfolioInfo({
        quantity: portfolioData.quantity,
        token_name: portfolioData.token_name.replace('_DEVNET', '')
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      await axios.post('/api/logout', {}, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      localStorage.removeItem('authToken');
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleCreateCheckout = () => {
    setShowCheckoutBuilder(true);
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  return (
    <div className="min-h-screen flex flex-col font-[family-name:var(--font-geist-sans)] bg-white text-gray-900">
      <header className="bg-white shadow-md py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <h2 className="text-2xl font-bold text-blue-600 mr-4">Dashboard</h2>
            <span className="text-gray-600">{userInfo?.email}</span>
          </div>
          <UserDropdown userInfo={userInfo} walletInfo={walletInfo} portfolioInfo={portfolioInfo} onLogout={handleLogout} />
        </div>
      </header>

      <main className="flex-grow p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Welcome, {userInfo?.email}</h1>
            <button
              onClick={handleCreateCheckout}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              <FaPlus className="mr-2" /> Create New Checkout Page
            </button>
          </div>

          {showCheckoutBuilder && (
            <CheckoutBuilder onCancel={() => setShowCheckoutBuilder(false)} />
          )}

          {/* You can add more dashboard content here */}
        </div>
      </main>
    </div>
  );
}
