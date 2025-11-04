'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, ChevronUp, MapPin, Search } from 'lucide-react';

import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { listings } from '@/lib/mock-data/listings';
import { cn } from '@/lib/utils';

const navLinks = [
  'Property Listings',
  'New Launches',
  'Explore by Projects'
];

const listingPurposes = [
  { label: 'Sale', active: true },
  { label: 'Rent', active: false }
];

const propertyCategories = ['Residential', 'Commercial', 'Industrial'];

const propertyTypes = [
  'Bungalow / Villa',
  'Apartment / Condo / Service Residence',
  'Semi-Detached House',
  'Terrace / Link House',
  'Residential Land'
];

const unitTypes = [
  'Intermediate',
  'Corner Lot',
  'End Lot',
  'Duplex',
  'Triplex',
  'Penthouse',
  'Studio',
  'Soho',
  'Loft',
  'Dual Key',
  'Prefer not to say'
];

const availabilityOptions = [
  { label: 'Immediately available', value: 'immediate' },
  { label: 'Scheduled availability', value: 'scheduled' }
];

const furnishingOptions = ['Fully furnished', 'Partially furnished', 'Unfurnished'];

const pricingRanges = {
  minimum: 'E.g RM 5,000',
  maximum: 'E.g RM 10,000'
};

const locationFilters = [
  { label: 'All Locations', active: true },
  { label: 'Nearby', active: false }
];

const featuredListings = listings.slice(0, 6);

interface AccordionSection {
  id: string;
  title: string;
}

const accordionSections: AccordionSection[] = [
  { id: 'listing-purpose', title: 'Listing Purpose' },
  { id: 'categories', title: 'Property Categories' },
  { id: 'types', title: 'Property Types' },
  { id: 'unit-types', title: 'Unit Types' },
  { id: 'availability', title: 'Availability' },
  { id: 'furnishing', title: 'Furnishing' },
  { id: 'pricing', title: 'Pricing' }
];

