"use client";

import { useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PortalHeader } from "@/components/portal/portal-header";
import { usePortalAuth } from "@/app/(portal)/portal/hooks/use-portal-auth";
import { type ListingDetail } from "@/lib/mock-data/listing-details";

function DetailPlaceholder({ onBack }: { onBack: () => void }) {
  const router = useRouter();
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">Listing not found</h2>
        <p className="max-w-md text-sm text-muted-foreground">
          We couldn&apos;t locate the listing you&apos;re looking for. It may have been archived or
          removed. Return to the listings dashboard to continue exploring.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <Button onClick={onBack}>Back to listings</Button>
        <Button variant="outline" onClick={() => router.back()}>
          Go back
        </Button>
      </div>
    </div>
  );
}

function ListingGallery({ detail }: { detail: ListingDetail }) {
  const primaryImage = detail.gallery[0];
  const secondary = detail.gallery.slice(1, 4);

  return (
    <section className="space-y-4">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
        <Image
          src={primaryImage.src}
          alt={primaryImage.alt}
          width={1024}
          height={640}
          priority
          className="h-[320px] w-full object-cover sm:h-[400px] lg:h-[460px]"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-primary-foreground backdrop-blur">
            <Sparkles className="h-3 w-3 text-primary" aria-hidden />
            Gallery preview (media uploaded during creation will display here)
          </span>
        </div>
      </div>
      {secondary.length ? (
        <div className="grid gap-3 sm:grid-cols-3">
          {secondary.map((image) => (
            <div
              key={image.alt}
              className="relative overflow-hidden rounded-xl border border-border/60 bg-card"
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={480}
                height={320}
                className="h-32 w-full object-cover sm:h-28 md:h-32 lg:h-36"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70" />
              <span className="absolute bottom-2 left-3 text-xs font-medium text-white">
                {image.alt}
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function availabilityLabel(
  mode: ListingDetail["availabilityMode"],
  date?: string,
) {
  if (mode === "immediate") {
    return "Immediately available";
  }
  return date ? `Available from ${date}` : "Availability to be scheduled";
}

function priceTypeLabel(priceType: ListingDetail["pricing"]["priceType"]) {
  switch (priceType) {
    case "negotiable":
      return "Negotiable";
    case "fixed":
      return "Fixed price";
    case "poa":
      return "Price on application";
    case "none":
    default:
      return "Not specified";
  }
}

export function ListingDetailClient({
  detail,
  listingId,
}: {
  detail: ListingDetail | undefined;
  listingId: string;
}) {
  const router = useRouter();
  const user = usePortalAuth((state) => state.user);

  useEffect(() => {
    if (!user) {
      router.replace("/portal");
    }
  }, [router, user]);

  const summaryDetail = useMemo(() => detail, [detail]);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40 p-6">
        <p className="text-sm text-muted-foreground">Redirecting to login…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <PortalHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            className="inline-flex items-center gap-2 px-0 text-sm text-muted-foreground hover:text-foreground"
            onClick={() => router.push("/portal/listings")}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
            Back to listings
          </Button>
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="outline" asChild>
              <Link href="/listing/create">Open create flow</Link>
            </Button>
          </div>
        </div>

        {!summaryDetail ? (
          <DetailPlaceholder onBack={() => router.push("/portal/listings")} />
        ) : (
          <>
            <section className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {summaryDetail.summary.badges.map((badge) => (
                      <Badge
                        key={`${summaryDetail.summary.id}-${badge.label}`}
                        variant={badge.variant === "premium" ? "outline" : "secondary"}
                        className="uppercase tracking-wide"
                      >
                        {badge.label}
                      </Badge>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                      {summaryDetail.summary.title}
                    </h1>
                    <p className="max-w-2xl text-sm text-muted-foreground">
                      {summaryDetail.headline}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs uppercase text-muted-foreground">
                    <span>{summaryDetail.propertyCategory}</span>
                    <span>•</span>
                    <span>{summaryDetail.location.propertyType}</span>
                    <span>•</span>
                    <span>{summaryDetail.location.propertyUnitType}</span>
                    <span>•</span>
                    <span>
                      {summaryDetail.listingPurpose === "sale" ? "For sale" : "For rent"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-start gap-2 text-left lg:items-end lg:text-right">
                  <p className="text-2xl font-semibold text-foreground">
                    {summaryDetail.pricing.sellingPrice}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Badge variant="outline" className="border-primary/50 text-primary">
                      ID: {summaryDetail.summary.id}
                    </Badge>
                    <Badge variant="outline" className="border-border text-muted-foreground">
                      Ref: {summaryDetail.referenceNumber}
                    </Badge>
                  </div>
                </div>
              </div>
              <p className="max-w-4xl text-sm leading-7 text-muted-foreground">
                {summaryDetail.description}
              </p>
            </section>

            <ListingGallery detail={summaryDetail} />

            <section className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Key listing details</CardTitle>
                  <CardDescription>
                    Data captured from the Listing type and Scheduling steps.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-border/60 p-4">
                    <p className="text-xs uppercase text-muted-foreground">Property category</p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {summaryDetail.propertyCategory}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border/60 p-4">
                    <p className="text-xs uppercase text-muted-foreground">Listing purpose</p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {summaryDetail.listingPurpose === "sale" ? "Sale" : "Rent"}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border/60 p-4">
                    <p className="text-xs uppercase text-muted-foreground">Reference number</p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {summaryDetail.referenceNumber}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border/60 p-4">
                    <p className="text-xs uppercase text-muted-foreground">Availability</p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {availabilityLabel(
                        summaryDetail.availabilityMode,
                        summaryDetail.availableDate,
                      )}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Location details</CardTitle>
                  <CardDescription>
                    Information supplied during the Location step.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-border/60 p-4 sm:col-span-2">
                    <p className="text-xs uppercase text-muted-foreground">Development</p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {summaryDetail.location.developmentName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {summaryDetail.location.address}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border/60 p-4">
                    <p className="text-xs uppercase text-muted-foreground">Property type</p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {summaryDetail.location.propertyType}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border/60 p-4">
                    <p className="text-xs uppercase text-muted-foreground">Property subtype</p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {summaryDetail.location.propertySubType}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border/60 p-4">
                    <p className="text-xs uppercase text-muted-foreground">Unit type</p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {summaryDetail.location.propertyUnitType}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border/60 p-4">
                    <p className="text-xs uppercase text-muted-foreground">Tenure</p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {summaryDetail.location.tenure}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border/60 p-4">
                    <p className="text-xs uppercase text-muted-foreground">Completion year</p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {summaryDetail.location.completionYear}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Unit details</CardTitle>
                  <CardDescription>
                    Captured from the Unit details step including layout and features.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-border/60 p-4">
                    <p className="text-xs uppercase text-muted-foreground">Built-up</p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {summaryDetail.unit.builtUp}
                    </p>
                  </div>
                  {summaryDetail.unit.landArea ? (
                    <div className="rounded-lg border border-border/60 p-4">
                      <p className="text-xs uppercase text-muted-foreground">Land area</p>
                      <p className="mt-1 text-sm font-medium text-foreground">
                        {summaryDetail.unit.landArea}
                      </p>
                    </div>
                  ) : null}
                  <div className="rounded-lg border border-border/60 p-4">
                    <p className="text-xs uppercase text-muted-foreground">Bedrooms</p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {summaryDetail.unit.bedrooms}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border/60 p-4">
                    <p className="text-xs uppercase text-muted-foreground">Bathrooms</p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {summaryDetail.unit.bathrooms}
                    </p>
                  </div>
                  {typeof summaryDetail.unit.maidRooms === "number" ? (
                    <div className="rounded-lg border border-border/60 p-4">
                      <p className="text-xs uppercase text-muted-foreground">Maid rooms</p>
                      <p className="mt-1 text-sm font-medium text-foreground">
                        {summaryDetail.unit.maidRooms}
                      </p>
                    </div>
                  ) : null}
                  <div className="rounded-lg border border-border/60 p-4">
                    <p className="text-xs uppercase text-muted-foreground">Parking</p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {summaryDetail.unit.parking}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border/60 p-4">
                    <p className="text-xs uppercase text-muted-foreground">Furnishing</p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {summaryDetail.unit.furnishing}
                    </p>
                  </div>
                  {summaryDetail.unit.features.length ? (
                    <div className="sm:col-span-2">
                      <p className="text-xs uppercase text-muted-foreground">Features</p>
                      <ul className="mt-2 grid gap-2 text-sm text-foreground sm:grid-cols-2">
                        {summaryDetail.unit.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/40 px-3 py-2"
                          >
                            <Sparkles className="mt-1 h-3 w-3 text-primary" aria-hidden />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pricing</CardTitle>
                  <CardDescription>
                    Values supplied via the Pricing step including maintenance fees.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-border/60 p-4">
                    <p className="text-xs uppercase text-muted-foreground">Price type</p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {priceTypeLabel(summaryDetail.pricing.priceType)}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border/60 p-4">
                    <p className="text-xs uppercase text-muted-foreground">Selling price</p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {summaryDetail.pricing.sellingPrice}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border/60 p-4">
                    <p className="text-xs uppercase text-muted-foreground">Maintenance fee</p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {summaryDetail.pricing.maintenanceFee}
                    </p>
                  </div>
                  {summaryDetail.pricing.pricePerSqft ? (
                    <div className="rounded-lg border border-border/60 p-4">
                      <p className="text-xs uppercase text-muted-foreground">Price per sqft</p>
                      <p className="mt-1 text-sm font-medium text-foreground">
                        {summaryDetail.pricing.pricePerSqft}
                      </p>
                    </div>
                  ) : null}
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Marketing copy</CardTitle>
                  <CardDescription>
                    Headline and description that were provided within the marketing copy step.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p className="text-base font-semibold text-foreground">
                    {summaryDetail.headline}
                  </p>
                  <p className="whitespace-pre-line leading-6">{summaryDetail.description}</p>
                </CardContent>
              </Card>
            </section>

            <footer className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground md:flex-row md:items-center">
              <p>
                Listing created via the Property AI wizard. Use the create flow to update fields
                or change availability.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" asChild>
                  <Link href="/listing/create">Update listing details</Link>
                </Button>
                <Button asChild>
                  <Link href="/portal/listings">Return to portfolio</Link>
                </Button>
              </div>
            </footer>
          </>
        )}
      </main>
    </div>
  );
}
