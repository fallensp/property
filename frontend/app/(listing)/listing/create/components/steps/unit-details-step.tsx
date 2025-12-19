"use client";

import { ReactNode, useCallback } from "react";
import { Minus, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  useListingStore,
  type UnitDetails
} from "@/app/(listing)/listing/create/state/listing-store";

type StepProps = {
  errors: Record<string, string>;
};

const furnishingOptions: Array<{
  value: NonNullable<UnitDetails["furnishing"]>;
  label: string;
}> = [
  { value: "fully", label: "Fully furnished" },
  { value: "partial", label: "Partially furnished" },
  { value: "unfurnished", label: "Unfurnished" }
];

type NumberStepperProps = {
  id: string;
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
  min?: number;
  max?: number;
  required?: boolean;
  optionalHint?: string;
  error?: string;
  placeholder?: string;
  placeholderWhenZero?: boolean;
  allowNull?: boolean;
};

type StepperButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  ariaLabel: string;
  children: ReactNode;
};

function StepperButton({
  onClick,
  disabled,
  ariaLabel,
  children
}: StepperButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        disabled && "pointer-events-none opacity-40"
      )}
    >
      {children}
    </button>
  );
}

function NumberStepper({
  id,
  label,
  value,
  onChange,
  min = 0,
  max,
  required,
  optionalHint,
  error,
  placeholder = "Select",
  placeholderWhenZero,
  allowNull
}: NumberStepperProps) {
  const numericValue = typeof value === "number" ? value : null;
  const displayValue =
    numericValue === null
      ? placeholder
      : placeholderWhenZero && numericValue === 0
      ? placeholder
      : String(numericValue);
  const labelId = `${id}-label`;
  const errorId = error ? `${id}-error` : undefined;
  const ariaValueText =
    numericValue === null
      ? placeholder
      : placeholderWhenZero && numericValue === 0
      ? `${numericValue} (optional)`
      : String(numericValue);
  const disableDecrement =
    numericValue === null || (!allowNull && numericValue <= min);
  const disableIncrement =
    typeof max === "number" && numericValue !== null && numericValue >= max;

  const handleIncrement = () => {
    const nextValue =
      numericValue === null
        ? Math.max(min === 0 ? 1 : min, min)
        : numericValue + 1;

    if (typeof max === "number" && nextValue > max) {
      return;
    }

    onChange(nextValue);
  };

  const handleDecrement = () => {
    if (numericValue === null) {
      return;
    }

    const nextValue = numericValue - 1;

    if (nextValue < min) {
      if (allowNull) {
        onChange(null);
      } else {
        onChange(min);
      }
      return;
    }

    onChange(nextValue);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-2">
        <span id={labelId} className="text-base font-medium text-foreground">
          {label}
          {required ? <span className="ml-1 text-destructive">*</span> : null}
        </span>
        {optionalHint ? (
          <span className="text-xs text-muted-foreground">{optionalHint}</span>
        ) : null}
      </div>
      <div className="flex items-center gap-2">
        <StepperButton
          ariaLabel={`Decrease ${label}`}
          disabled={disableDecrement}
          onClick={handleDecrement}
        >
          <Minus className="h-4 w-4" aria-hidden />
        </StepperButton>
        <div
          id={id}
          role="spinbutton"
          aria-labelledby={labelId}
          aria-valuenow={
            numericValue === null ? Math.max(min, 0) : numericValue
          }
          aria-valuemin={min}
          aria-valuemax={typeof max === "number" ? max : undefined}
          aria-valuetext={ariaValueText}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className={cn(
            "grid min-w-[112px] place-items-center rounded-lg border px-6 py-2 text-sm font-semibold tracking-tight",
            numericValue === null || (placeholderWhenZero && numericValue === 0)
              ? "border-dashed border-border/70 text-muted-foreground"
              : "border-border/80 text-foreground"
          )}
        >
          {displayValue}
        </div>
        <StepperButton
          ariaLabel={`Increase ${label}`}
          disabled={disableIncrement}
          onClick={handleIncrement}
        >
          <Plus className="h-4 w-4" aria-hidden />
        </StepperButton>
      </div>
      {error ? (
        <p id={errorId} className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function UnitDetailsStep({ errors }: StepProps) {
  const draft = useListingStore((state) => state.draft);
  const updateUnitDetails = useListingStore((state) => state.updateUnitDetails);

  const update = useCallback(
    (partial: Partial<UnitDetails>) => {
      updateUnitDetails(partial);
    },
    [updateUnitDetails]
  );

  const toggleFeature = useCallback(
    (feature: UnitDetails["features"][number]) => {
      const features = draft.unitDetails.features;
      const nextFeatures = features.includes(feature)
        ? features.filter((item) => item !== feature)
        : [...features, feature];

      update({ features: nextFeatures });
    },
    [draft.unitDetails.features, update]
  );

  return (
    <div className="space-y-10">
      <section className="space-y-5">
        <div className="space-y-1">
          <h3 className="text-xl font-semibold text-foreground">Rooms</h3>
          <p className="text-sm text-muted-foreground">
            Use the steppers to capture the core layout before adding finer
            details.
          </p>
        </div>
        <div className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <NumberStepper
              id="bedrooms"
              label="Bedrooms"
              required
              value={draft.unitDetails.bedrooms}
              onChange={(value) => update({ bedrooms: value })}
              allowNull
              error={errors.bedrooms}
            />
            <NumberStepper
              id="bathrooms"
              label="Bathrooms"
              required
              value={draft.unitDetails.bathrooms}
              onChange={(value) => update({ bathrooms: value })}
              allowNull
              error={errors.bathrooms}
            />
          </div>
          <NumberStepper
            id="maid-rooms"
            label="Maid / store rooms"
            value={draft.unitDetails.maidRooms}
            onChange={(value) =>
              update({ maidRooms: value === null ? 0 : value })
            }
            optionalHint="Optional"
            placeholderWhenZero
          />
        </div>
      </section>

      <section className="space-y-5">
        <div className="space-y-1">
          <h3 className="text-xl font-semibold text-foreground">Size</h3>
          <p className="text-sm text-muted-foreground">
            Built-up information helps filter serious buyers and renters.
          </p>
        </div>
        <div className="space-y-4">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="built-up" className="text-sm font-medium">
                Built-up <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="built-up"
                  type="number"
                  min={1}
                  value={draft.unitDetails.builtUp ?? ""}
                  onChange={(event) =>
                    update({
                      builtUp:
                        event.target.value === ""
                          ? null
                          : Number.parseFloat(event.target.value)
                    })
                  }
                  placeholder="Enter built-up size"
                  aria-invalid={Boolean(errors.builtUp)}
                  aria-describedby={
                    errors.builtUp ? "built-up-error" : undefined
                  }
                  className="pr-16"
                />
                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded-lg border border-border/70 bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  sqft
                </span>
              </div>
              {errors.builtUp ? (
                <p id="built-up-error" className="text-sm text-destructive">
                  {errors.builtUp}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <Label htmlFor="land-area" className="text-sm font-medium">
                  Land area
                </Label>
                <span className="text-xs text-muted-foreground">(optional)</span>
              </div>
              <div className="relative">
                <Input
                  id="land-area"
                  type="number"
                  min={0}
                  value={draft.unitDetails.landArea ?? ""}
                  onChange={(event) =>
                    update({
                      landArea:
                        event.target.value === ""
                          ? null
                          : Number.parseFloat(event.target.value)
                    })
                  }
                  placeholder="Enter land area"
                  className="pr-16"
                />
                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded-lg border border-border/70 bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  sqft
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                For landed properties.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-medium text-foreground">
                Built-up dimensions
              </span>
              <span className="text-xs text-muted-foreground">(optional)</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label
                  htmlFor="built-up-width"
                  className="text-xs font-semibold uppercase text-muted-foreground"
                >
                  Width
                </Label>
                <div className="relative">
                  <Input
                    id="built-up-width"
                    type="number"
                    min={0}
                    value={draft.unitDetails.builtUpWidth ?? ""}
                    onChange={(event) =>
                      update({
                        builtUpWidth:
                          event.target.value === ""
                            ? null
                            : Number.parseFloat(event.target.value)
                      })
                    }
                    placeholder="Enter width"
                    className="pr-12"
                  />
                  <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded-md border border-border/70 bg-muted px-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    ft
                  </span>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="built-up-length"
                  className="text-xs font-semibold uppercase text-muted-foreground"
                >
                  Length
                </Label>
                <div className="relative">
                  <Input
                    id="built-up-length"
                    type="number"
                    min={0}
                    value={draft.unitDetails.builtUpLength ?? ""}
                    onChange={(event) =>
                      update({
                        builtUpLength:
                          event.target.value === ""
                            ? null
                            : Number.parseFloat(event.target.value)
                      })
                    }
                    placeholder="Enter length"
                    className="pr-12"
                  />
                  <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded-md border border-border/70 bg-muted px-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    ft
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="space-y-1">
          <h3 className="text-xl font-semibold text-foreground">
            Floor details
          </h3>
          <p className="text-sm text-muted-foreground">
            Add identifiers for your internal records. They can stay hidden
            from the published listing.
          </p>
        </div>
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="block" className="text-sm font-medium">
                Block
              </Label>
              <Input
                id="block"
                maxLength={20}
                value={draft.unitDetails.block}
                onChange={(event) => update({ block: event.target.value })}
                placeholder="Block"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="floor" className="text-sm font-medium">
                Floor
              </Label>
              <Input
                id="floor"
                maxLength={20}
                value={draft.unitDetails.floor}
                onChange={(event) => update({ floor: event.target.value })}
                placeholder="Floor"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="unit-number" className="text-sm font-medium">
                Unit / House no.
              </Label>
              <Input
                id="unit-number"
                maxLength={20}
                value={draft.unitDetails.unitNumber}
                onChange={(event) => update({ unitNumber: event.target.value })}
                placeholder="Unit/House no."
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-xl border border-border/70 bg-muted/40 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Hide these details on the published listing
              </p>
              <p className="text-xs text-muted-foreground">
                Buyers still see the development and neighbourhood.
              </p>
            </div>
            <Switch
              checked={draft.unitDetails.hideLocationDetails}
              onCheckedChange={(value) => update({ hideLocationDetails: value })}
              aria-label="Hide block, floor, and unit details when published"
            />
          </div>
        </div>
      </section>

      <div className="grid gap-6 sm:grid-cols-2">
        <section className="space-y-5">
          <div className="space-y-1">
            <h3 className="text-xl font-semibold text-foreground">Parking</h3>
          </div>
          <NumberStepper
            id="parking"
            label="Parking spots"
            value={draft.unitDetails.parkingSpots}
            onChange={(value) =>
              update({ parkingSpots: value === null ? 0 : value })
            }
            placeholderWhenZero
          />
        </section>

        <section className="space-y-5">
          <div className="space-y-1">
            <h3
              id="furnishing-label"
              className="text-xl font-semibold text-foreground"
            >
              Furnishing
            </h3>
            <p className="text-sm text-muted-foreground">
              Choose the furnishing level.
            </p>
          </div>
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-labelledby="furnishing-label"
            aria-describedby={errors.furnishing ? "furnishing-error" : undefined}
          >
            {furnishingOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => update({ furnishing: option.value })}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium capitalize transition",
                  draft.unitDetails.furnishing === option.value
                    ? "bg-foreground text-background shadow-sm"
                    : "border border-border/70 bg-background text-foreground hover:border-primary/40"
                )}
                aria-pressed={draft.unitDetails.furnishing === option.value}
              >
                {option.label}
              </button>
            ))}
          </div>
          {errors.furnishing ? (
            <p id="furnishing-error" className="text-sm text-destructive">
              {errors.furnishing}
            </p>
          ) : null}
        </section>
      </div>
    </div>
  );
}
