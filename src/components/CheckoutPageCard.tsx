import React from 'react';
import Image from 'next/image';
import { FaExternalLinkAlt } from 'react-icons/fa';

interface CheckoutPageData {
  id: number;
  storeName: string;
  storeLogo: string | null;
  productName: string;
  productPrice: string;
}

const CheckoutPageCard = ({ page }: { page: CheckoutPageData }) => (
  <div className="bg-white rounded-lg shadow-md p-4 flex flex-col">
    <div className="flex items-center mb-4">
      {page.storeLogo ? (
        <Image
          src={page.storeLogo}
          alt={page.storeName}
          width={64}
          height={64}
          className="w-16 h-16 object-cover rounded-full mr-4"
        />
      ) : (
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
          <span className="text-2xl font-bold text-blue-600">{page.storeName.charAt(0)}</span>
        </div>
      )}
      <div>
        <h3 className="text-lg font-semibold">{page.storeName}</h3>
        <p className="text-sm text-gray-600">{page.productName}</p>
      </div>
    </div>
    <p className="text-sm font-medium text-blue-600 mb-4">${page.productPrice} USDC</p>
    <div className="mt-auto">
      <a
        href={`/checkout/${page.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
      >
        View Checkout Page <FaExternalLinkAlt className="ml-1" />
      </a>
    </div>
  </div>
);

export default CheckoutPageCard;
