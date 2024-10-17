import React, { useState, lazy, Suspense } from 'react';
import { FaArrowLeft, FaArrowRight, FaSpinner } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { uploadToCloudinary } from '../utils/cloudinary';
import { createCheckoutPage } from '../utils/database';

import StoreInfoStep from './CheckoutSteps/StoreInfoStep';
import ProductInfoStep from './CheckoutSteps/ProductInfoStep';
import PricingStep from './CheckoutSteps/PricingStep';
import ContactInfoStep from './CheckoutSteps/ContactInfoStep';
import SummaryStep from './CheckoutSteps/SummaryStep';

interface CheckoutBuilderProps {
  onCancel: () => void;
}

interface FormData {
  storeLogo: File | null;
  storeName: string;
  productName: string;
  productDetails: string;
  productImage: File | null;
  productPrice: string;
  email: string;
  address: string;
  walletAddress: string;
}

interface StepProps {
  formData: FormData;
  onChange: (data: Partial<FormData>) => void;
  errors: { [key: string]: string };
}

export default function CheckoutBuilder({ onCancel }: CheckoutBuilderProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    storeLogo: null,
    storeName: '',
    productName: '',
    productDetails: '',
    productImage: null,
    productPrice: '',
    email: '',
    address: '',
    walletAddress: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const steps = [
    { name: 'Store Info', component: StoreInfoStep },
    { name: 'Product Info', component: ProductInfoStep },
    { name: 'Pricing', component: PricingStep },
    { name: 'Contact Info', component: ContactInfoStep },
    { name: 'Summary', component: SummaryStep },
  ];

  const handleInputChange = (newData: Partial<FormData>) => {
    setFormData(prevState => ({
      ...prevState,
      ...newData,
    }));
    // Clear errors for the updated fields
    setErrors(prevErrors => {
      const updatedErrors = { ...prevErrors };
      Object.keys(newData).forEach(key => delete updatedErrors[key]);
      return updatedErrors;
    });
  };

  const validateStep = (step: number): boolean => {
    const newErrors: { [key: string]: string } = {};

    switch (step) {
      case 0: // Store Info
        if (!formData.storeName.trim()) newErrors.storeName = 'Store name is required';
        break;
      case 1: // Product Info
        if (!formData.productName.trim()) newErrors.productName = 'Product name is required';
        if (!formData.productDetails.trim()) newErrors.productDetails = 'Product details are required';
        break;
      case 2: // Pricing
        if (!formData.productPrice) newErrors.productPrice = 'Product price is required';
        if (!formData.walletAddress.trim()) newErrors.walletAddress = 'Wallet address is required';
        break;
      case 3: // Contact Info
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      // Show error messages for empty required fields
      const newErrors: { [key: string]: string } = {};
      Object.keys(formData).forEach(key => {
        if (!formData[key as keyof FormData] && key !== 'address') {
          newErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
        }
      });
      setErrors(newErrors);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === steps.length - 1) {
      setIsSubmitting(true);
      try {
        // Upload images to Cloudinary
        const storeLogoUrl = formData.storeLogo ? await uploadToCloudinary(formData.storeLogo) : null;
        const productImageUrl = formData.productImage ? await uploadToCloudinary(formData.productImage) : null;

        // Create checkout page in the database
        const checkoutPageId = await createCheckoutPage({
          storeName: formData.storeName,
          storeLogo: storeLogoUrl,
          productName: formData.productName,
          productDetails: formData.productDetails,
          productImage: productImageUrl,
          productPrice: formData.productPrice,
          walletAddress: formData.walletAddress,
          email: formData.email,
          address: formData.address,
        });

        // Redirect to the new checkout page
        router.push(`/checkout/${checkoutPageId}`);
      } catch (error) {
        console.error('Error creating checkout page:', error);
        setSubmissionError('An error occurred while creating your checkout page. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      handleNext();
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="bg-white shadow-md rounded-lg p-8">
      <h2 className="text-2xl font-bold mb-6">Create New Checkout Page</h2>
      {/* Progress indicator */}
      <Suspense fallback={<div>Loading...</div>}>
        {currentStep === steps.length - 1 ? (
          <SummaryStep formData={formData} />
        ) : (
          <CurrentStepComponent 
            formData={formData}
            onChange={handleInputChange}
            errors={errors}
          />
        )}
      </Suspense>
      {submissionError && (
        <p className="mt-4 text-red-500">{submissionError}</p>
      )}
      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={currentStep === 0 ? onCancel : handleBack}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          disabled={isSubmitting}
        >
          {currentStep === 0 ? 'Cancel' : <><FaArrowLeft className="inline mr-2" /> Back</>}
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <FaSpinner className="inline mr-2 animate-spin" />
              Submitting...
            </>
          ) : currentStep === steps.length - 1 ? (
            'Create Checkout Page'
          ) : (
            <><FaArrowRight className="inline mr-2" /> Next</>
          )}
        </button>
      </div>
    </div>
  );
}
