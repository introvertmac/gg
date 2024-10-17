import React from 'react';
import { FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

interface ContactInfoStepProps {
  formData: {
    email: string;
    address: string;
  };
  onChange: (data: Partial<ContactInfoStepProps['formData']>) => void;
  errors: { [key: string]: string };
}

export default function ContactInfoStep({ formData, onChange, errors }: ContactInfoStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FaEnvelope className="inline mr-2" />
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={(e) => onChange({ email: e.target.value })}
          className={`w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md`}
        />
        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FaMapMarkerAlt className="inline mr-2" />
          Address (Optional)
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={(e) => onChange({ address: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
    </div>
  );
}
