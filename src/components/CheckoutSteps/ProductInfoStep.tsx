import React from 'react';
import { FaBox, FaImage, FaUpload } from 'react-icons/fa';

interface ProductInfoStepProps {
  formData: {
    productName: string;
    productDetails: string;
    productImage: File | null;
  };
  onChange: (data: Partial<ProductInfoStepProps['formData']>) => void;
  errors: { [key: string]: string };
}

export default function ProductInfoStep({ formData, onChange, errors }: ProductInfoStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FaBox className="inline mr-2" />
          Product Name
        </label>
        <input
          type="text"
          name="productName"
          value={formData.productName}
          onChange={(e) => onChange({ productName: e.target.value })}
          className={`w-full p-2 border ${errors.productName ? 'border-red-500' : 'border-gray-300'} rounded-md`}
        />
        {errors.productName && <p className="mt-1 text-sm text-red-500">{errors.productName}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FaBox className="inline mr-2" />
          Product Details
        </label>
        <textarea
          name="productDetails"
          value={formData.productDetails}
          onChange={(e) => onChange({ productDetails: e.target.value })}
          className={`w-full p-2 border ${errors.productDetails ? 'border-red-500' : 'border-gray-300'} rounded-md`}
          rows={3}
        />
        {errors.productDetails && <p className="mt-1 text-sm text-red-500">{errors.productDetails}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FaImage className="inline mr-2" />
          Product Image
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label htmlFor="product-image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                <span>Upload a file</span>
                <input id="product-image-upload" name="product-image-upload" type="file" className="sr-only" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onChange({ productImage: file });
                }} />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          </div>
        </div>
        {formData.productImage && <p className="mt-2 text-sm text-gray-500">Selected file: {formData.productImage.name}</p>}
        {errors.productImage && <p className="mt-1 text-sm text-red-500">{errors.productImage}</p>}
      </div>
    </div>
  );
}
