import React from 'react';
import { FaStore, FaBox, FaDollarSign, FaWallet, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

interface SummaryStepProps {
  formData: {
    storeLogo: File | null;
    storeName: string;
    productName: string;
    productDetails: string;
    productImage: File | null;
    productPrice: string;
    walletAddress: string;
    email: string;
    address: string;
  };
}

export default function SummaryStep({ formData }: SummaryStepProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Summary</h3>
      <div className="bg-gray-50 p-4 rounded-md">
        <h4 className="font-medium flex items-center"><FaStore className="mr-2" /> Store Information</h4>
        <p>Store Name: {formData.storeName}</p>
        {formData.storeLogo && <p>Store Logo: {formData.storeLogo.name}</p>}
      </div>
      <div className="bg-gray-50 p-4 rounded-md">
        <h4 className="font-medium flex items-center"><FaBox className="mr-2" /> Product Information</h4>
        <p>Product Name: {formData.productName}</p>
        <p>Product Details: {formData.productDetails}</p>
        {formData.productImage && <p>Product Image: {formData.productImage.name}</p>}
      </div>
      <div className="bg-gray-50 p-4 rounded-md">
        <h4 className="font-medium flex items-center"><FaDollarSign className="mr-2" /> Pricing Information</h4>
        <p>Product Price: ${formData.productPrice} USDC</p>
        <p className="flex items-center"><FaWallet className="mr-2" /> Wallet Address: {formData.walletAddress}</p>
      </div>
      <div className="bg-gray-50 p-4 rounded-md">
        <h4 className="font-medium flex items-center"><FaEnvelope className="mr-2" /> Contact Information</h4>
        <p>Email: {formData.email}</p>
        {formData.address && <p className="flex items-center"><FaMapMarkerAlt className="mr-2" /> Address: {formData.address}</p>}
      </div>
    </div>
  );
}