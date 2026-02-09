import React, { useState, ReactNode } from "react";
import { Check, ArrowLeft, ArrowRight } from "lucide-react";

export interface Step {
  id: string;
  title: string;
  content: ReactNode;
}

interface MultiStepFormProps {
  steps: Step[];
  onSubmit: (formData: FormData) => Promise<void>;
  submitting?: boolean;
  error?: string | null;
  success?: string | null;
}

export default function MultiStepForm({
  steps,
  onSubmit,
  submitting = false,
  error = null,
  success = null,
}: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const formRef = React.useRef<HTMLFormElement>(null);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      await onSubmit(formData);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative" style={{ paddingLeft: '5%', paddingRight: '5%' }}>
          {/* Base Line - Full width gray line connecting all steps */}
          <div 
            className="absolute bg-gray-300"
            style={{
              top: '1.25rem',
              left: 0,
              right: 0,
              height: '2px',
              zIndex: 0
            }}
          />
          
          {/* Completed Progress Line - Green segment grows based on completed steps */}
          {currentStep > 0 && (
            <div
              className="absolute bg-green-500 transition-all duration-300"
              style={{
                top: '1.25rem',
                left: 0,
                width: `${(currentStep / (steps.length - 1)) * 100}%`,
                height: '2px',
                zIndex: 1
              }}
            />
          )}

          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const isFuture = index > currentStep;

            return (
              <div key={step.id} className="flex flex-col items-center flex-1 relative" style={{ zIndex: 10 }}>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                      isCompleted
                        ? "bg-green-500 text-white"
                        : isCurrent
                        ? "bg-yellow-400 text-gray-900"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <span
                    className={`mt-2 text-xs font-semibold uppercase tracking-wider ${
                      isCompleted
                        ? "text-green-500"
                        : isCurrent
                        ? "text-gray-700"
                        : "text-gray-400"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
            );
          })}
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600">
          {success}
        </div>
      )}

      {/* Form Content */}
      <div className="bg-white rounded-2xl p-8 shadow-xl">
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          {/* Step Content - Render all steps but hide non-active ones */}
          <div className="min-h-[400px] relative">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={index === currentStep ? "block" : "hidden"}
              >
                {step.content}
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 0 || submitting}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-3 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                Next Step
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-3 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {submitting ? "Submitting..." : "Submit Application"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
