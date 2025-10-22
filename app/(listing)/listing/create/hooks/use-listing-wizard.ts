"use client";

import { useEffect, useMemo } from 'react';
import { STEP_METADATA } from '@/app/(listing)/listing/create/components/step-metadata';
import {
  useListingStore,
  type ValidationErrorMap,
  type WizardStep
} from '@/app/(listing)/listing/create/state/listing-store';

type UseListingWizardResult = {
  currentStep: WizardStep;
  currentIndex: number;
  stepOrder: WizardStep[];
  isFirstStep: boolean;
  isLastStep: boolean;
  errors: ValidationErrorMap;
  bannerMessage: string | null;
  bannerVariant: 'error' | 'neutral' | 'success';
  isNextDisabled: boolean;
  validationBypassEnabled: boolean;
  handleNext: () => void;
  handlePrevious: () => void;
  setValidationBypass: (enabled: boolean) => void;
  metadata: { title: string; description: string };
};

const getFirstError = (errors: ValidationErrorMap): string | null => {
  const [, message] = Object.entries(errors)[0] ?? [];
  return message ?? null;
};

export function useListingWizard(): UseListingWizardResult {
  const {
    draft,
    currentStep,
    stepOrder,
    statusByStep,
    errorsByStep,
    setStepStatus,
    setStepErrors,
    clearStepErrors,
    validateStep,
    nextStep,
    previousStep,
    validationBypassEnabled,
    setValidationBypass
  } = useListingStore((state) => ({
    draft: state.draft,
    currentStep: state.currentStep,
    stepOrder: state.stepOrder,
    statusByStep: state.statusByStep,
    errorsByStep: state.errorsByStep,
    setStepStatus: state.setStepStatus,
    setStepErrors: state.setStepErrors,
    clearStepErrors: state.clearStepErrors,
    validateStep: state.validateStep,
    nextStep: state.nextStep,
    previousStep: state.previousStep,
    validationBypassEnabled: state.validationBypassEnabled,
    setValidationBypass: state.setValidationBypass
  }));

  const validation = useMemo(
    () => validateStep(currentStep),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [validateStep, currentStep, draft]
  );

  const persistedErrors = errorsByStep[currentStep] ?? {};
  const hasPersistedErrors = Object.keys(persistedErrors).length > 0;
  const effectiveErrors = hasPersistedErrors ? persistedErrors : validation.errors;
  const showErrors = !validationBypassEnabled;
  const displayedErrors = showErrors ? effectiveErrors : {};

  useEffect(() => {
    if (hasPersistedErrors && validation.isValid) {
      clearStepErrors(currentStep);
      if (statusByStep[currentStep] === 'blocked') {
        setStepStatus(currentStep, 'in-progress');
      }
    }
  }, [
    clearStepErrors,
    currentStep,
    hasPersistedErrors,
    setStepStatus,
    statusByStep,
    validation.isValid
  ]);

  const handleNext = () => {
    if (validationBypassEnabled) {
      setStepStatus(currentStep, 'complete');
      clearStepErrors(currentStep);
      nextStep();
      return;
    }

    const result = validateStep(currentStep);
    if (!result.isValid) {
      setStepErrors(currentStep, result.errors);
      setStepStatus(currentStep, 'blocked');
      return;
    }

    setStepStatus(currentStep, 'complete');
    clearStepErrors(currentStep);
    nextStep();
  };

  const handlePrevious = () => {
    previousStep();
  };

  const index = stepOrder.indexOf(currentStep);
  const isFirstStep = index <= 0;
  const isLastStep = index === stepOrder.length - 1;
  const bannerMessage = showErrors ? getFirstError(displayedErrors) : null;
  const bannerVariant = showErrors && Object.keys(displayedErrors).length
    ? 'error'
    : 'neutral';
  const isNextDisabled = !validationBypassEnabled && !validation.isValid;

  return {
    currentStep,
    currentIndex: index,
    stepOrder,
    isFirstStep,
    isLastStep,
    errors: displayedErrors,
    bannerMessage,
    bannerVariant,
    isNextDisabled,
    validationBypassEnabled,
    handleNext,
    handlePrevious,
    setValidationBypass,
    metadata: STEP_METADATA[currentStep]
  };
}
