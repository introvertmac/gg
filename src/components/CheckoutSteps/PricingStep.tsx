import React from 'react';
import { FaDollarSign, FaWallet } from 'react-icons/fa';

interface PricingStepProps {
  formData: {
    productPrice: string;
    walletAddress: string;
  };
  onChange: (data: Partial<PricingStepProps['formData']>) => void;
  errors: { [key: string]: string };
}

export default function PricingStep({ formData, onChange, errors }: PricingStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FaDollarSign className="inline mr-2" />
          Product Price (USDC)
        </label>
        <input
          type="number"
          name="productPrice"
          value={formData.productPrice}
          onChange={(e) => onChange({ productPrice: e.target.value })}
          className={`w-full p-2 border ${errors.productPrice ? 'border-red-500' : 'border-gray-300'} rounded-md`}
          step="0.01"
        />
        {errors.productPrice && <p className="mt-1 text-sm text-red-500">{errors.productPrice}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FaWallet className="inline mr-2" />
          Wallet Address for Payments
        </label>
        <input
          type="text"
          name="walletAddress"
          value={formData.walletAddress}
          onChange={(e) => onChange({ walletAddress: e.target.value })}
          className={`w-full p-2 border ${errors.walletAddress ? 'border-red-500' : 'border-gray-300'} rounded-md`}
        />
        {errors.walletAddress && <p className="mt-1 text-sm text-red-500">{errors.walletAddress}</p>}
      </div>
    </div>
  );
}
