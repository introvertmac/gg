import { FaChartLine } from 'react-icons/fa';

interface PortfolioSummaryProps {
  portfolioInfo: {
    total_holding_price_inr: string;
    total_holding_price_usdt: string;
  } | null;
}

export default function PortfolioSummary({ portfolioInfo }: PortfolioSummaryProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <FaChartLine className="text-2xl text-blue-600 mr-2" />
        <h3 className="text-xl font-semibold">Portfolio Summary</h3>
      </div>
      {portfolioInfo ? (
        <div>
          <p className="text-sm text-gray-600 mb-1">Total Holdings (INR):</p>
          <p className="text-2xl font-bold text-gray-800 mb-4">₹{portfolioInfo.total_holding_price_inr}</p>
          <p className="text-sm text-gray-600 mb-1">Total Holdings (USDT):</p>
          <p className="text-2xl font-bold text-gray-800">${portfolioInfo.total_holding_price_usdt}</p>
        </div>
      ) : (
        <p className="text-gray-600">No portfolio information available.</p>
      )}
    </div>
  );
}