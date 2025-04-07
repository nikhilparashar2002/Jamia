'use client';

import React, { useState } from 'react';
import { Button, Card, CardBody, Select, SelectItem } from '@nextui-org/react';

export interface StepWizardProps {
  steps: {
    title: string;
    component: React.ReactNode;
    validation?: () => boolean;
  }[];
  onComplete: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  showNavigation?: boolean;
  status?: 'draft' | 'review' | 'published';
  onStatusChange?: (status: 'draft' | 'review' | 'published') => void;
}

export default function StepWizard({
  steps,
  onComplete,
  onCancel,
  isSubmitting = false,
  showNavigation = true,
  status = 'draft',
  onStatusChange
}: StepWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  
  const handleNext = () => {
    const currentValidation = steps[currentStep].validation;
    if (currentValidation && !currentValidation()) {
      return;
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onCancel();
    }
  };

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${index <= currentStep ? 'bg-primary text-white' : 'bg-gray-200'}`}
              >
                {index + 1}
              </div>
              <div className="ml-2 text-sm font-medium">{step.title}</div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-4 ${index < currentStep ? 'bg-primary' : 'bg-gray-200'}`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step content */}
      <Card>
        <CardBody>
          {steps[currentStep].component}
        </CardBody>
      </Card>

      {/* Navigation buttons */}
      {showNavigation && (
        <div className="flex justify-between mt-4">
          <div className="flex gap-2 items-center">
            <Button
              color="default"
              variant="flat"
              onPress={handleBack}
            >
              {currentStep === 0 ? 'Cancel' : 'Back'}
            </Button>
            <Select
              value={status}
              onChange={(e) => onStatusChange?.(e.target.value as 'draft' | 'review' | 'published')}
              className="w-32"
              size="sm"
              variant="bordered"
            >
              <SelectItem key="draft" value="draft">Draft</SelectItem>
              <SelectItem key="review" value="review">Review</SelectItem>
              <SelectItem key="published" value="published">Published</SelectItem>
            </Select>
          </div>
          <Button
            color="primary"
            onPress={handleNext}
            isLoading={isSubmitting && currentStep === steps.length - 1}
          >
            {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
          </Button>
        </div>
      )}
    </div>
  );
}