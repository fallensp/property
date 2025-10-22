"use client";

import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  useListingStore,
  type Pricing
} from "@/app/(listing)/listing/create/state/listing-store";

type StepProps = {
  errors: Record<string, string>;
};

const priceTypes: Array<Pricing["priceType"]> = [
  "none",
  "negotiable",
  "fixed",
  "poa"
];

export function PriceStep({ errors }: StepProps) {
  const draft = useListingStore((state) => state.draft);
  const updatePricing = useListingStore((state) => state.updatePricing);
  const recalculatePricePerSqft = useListingStore(
    (state) => state.recalculatePricePerSqft
  );

  useEffect(() => {
    recalculatePricePerSqft();
  }, [draft.unitDetails.builtUp, draft.pricing.sellingPrice, recalculatePricePerSqft]);

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <Label htmlFor="price-type">Price type</Label>
        <Select
          value={draft.pricing.priceType}
          onValueChange={(value: Pricing["priceType"]) =>
            updatePricing({ priceType: value })
          }
        >
          <SelectTrigger id="price-type">
            <SelectValue placeholder="Select pricing type" />
          </SelectTrigger>
          <SelectContent>
            {priceTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type === "poa" ? "Price on application" : type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="selling-price">Selling price (RM) *</Label>
          <Input
            id="selling-price"
            type="number"
            min={0}
            value={draft.pricing.sellingPrice ?? ""}
            onChange={(event) =>
              updatePricing({
                sellingPrice:
                  event.target.value === ""
                    ? null
                    : Number.parseFloat(event.target.value)
              })
            }
            placeholder="Enter selling price"
            aria-invalid={Boolean(errors.sellingPrice)}
            aria-describedby={errors.sellingPrice ? 'selling-price-error' : undefined}
          />
          {errors.sellingPrice && (
            <p id="selling-price-error" className="text-sm text-destructive">
              {errors.sellingPrice}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="maintenance-fee">Monthly maintenance fee (RM)</Label>
          <Input
            id="maintenance-fee"
            type="number"
            min={0}
            value={draft.pricing.maintenanceFee ?? ""}
            onChange={(event) =>
              updatePricing({
                maintenanceFee:
                  event.target.value === ""
                    ? null
                    : Number.parseFloat(event.target.value)
              })
            }
            placeholder="Optional"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price-per-sqft">Price per sqft (RM)</Label>
          <Input
            id="price-per-sqft"
            type="number"
            min={0}
            value={draft.pricing.pricePerSqft ?? ""}
            onChange={(event) =>
              updatePricing({
                pricePerSqft:
                  event.target.value === ""
                    ? null
                    : Number.parseFloat(event.target.value)
              })
            }
            placeholder="Calculated automatically"
          />
          <p className="text-xs text-muted-foreground">
            Automatically calculated using built-up size. Override if you have a
            different target presentation.
          </p>
        </div>
        {errors.pricePerSqft && (
          <p className="text-sm text-destructive">{errors.pricePerSqft}</p>
        )}
      </section>
    </div>
  );
}