export default function LandingPage() {
  const [openSection, setOpenSection] = useState<string>('listing-purpose');

  const toggleSection = (sectionId: string) => {
    setOpenSection((prev) => (prev === sectionId ? '' : sectionId));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background/80">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/branding/property-ai-logo.svg"
              alt="Property AI"
              width={150}
              height={32}
              className="h-6 w-auto"
            />
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground lg:flex">
            {navLinks.map((link) => (
              <button
                type="button"
                key={link}
                className={cn(
                  'transition hover:text-primary',
                  link === 'Property Listings' && 'text-primary'
                )}
              >
                {link}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle className="hidden sm:inline-flex" />
            <Button asChild className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90">
              <Link href="/login">Login or register</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <section className="flex flex-col gap-6 lg:flex-row">
          <aside className="flex w-full flex-col gap-6 lg:w-72">
            <Card className="border border-primary/60 bg-gradient-to-br from-primary/20 via-primary/30 to-primary/10 text-left">
              <CardContent className="space-y-4 p-5">
                <div className="flex items-center gap-3 text-primary-foreground">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-background shadow">
                    <MapPin className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-wide opacity-80">
                      Discover properties around you (5 KM)
                    </p>
                    <p className="text-sm font-medium opacity-90">
                      Explore nearby listings tailored to your search
                    </p>
                  </div>
                </div>
                <Button className="w-full rounded-full bg-background text-sm font-semibold text-primary hover:bg-background/90">
                  Explore Nearby
                </Button>
              </CardContent>
            </Card>

            {accordionSections.map((section) => (
              <Card key={section.id} className="overflow-hidden border-border/80 bg-card">
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold text-foreground"
                >
                  <span>
                    {section.title}
                  </span>
                  {openSection === section.id ? (
                    <ChevronUp className="h-4 w-4 text-primary" aria-hidden />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-primary" aria-hidden />
                  )}
                </button>

                {openSection === section.id ? (
                  <CardContent className="space-y-4 border-t border-border/60 bg-muted/20 p-5 text-sm">
                    {section.id === 'listing-purpose' && (
                      <div className="flex gap-2">
                        {listingPurposes.map((purpose) => (
                          <button
                            key={purpose.label}
                            type="button"
                            className={cn(
                              'flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition',
                              purpose.active
                                ? 'border-primary bg-primary text-primary-foreground'
                                : 'border-border bg-muted/40 text-muted-foreground hover:bg-muted/60'
                            )}
                          >
                            {purpose.label}
                          </button>
                        ))}
                      </div>
                    )}

                    {section.id === 'categories' && (
                      <div className="space-y-3 text-sm text-muted-foreground">
                        {propertyCategories.map((category) => (
                          <label key={category} className="flex items-center gap-2">
                            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-border" />
                            {category}
                          </label>
                        ))}
                      </div>
                    )}

                    {section.id === 'types' && (
                      <div className="space-y-3 text-sm text-muted-foreground">
                        {propertyTypes.map((type) => (
                          <label key={type} className="flex items-center gap-2">
                            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-border" />
                            {type}
                          </label>
                        ))}
                      </div>
                    )}

                    {section.id === 'unit-types' && (
                      <div className="space-y-3 text-sm text-muted-foreground">
                        {unitTypes.map((type) => (
                          <label key={type} className="flex items-center gap-2">
                            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-border" />
                            {type}
                          </label>
                        ))}
                      </div>
                    )}

                    {section.id === 'availability' && (
                      <div className="space-y-3 text-sm text-muted-foreground">
                        {availabilityOptions.map((option) => (
                          <label key={option.value} className="flex items-center gap-2">
                            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-border" />
                            {option.label}
                          </label>
                        ))}
                      </div>
                    )}

                    {section.id === 'furnishing' && (
                      <div className="space-y-3 text-sm text-muted-foreground">
                        {furnishingOptions.map((option) => (
                          <label key={option} className="flex items-center gap-2">
                            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-border" />
                            {option}
                          </label>
                        ))}
                      </div>
                    )}

                    {section.id === 'pricing' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold uppercase text-muted-foreground">
                            Minimum
                          </label>
                          <div className="mt-2 rounded-lg border border-border/60 bg-background px-3 py-2 text-sm text-muted-foreground">
                            {pricingRanges.minimum}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold uppercase text-muted-foreground">
                            Maximum
                          </label>
                          <div className="mt-2 rounded-lg border border-border/60 bg-background px-3 py-2 text-sm text-muted-foreground">
                            {pricingRanges.maximum}
                          </div>
                        </div>
                        <Button className="w-full rounded-full bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                          Filter Pricing
                        </Button>
                      </div>
                    )}
                  </CardContent>
                ) : null}
              </Card>
            ))}
          </aside>

          <section className="flex-1 space-y-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                    All Properties for Rent
                  </h1>
                  <p className="text-sm text-muted-foreground">735 listings curated for you</p>
                </div>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Search className="h-4 w-4" aria-hidden />
                  <span className="sr-only">Search listings</span>
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {locationFilters.map((filter) => (
                  <button
                    key={filter.label}
                    type="button"
                    className={cn(
                      'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition',
                      filter.active
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-muted/30 text-muted-foreground hover:bg-muted/60'
                    )}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {featuredListings.map((listing) => (
                <Card key={listing.id} className="overflow-hidden border-border/80 bg-card">
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={listing.thumbnailUrl}
                      alt={listing.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  </div>
                  <CardContent className="space-y-3 p-5">
                    <div className="space-y-1">
                      <h3 className="text-base font-semibold text-foreground">
                        {listing.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {listing.address}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <MapPin className="mr-1 inline h-3 w-3 text-primary" aria-hidden />
                      {listing.visibility}
                    </p>
                    <p className="text-lg font-semibold text-primary">{listing.price}</p>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      {listing.attributes.slice(0, 3).map((attr) => (
                        <Badge key={`${listing.id}-${attr.label}`} variant="secondary" className="rounded-full px-3 py-1 text-xs">
                          {attr.label}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-border pt-6 text-sm text-muted-foreground">
              <p>Showing {featuredListings.length} of 735 listings</p>
              <Button variant="outline" className="rounded-full px-6">
                View more listings
              </Button>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}
