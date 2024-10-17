import React, { useState } from 'react';
import { FaWallet, FaCopy, FaCheck } from 'react-icons/fa';

interface WalletCardProps {
  walletInfo: { address: string; network_name: string } | null;
}

export default function WalletCard({ walletInfo }: WalletCardProps) {
  const [copied, setCopied] = useState(false);

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <FaWallet className="text-2xl text-blue-600 mr-2" />
        <h3 className="text-xl font-semibold">Wallet Information</h3>
      </div>
      {walletInfo ? (
        <div>
          <p className="text-sm text-gray-600 mb-1">Address:</p>
          <div className="flex items-center">
            <p className="text-gray-800 break-all mr-2">{shortenAddress(walletInfo.address)}</p>
            <button
              onClick={() => copyToClipboard(walletInfo.address)}
              className="text-blue-600 hover:text-blue-800 transition-colors"
              title="Copy full address"
            >
              {copied ? <FaCheck className="text-green-500" /> : <FaCopy />}
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2 mb-1">Network:</p>
          <p className="text-gray-800">{walletInfo.network_name}</p>
        </div>
      ) : (
        <p className="text-gray-600">No wallet information available.</p>
      )}
    </div>
  );
}
