"use client";

import { useMemo } from "react";
import { ProgressSidebar } from "@/app/(listing)/listing/create/components/progress-sidebar";
import { StepCard } from "@/app/(listing)/listing/create/components/step-card";
import { ListingTypeStep } from "@/app/(listing)/listing/create/components/steps/listing-type-step";
import { LocationStep } from "@/app/(listing)/listing/create/components/steps/location-step";
import { UnitDetailsStep } from "@/app/(listing)/listing/create/components/steps/unit-details-step";
import { PriceStep } from "@/app/(listing)/listing/create/components/steps/price-step";
import { PreviewStep } from "@/app/(listing)/listing/create/components/steps/preview-step";
import { GalleryStep } from "@/app/(listing)/listing/create/components/steps/gallery-step";
import { ValidationBanner } from "@/app/(listing)/listing/create/components/validation-banner";
import { ValidationModeToggle } from "@/app/(listing)/listing/create/components/validation-mode-toggle";
import { type WizardStep } from "@/app/(listing)/listing/create/state/listing-store";
import { useListingWizard } from "@/app/(listing)/listing/create/hooks/use-listing-wizard";

type StepComponent = (props: { errors: Record<string, string> }) => JSX.Element;

const stepComponentMap: Record<WizardStep, StepComponent> = {
  listingType: ListingTypeStep,
  location: LocationStep,
  unitDetails: UnitDetailsStep,
  price: PriceStep,
  gallery: GalleryStep,
  preview: PreviewStep,
  platform: PreviewStep
};

export default function ListingCreatePage() {
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

  const StepComponent = useMemo<StepComponent>(() => {
    return stepComponentMap[currentStep] ?? (() => <></>);
  }, [currentStep]);
  const strictEnabled = !validationBypassEnabled;

  return (
    <>
      <ProgressSidebar />
      <section className="space-y-6">
        <div className="rounded-xl border border-border bg-background p-4 text-sm text-muted-foreground lg:hidden">
          Step {currentIndex + 1} of {stepOrder.length}: {metadata.title}
        </div>
        <StepCard
          title={metadata.title}
          description={metadata.description}
          onNext={isLastStep ? undefined : handleNext}
          onPrevious={isFirstStep ? undefined : handlePrevious}
          statusMessage={
            bannerMessage ? (
              <ValidationBanner message={bannerMessage} variant={bannerVariant} />
            ) : null
          }
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
          nextLabel={isLastStep ? "Finish" : "Next"}
          isNextDisabled={isNextDisabled}
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
