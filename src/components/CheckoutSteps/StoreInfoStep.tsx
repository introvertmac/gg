import React from 'react';
import { FaStore, FaUpload } from 'react-icons/fa';

interface FormData {
  storeLogo: File | null;
  storeName: string;
  // ... other fields
}

interface StoreInfoStepProps {
  formData: FormData;
  onChange: (data: Partial<FormData>) => void;
  errors: { [key: string]: string };
}

export default function StoreInfoStep({ formData, onChange, errors }: StoreInfoStepProps) {
  const [storeNameError, setStoreNameError] = React.useState('');

  const validateStoreName = (name: string) => {
    if (name.trim().length < 3) {
      setStoreNameError('Store name must be at least 3 characters long');
    } else {
      setStoreNameError('');
    }
    onChange({ storeName: name });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FaStore className="inline mr-2" />
          Store Logo
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                <span>Upload a file</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onChange({ storeLogo: file });
                }} />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          </div>
        </div>
        {formData.storeLogo && <p className="mt-2 text-sm text-gray-500">Selected file: {formData.storeLogo.name}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FaStore className="inline mr-2" />
          Store Name
        </label>
        <input
          type="text"
          name="storeName"
          value={formData.storeName}
          onChange={(e) => onChange({ storeName: e.target.value })}
          className={`w-full p-2 border ${errors.storeName ? 'border-red-500' : 'border-gray-300'} rounded-md`}
        />
        {errors.storeName && <p className="mt-1 text-sm text-red-500">{errors.storeName}</p>}
      </div>
    </div>
  );
}
