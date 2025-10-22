"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useListingStore } from "@/app/(listing)/listing/create/state/listing-store";
import { getDefaultTemplate } from "@/lib/mock-data/listing-templates";

type StepProps = {
  errors: Record<string, string>;
};

function wordCount(value: string) {
  if (!value.trim()) return 0;
  return value.trim().split(/\s+/).length;
}

export function DescriptionStep({ errors }: StepProps) {
  const draft = useListingStore((state) => state.draft);
  const updateNarrative = useListingStore((state) => state.updateNarrative);

  const defaultTemplate = useMemo(() => getDefaultTemplate(), []);

  const headline = draft.headline;
  const description = draft.description;

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-border bg-background p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold">Need inspiration?</h3>
            <p className="text-sm text-muted-foreground">
              Use the AI-assisted template as a starting point and tailor it for
              this property.
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              updateNarrative({
                headline: defaultTemplate.headline,
                description: defaultTemplate.description
              })
            }
          >
            Use suggested copy
          </Button>
        </div>
      </section>

      <section className="space-y-3">
        <Label htmlFor="headline">Headline *</Label>
        <Input
          id="headline"
          maxLength={70}
          placeholder="A short sentence to describe the highlights"
          value={headline}
          onChange={(event) =>
            updateNarrative({ headline: event.target.value, description })
          }
          aria-invalid={Boolean(errors.headline)}
          aria-describedby={errors.headline ? 'headline-error' : undefined}
        />
        <p className="text-xs text-muted-foreground">
          {headline.length}/70 characters used.
        </p>
        {errors.headline && (
          <p id="headline-error" className="text-sm text-destructive">
            {errors.headline}
          </p>
        )}
      </section>

      <section className="space-y-3">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          minLength={20}
          maxLength={2000}
          rows={10}
          placeholder="Describe the property, neighbourhood, and standout features."
          value={description}
          onChange={(event) =>
            updateNarrative({ headline, description: event.target.value })
          }
          aria-invalid={Boolean(errors.description)}
          aria-describedby={
            errors.description ? 'description-error' : undefined
          }
        />
        <div className="flex flex-wrap items-center justify-between text-xs text-muted-foreground">
          <span>{wordCount(description)} words</span>
          <span>{description.length}/2000 characters</span>
        </div>
        {errors.description && (
          <p id="description-error" className="text-sm text-destructive">
            {errors.description}
          </p>
        )}
      </section>
    </div>
  );
}
