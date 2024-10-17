import { useState, useRef, useEffect } from 'react';
import { FaUser, FaSignOutAlt, FaWallet, FaCopy, FaCheck, FaChartLine } from 'react-icons/fa';

interface UserDropdownProps {
  userInfo: { email: string; user_id: string } | null;
  walletInfo: { address: string; network_name: string } | null;
  portfolioInfo: { quantity: string; token_name: string } | null;
  onLogout: () => void;
}

export default function UserDropdown({ userInfo, walletInfo, portfolioInfo, onLogout }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 focus:outline-none"
      >
        <FaUser className="text-xl" />
        <span>{userInfo?.email}</span>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-10">
          {walletInfo && (
            <div className="px-4 py-2 border-b border-gray-200">
              <p className="text-sm font-semibold text-gray-600">Wallet</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-sm text-gray-800">{shortenAddress(walletInfo.address)}</p>
                <button
                  onClick={() => copyToClipboard(walletInfo.address)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {copied ? <FaCheck /> : <FaCopy />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">{walletInfo.network_name}</p>
            </div>
          )}
          {portfolioInfo && (
            <div className="px-4 py-2 border-b border-gray-200">
              <p className="text-sm font-semibold text-gray-600">Portfolio</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-sm text-gray-800">Holdings:</p>
                <p className="text-sm font-semibold text-blue-600">
                  {portfolioInfo.quantity} {portfolioInfo.token_name}
                </p>
              </div>
            </div>
          )}
          <button
            onClick={onLogout}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <FaSignOutAlt className="inline-block mr-2" /> Logout
          </button>
        </div>
      )}
    </div>
  );
}
