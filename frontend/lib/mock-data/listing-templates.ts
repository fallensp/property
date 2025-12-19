import type { MediaCollection } from '@/app/(listing)/listing/create/state/listing-store';

export type ListingTemplate = {
  headline: string;
  description: string;
  media: MediaCollection;
};

const SAMPLE_PHOTOS = [
  {
    url: 'https://images.unsplash.com/photo-1505692794403-35b0fd4d731b?auto=format&fit=crop&w=1200&q=80',
    tag: 'Exterior'
  },
  {
    url: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
    tag: 'Exterior'
  },
  {
    url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80',
    tag: 'Interior'
  },
  {
    url: 'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?auto=format&fit=crop&w=1200&q=80',
    tag: 'Facilities'
  },
  {
    url: 'https://images.unsplash.com/photo-1522158637959-30385a09e0da?auto=format&fit=crop&w=1200&q=80',
    tag: 'Exterior'
  }
];

export const defaultMedia: MediaCollection = {
  photos: SAMPLE_PHOTOS.map((item, index) => ({
    id: `photo-${index + 1}`,
    type: 'photo',
    fileName: `photo-${index + 1}.jpg`,
    url: item.url,
    order: index,
    altText: 'Property preview image',
    tag: item.tag,
    source: 'sample'
  })),
  videos: [],
  floorplans: [],
  virtualTours: [],
  projectPhotos: [],
  coverPhotoId: 'photo-1'
};

export const premiumResidenceTemplate: ListingTemplate = {
  headline: 'Luxurious 3-bedroom condo with skyline views',
  description:
    'Presenting a refined high-floor residence in the heart of the city. This 3-bedroom unit delivers expansive living areas, modern furnishings, and uninterrupted skyline views. Residents gain access to comprehensive facilities including an infinity pool, co-working lounge, and concierge services. Within minutes to MRT and top-tier amenities.',
  media: defaultMedia
};

export function getDefaultTemplate(): ListingTemplate {
  return premiumResidenceTemplate;
}
