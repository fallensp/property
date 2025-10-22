"use client";

import { useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  useListingStore,
  type ListingDraft
} from "@/app/(listing)/listing/create/state/listing-store";

type StepProps = {
  errors: Record<string, string>;
};

const propertyCategories: Array<{
  value: NonNullable<ListingDraft["propertyCategory"]>;
  title: string;
  helper: string;
}> = [
  {
    value: "residential",
    title: "Residential",
    helper: "Bungalows, condos, terrace homes"
  },
  {
    value: "commercial",
    title: "Commercial",
    helper: "Shop lots, offices, retail spaces"
  },
  {
    value: "industrial",
    title: "Industrial",
    helper: "Factories, warehouses, light industrial"
  }
];

const listingPurposes: Array<{
  value: NonNullable<ListingDraft["listingPurpose"]>;
  title: string;
  helper: string;
}> = [
  {
    value: "sale",
    title: "Sale",
    helper: "Market the property for sale"
  },
  {
    value: "rent",
    title: "Rent",
    helper: "List the property for lease"
  }
];

function SelectionCard({
  title,
  helper,
  selected,
  onClick,
  errorId
}: {
  title: string;
  helper: string;
  selected: boolean;
  onClick: () => void;
  errorId?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-state={selected ? "selected" : "idle"}
      className={cn(
        "w-full rounded-xl border p-4 text-left transition",
        selected
          ? "border-primary bg-primary/10"
          : "border-border bg-background hover:border-primary/60 hover:bg-muted"
      )}
      aria-describedby={errorId}
      aria-pressed={selected}
    >
      <p className="text-base font-semibold text-foreground">{title}</p>
      <p className="text-sm text-muted-foreground">{helper}</p>
    </button>
  );
}

export function ListingTypeStep({ errors }: StepProps) {
  const draft = useListingStore((state) => state.draft);
  const updateListingType = useListingStore((state) => state.updateListingType);

  const update = useCallback(
    (partial: Partial<ListingDraft>) => {
      updateListingType({
        propertyCategory: partial.propertyCategory ?? draft.propertyCategory,
        listingPurpose: partial.listingPurpose ?? draft.listingPurpose,
        auctioned: partial.auctioned ?? draft.auctioned,
        availabilityMode: partial.availabilityMode ?? draft.availabilityMode,
        availableDate: partial.availableDate ?? draft.availableDate,
        coAgency: partial.coAgency ?? draft.coAgency,
        referenceNumber: partial.referenceNumber ?? draft.referenceNumber
      });
    },
    [draft, updateListingType]
  );

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Property category</h3>
        <p className="text-sm text-muted-foreground">
          Choose the category that best reflects the property so the listing is
          sorted correctly in the marketplace.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {propertyCategories.map((category) => (
            <SelectionCard
              key={category.value}
              title={category.title}
              helper={category.helper}
              selected={draft.propertyCategory === category.value}
              onClick={() => update({ propertyCategory: category.value })}
              errorId={errors.propertyCategory ? 'property-category-error' : undefined}
            />
          ))}
        </div>
        {errors.propertyCategory && (
          <p
            id="property-category-error"
            className="text-sm text-destructive"
          >
            {errors.propertyCategory}
          </p>
        )}
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Listing purpose</h3>
        <p className="text-sm text-muted-foreground">
          Tell buyers whether the property is for sale or rent to show the
          correct pricing context.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {listingPurposes.map((purpose) => (
            <SelectionCard
              key={purpose.value}
              title={purpose.title}
              helper={purpose.helper}
              selected={draft.listingPurpose === purpose.value}
              onClick={() => update({ listingPurpose: purpose.value })}
              errorId={errors.listingPurpose ? 'listing-purpose-error' : undefined}
            />
          ))}
        </div>
        {errors.listingPurpose && (
          <p
            id="listing-purpose-error"
            className="text-sm text-destructive"
          >
            {errors.listingPurpose}
          </p>
        )}
      </section>

      <section className="space-y-2">
        <Label htmlFor="reference-number">Listing reference number (optional)</Label>
        <Input
          id="reference-number"
          maxLength={250}
          placeholder="E.g. Internal tracking number"
          value={draft.referenceNumber}
          onChange={(event) => update({ referenceNumber: event.target.value })}
          aria-invalid={Boolean(errors.referenceNumber)}
          aria-describedby={
            errors.referenceNumber ? 'reference-number-error' : undefined
          }
        />
        <p className="text-xs text-muted-foreground">
          This stays internal and helps you cross-reference with your CRM.
        </p>
        {errors.referenceNumber && (
          <p id="reference-number-error" className="text-sm text-destructive">
            {errors.referenceNumber}
          </p>
        )}
      </section>
    </div>
  );
}
