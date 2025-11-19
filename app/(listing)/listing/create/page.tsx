"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ProgressSidebar } from "@/app/(listing)/listing/create/components/progress-sidebar";
import { StepCard } from "@/app/(listing)/listing/create/components/step-card";
import { ListingTypeStep } from "@/app/(listing)/listing/create/components/steps/listing-type-step";
import { LocationStep } from "@/app/(listing)/listing/create/components/steps/location-step";
import { UnitDetailsStep } from "@/app/(listing)/listing/create/components/steps/unit-details-step";
import { PriceStep } from "@/app/(listing)/listing/create/components/steps/price-step";
import { MarketingCopyStep } from "@/app/(listing)/listing/create/components/steps/marketing-copy-step";
import { PreviewStep } from "@/app/(listing)/listing/create/components/steps/preview-step";
import { GalleryStep } from "@/app/(listing)/listing/create/components/steps/gallery-step";
import { ValidationBanner } from "@/app/(listing)/listing/create/components/validation-banner";
import { ValidationModeToggle } from "@/app/(listing)/listing/create/components/validation-mode-toggle";
import { type WizardStep, useListingStore } from "@/app/(listing)/listing/create/state/listing-store";
import { useListingWizard } from "@/app/(listing)/listing/create/hooks/use-listing-wizard";
import { useListingSubmission } from "@/app/(listing)/listing/create/hooks/use-listing-submission";
import { usePortalAuth } from "@/app/(portal)/portal/hooks/use-portal-auth";

type StepComponent = (props: { errors: Record<string, string> }) => JSX.Element;

const stepComponentMap: Record<WizardStep, StepComponent> = {
  listingType: ListingTypeStep,
  location: LocationStep,
  unitDetails: UnitDetailsStep,
  price: PriceStep,
  marketingCopy: MarketingCopyStep,
  gallery: GalleryStep,
  preview: PreviewStep,
  platform: PreviewStep
};

export default function ListingCreatePage() {
  const router = useRouter();
  const user = usePortalAuth((state) => state.user);
  const draft = useListingStore((state) => state.draft);
  const isUpdateMode = useListingStore((state) => state.isUpdateMode);

  const {
    currentStep,
    currentIndex,
    stepOrder,
    isFirstStep,
    isLastStep,
    errors,
    bannerMessage,
    bannerVariant,
    isNextDisabled,
    validationBypassEnabled,
    handleNext,
    handlePrevious,
    setValidationBypass,
    metadata
  } = useListingWizard();
  const {
    submitDraft,
    status: submissionStatus,
    error: submissionError,
  } = useListingSubmission();
  const isSaving = submissionStatus === "saving";

  const StepComponent = useMemo<StepComponent>(() => {
    return stepComponentMap[currentStep] ?? (() => <></>);
  }, [currentStep]);
  const strictEnabled = !validationBypassEnabled;

  useEffect(() => {
    if (!user) {
      router.replace("/portal");
    }
  }, [router, user]);

  const handleFinish = async () => {
    const canProceed = handleNext();
    if (!canProceed) {
      return;
    }
    try {
      await submitDraft();
      router.push("/portal/listings");
    } catch {
      // Errors handled inside the submission hook.
    }
  };

  if (!user) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Redirecting to login…
        </p>
      </main>
    );
  }

  return (
    <>
      <ProgressSidebar />
      <section className="space-y-6">
        <div className="rounded-xl border border-border bg-background p-4 text-sm text-muted-foreground lg:hidden">
          Step {currentIndex + 1} of {stepOrder.length}: {metadata.title}
        </div>
        {isUpdateMode && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
            <strong>Updating existing listing:</strong> {draft.propertyName} (ID: {draft.id})
          </div>
        )}
        <StepCard
          title={metadata.title}
          description={metadata.description}
          onNext={isLastStep ? handleFinish : handleNext}
          onPrevious={isFirstStep ? undefined : handlePrevious}
          statusMessage={
            <>
              {bannerMessage ? (
                <ValidationBanner message={bannerMessage} variant={bannerVariant} />
              ) : null}
              {isLastStep && submissionError ? (
                <p className="text-sm text-destructive">{submissionError}</p>
              ) : null}
            </>
          }
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
          nextLabel={
            isLastStep
              ? isSaving
                ? isUpdateMode ? "Updating listing..." : "Saving listing..."
                : isUpdateMode ? "Update listing" : "Save listing"
              : undefined
          }
          isNextDisabled={isLastStep ? isSaving : isNextDisabled}
          auxiliaryActions={
            <ValidationModeToggle
              strictEnabled={strictEnabled}
              onToggle={(strict) => setValidationBypass(!strict)}
            />
          }
        >
          <StepComponent errors={errors} />
        </StepCard>
      </section>
    </>
  );
}
