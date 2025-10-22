import type { WizardStep } from '@/app/(listing)/listing/create/state/listing-store';

type StepMetadata = {
  title: string;
  description: string;
};

export const STEP_METADATA: Record<WizardStep, StepMetadata> = {
  listingType: {
    title: 'Listing Type',
    description: 'Choose property category, purpose, and availability.'
  },
  location: {
    title: 'Location',
    description: 'Search for the development and confirm the map position.'
  },
  unitDetails: {
    title: 'Unit Details',
    description: 'Provide size, rooms, and furnishing details.'
  },
  price: {
    title: 'Price',
    description: 'Capture pricing, maintenance, and display options.'
  },
  gallery: {
    title: 'Gallery',
    description: 'Curate listing media, set the cover image, and manage project assets.'
  },
  platform: {
    title: 'Platform Posting',
    description: 'Configure publication channels and scheduling (coming soon).'
  },
  preview: {
    title: 'Preview',
    description: 'Review all listing details before publishing.'
  }
};
