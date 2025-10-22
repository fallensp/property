"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useListingStore } from "@/app/(listing)/listing/create/state/listing-store";

type StepProps = {
  errors: Record<string, string>;
};

const formatter = new Intl.NumberFormat("en-MY", {
  style: "currency",
  currency: "MYR",
  maximumFractionDigits: 0
});

export function PreviewStep(_: StepProps) {
  const draft = useListingStore((state) => state.draft);

  const orderedPhotos = draft.media.photos
    .slice()
    .sort((a, b) => a.order - b.order);
  const coverPhoto = draft.media.coverPhotoId
    ? orderedPhotos.find((photo) => photo.id === draft.media.coverPhotoId) ?? orderedPhotos[0]
    : orderedPhotos[0];
  const galleryPreview: typeof orderedPhotos = [
    coverPhoto,
    ...orderedPhotos.filter((photo) => (coverPhoto ? photo.id !== coverPhoto.id : true)).slice(0, 2)
  ].filter((photo): photo is typeof orderedPhotos[number] => Boolean(photo));

  const summaryItems = [
    {
      label: "Property category",
      value: draft.propertyCategory ? draft.propertyCategory : "—"
    },
    {
      label: "Listing purpose",
      value: draft.listingPurpose ? draft.listingPurpose : "—"
    },
    {
      label: "Availability",
      value:
        draft.availabilityMode === "immediate"
          ? "Immediately available"
          : `Available from ${draft.availableDate ?? 'TBD'}`
    },
    {
      label: "Location",
      value: draft.location?.developmentName ?? "Not selected"
    },
    {
      label: "Built-up",
      value: draft.unitDetails.builtUp
        ? `${draft.unitDetails.builtUp} sqft`
        : "—"
    },
    {
      label: "Bedrooms",
      value: draft.unitDetails.bedrooms ?? "—"
    },
    {
      label: "Bathrooms",
      value: draft.unitDetails.bathrooms ?? "—"
    },
    {
      label: "Selling price",
      value: draft.pricing.sellingPrice
        ? formatter.format(draft.pricing.sellingPrice)
        : "—"
    }
  ];

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[2fr_3fr]">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-foreground">
              Listing overview
            </CardTitle>
            <CardDescription>
              Review all captured data before handing off for implementation or
              publishing.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <dl className="space-y-3">
              {summaryItems.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <dt className="text-sm text-muted-foreground">{item.label}</dt>
                  <dd className="text-sm font-medium text-foreground">
                    {typeof item.value === 'string'
                      ? item.value
                      : String(item.value)}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-wrap gap-2">
              {draft.unitDetails.features.map((feature) => (
                <Badge key={feature} variant="secondary">
                  {feature}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-foreground">
              Marketing copy
            </CardTitle>
            <CardDescription>
              Headline and description will appear on the listing preview.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-lg font-semibold text-foreground">
                {draft.headline || 'Headline not provided'}
              </h4>
              <p className="whitespace-pre-line text-sm text-muted-foreground">
                {draft.description || 'Add a compelling description to help buyers fall in love with this property.'}
              </p>
            </div>
              <div className="space-y-2">
                <h5 className="text-sm font-semibold text-muted-foreground">
                  Media preview
                </h5>
                <div className="grid gap-2 sm:grid-cols-3">
                  {galleryPreview.map((photo) => (
                    <div
                      key={photo.id}
                      className="relative h-24 rounded-lg bg-cover bg-center"
                      style={{ backgroundImage: `url(${photo.url})` }}
                      aria-label={photo.altText ?? photo.fileName}
                    >
                      {coverPhoto && photo.id === coverPhoto.id && (
                        <span className="absolute left-2 top-2 rounded bg-primary px-2 py-1 text-[0.65rem] font-semibold text-primary-foreground">
                          Cover
                        </span>
                      )}
                    </div>
                  ))}
                  {draft.media.photos.length === 0 && (
                    <div className="h-24 rounded-lg border border-dashed border-border bg-muted/50 p-4 text-xs text-muted-foreground">
                      Media assets will appear here once uploaded.
                    </div>
                  )}
                </div>
              </div>
          </CardContent>
        </Card>
      </section>

      <section className="rounded-xl border border-border bg-background p-6 shadow-sm">
        <h3 className="text-lg font-semibold">Next steps</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Validate visuals and copy with stakeholders. Once approved, continue to
          implementation where component wiring, validation states, and media
          management will be completed.
        </p>
      </section>
    </div>
  );
}
