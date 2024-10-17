import React, { useState } from 'react';
import { FaCheck, FaCopy, FaTimes } from 'react-icons/fa';

interface CheckoutCreatedModalProps {
  checkoutPageId: number;
  onClose: () => void;
}

const CheckoutCreatedModal: React.FC<CheckoutCreatedModalProps> = ({ checkoutPageId, onClose }) => {
  const [copiedCheckout, setCopiedCheckout] = useState(false);
  const [copiedBlink, setCopiedBlink] = useState(false);

  const checkoutUrl = `http://localhost:3000/checkout/${checkoutPageId}`;
  const blinkUrl = `http://localhost:3000/api/actions/checkout/${checkoutPageId}`;

  const copyToClipboard = async (text: string, setCopied: (value: boolean) => void) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Checkout Page Created</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>
        <p className="mb-4">Your checkout page has been created successfully. Here are the links:</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Checkout Page URL:</label>
            <div className="flex items-center">
              <input
                type="text"
                readOnly
                value={checkoutUrl}
                className="flex-grow p-2 border border-gray-300 rounded-l-md bg-gray-50"
              />
              <button
                onClick={() => copyToClipboard(checkoutUrl, setCopiedCheckout)}
                className="bg-blue-600 text-white p-2 rounded-r-md hover:bg-blue-700 transition-colors"
              >
                {copiedCheckout ? <FaCheck /> : <FaCopy />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Blink API URL:</label>
            <div className="flex items-center">
              <input
                type="text"
                readOnly
                value={blinkUrl}
                className="flex-grow p-2 border border-gray-300 rounded-l-md bg-gray-50"
              />
              <button
                onClick={() => copyToClipboard(blinkUrl, setCopiedBlink)}
                className="bg-blue-600 text-white p-2 rounded-r-md hover:bg-blue-700 transition-colors"
              >
                {copiedBlink ? <FaCheck /> : <FaCopy />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutCreatedModal;