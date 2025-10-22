"use client";

import { useCallback } from "react";
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
  value: NonNullable<UnitDetails['furnishing']>;
  label: string;
}> = [
  { value: 'fully', label: 'Fully furnished' },
  { value: 'partial', label: 'Partially furnished' },
  { value: 'unfurnished', label: 'Unfurnished' }
];

const featureOptions = [
  "Balcony",
  "Maid room",
  "Dry kitchen",
  "Wet kitchen",
  "Smart lock",
  "High ceiling",
  "Private lift"
];

export function UnitDetailsStep({ errors }: StepProps) {
  const draft = useListingStore((state) => state.draft);
  const updateUnitDetails = useListingStore((state) => state.updateUnitDetails);

  const update = useCallback(
    (partial: Partial<UnitDetails>) => {
      updateUnitDetails(partial);
    },
    [updateUnitDetails]
  );

  const toggleFeature = (feature: string) => {
    const features = draft.unitDetails.features.includes(feature)
      ? draft.unitDetails.features.filter((item) => item !== feature)
      : [...draft.unitDetails.features, feature];
    update({ features });
  };

  return (
    <div className="space-y-8">
      <section className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="bedrooms">Bedrooms *</Label>
          <Input
            id="bedrooms"
            type="number"
            min={0}
            value={draft.unitDetails.bedrooms ?? ""}
            onChange={(event) =>
              update({
                bedrooms:
                  event.target.value === ""
                    ? null
                    : Number.parseInt(event.target.value, 10)
              })
            }
            placeholder="0"
            aria-invalid={Boolean(errors.bedrooms)}
            aria-describedby={errors.bedrooms ? 'bedrooms-error' : undefined}
          />
          {errors.bedrooms && (
            <p id="bedrooms-error" className="text-sm text-destructive">
              {errors.bedrooms}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="bathrooms">Bathrooms *</Label>
          <Input
            id="bathrooms"
            type="number"
            min={0}
            value={draft.unitDetails.bathrooms ?? ""}
            onChange={(event) =>
              update({
                bathrooms:
                  event.target.value === ""
                    ? null
                    : Number.parseInt(event.target.value, 10)
              })
            }
            placeholder="0"
            aria-invalid={Boolean(errors.bathrooms)}
            aria-describedby={errors.bathrooms ? 'bathrooms-error' : undefined}
          />
          {errors.bathrooms && (
            <p id="bathrooms-error" className="text-sm text-destructive">
              {errors.bathrooms}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="maid-rooms">Maid / store rooms</Label>
          <Input
            id="maid-rooms"
            type="number"
            min={0}
            value={draft.unitDetails.maidRooms}
            onChange={(event) => update({ maidRooms: Number(event.target.value) })}
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="built-up">Built-up (sqft) *</Label>
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
            placeholder="Enter size"
            aria-invalid={Boolean(errors.builtUp)}
            aria-describedby={errors.builtUp ? 'built-up-error' : undefined}
          />
          {errors.builtUp && (
            <p id="built-up-error" className="text-sm text-destructive">
              {errors.builtUp}
            </p>
          )}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="built-up-width">Width (ft)</Label>
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
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="built-up-length">Length (ft)</Label>
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
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="parking">Parking spots</Label>
          <Input
            id="parking"
            type="number"
            min={0}
            value={draft.unitDetails.parkingSpots}
            onChange={(event) => update({ parkingSpots: Number(event.target.value) })}
            placeholder="0"
          />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="block">Block</Label>
          <Input
            id="block"
            maxLength={20}
            value={draft.unitDetails.block}
            onChange={(event) => update({ block: event.target.value })}
            placeholder="E.g. Tower A"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="floor">Floor</Label>
          <Input
            id="floor"
            maxLength={20}
            value={draft.unitDetails.floor}
            onChange={(event) => update({ floor: event.target.value })}
            placeholder="E.g. 12"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="unit-number">Unit no.</Label>
          <Input
            id="unit-number"
            maxLength={20}
            value={draft.unitDetails.unitNumber}
            onChange={(event) => update({ unitNumber: event.target.value })}
            placeholder="E.g. 12-03"
          />
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between rounded-lg border border-border/80 bg-background px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Hide precise unit details on published listing
            </p>
            <p className="text-xs text-muted-foreground">
              Buyers will still see the development and neighbourhood.
            </p>
          </div>
          <Switch
            checked={draft.unitDetails.hideLocationDetails}
            onCheckedChange={(value) => update({ hideLocationDetails: value })}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Furnishing *</h3>
        <div className="flex flex-wrap gap-2">
          {furnishingOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => update({ furnishing: option.value })}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium capitalize transition",
                draft.unitDetails.furnishing === option.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-muted/60 text-foreground hover:border-primary/50"
              )}
              aria-pressed={draft.unitDetails.furnishing === option.value}
            >
              {option.label}
            </button>
          ))}
        </div>
        {errors.furnishing && (
          <p id="furnishing-error" className="text-sm text-destructive">
            {errors.furnishing}
          </p>
        )}
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Unit features</h3>
        <p className="text-sm text-muted-foreground">
          Highlight optional features to attract the right buyers. These are
          optional and appear as badges on the listing.
        </p>
        <div className="flex flex-wrap gap-2">
          {featureOptions.map((feature) => {
            const selected = draft.unitDetails.features.includes(feature);
            return (
              <button
                key={feature}
                type="button"
                onClick={() => toggleFeature(feature)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-semibold transition",
                  selected
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background hover:border-primary/40 hover:bg-muted"
                )}
                aria-pressed={selected}
              >
                {feature}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
