import { z } from 'zod';

export const locationSchema = z.object({
  searchTerm: z.string().min(1),
  developmentName: z.string().min(1),
  address: z.string().optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  propertyType: z.string().min(1, 'Choose a property type'),
  propertySubType: z.string().min(1, 'Choose a property subtype'),
  propertyUnitType: z.string().min(1, 'Choose a property unit type'),
  state: z.string().optional(),
  city: z.string().optional(),
  street: z.string().optional(),
  postalCode: z.string().optional(),
  tenure: z.string().optional(),
  completionYear: z.string().optional(),
  titleType: z.string().optional(),
  leaseYearsRemaining: z.string().optional(),
  bumiLot: z.string().optional(),
  direction: z.string().optional()
});

export const unitDetailsSchema = z.object({
  bedrooms: z.number({ invalid_type_error: 'Bedrooms cannot be empty' })
    .int()
    .min(0),
  bathrooms: z.number({ invalid_type_error: 'Bathrooms cannot be empty' })
    .int()
    .min(0),
  maidRooms: z.number().int().min(0).default(0),
  builtUp: z.number().positive(),
  builtUpWidth: z.number().positive().optional().nullable(),
  builtUpLength: z.number().positive().optional().nullable(),
  block: z.string().max(20).optional().nullable().transform((value) => value ?? ''),
  floor: z.string().max(20).optional().nullable().transform((value) => value ?? ''),
  unitNumber: z
    .string()
    .max(20)
    .optional()
    .nullable()
    .transform((value) => value ?? ''),
  hideLocationDetails: z.boolean().default(false),
  parkingSpots: z.number().int().min(0).default(0),
  furnishing: z.enum(['fully', 'partial', 'unfurnished']),
  features: z.array(z.string()).default([])
});

export const pricingSchema = z
  .object({
    priceType: z.enum(['none', 'negotiable', 'fixed', 'poa']).default('none'),
    sellingPrice: z.number().positive(),
    maintenanceFee: z.number().min(0).optional().nullable(),
    pricePerSqft: z.number().min(0).optional().nullable()
  })
  .superRefine((value, ctx) => {
    if (value.priceType === 'fixed' && !value.sellingPrice) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['sellingPrice'],
        message: 'Selling price required for fixed listings'
      });
    }
  });

export const mediaAssetSchema = z.object({
  id: z.string(),
  type: z.enum(['photo', 'video', 'floorplan', 'virtualTour']),
  fileName: z.string(),
  url: z.string().url(),
  thumbnailUrl: z.string().url().optional(),
  sizeBytes: z.number().min(0).optional(),
  altText: z.string().optional(),
  order: z.number().int().min(0),
  tag: z.string().optional(),
  referenceId: z.string().optional(),
  source: z.enum(['sample', 'project', 'upload']).optional()
});

export const mediaCollectionSchema = z.object({
  photos: z.array(mediaAssetSchema).min(5, 'Add at least 5 photos'),
  videos: z.array(mediaAssetSchema).default([]),
  floorplans: z.array(mediaAssetSchema).default([]),
  virtualTours: z.array(mediaAssetSchema).default([]),
  projectPhotos: z.array(mediaAssetSchema).default([]),
  coverPhotoId: z.string().nullable()
}).superRefine((value, ctx) => {
  if (value.photos.length > 0) {
    const hasCover = value.coverPhotoId
      ? value.photos.some((photo) => photo.id === value.coverPhotoId)
      : false;
    if (!hasCover) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['coverPhotoId'],
        message: 'Select a cover photo.'
      });
    }
  }
});

export const platformSettingsSchema = z
  .object({
    publishIProperty: z.boolean(),
    publishPropertyGuru: z.boolean(),
    boost: z.boolean(),
    scheduledPublish: z.boolean(),
    scheduledDate: z.string().datetime().nullable().optional()
  })
  .superRefine((value, ctx) => {
    if (value.scheduledPublish && !value.scheduledDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['scheduledDate'],
        message: 'Provide a publish date when scheduling'
      });
    }
  });

export const listingDraftSchema = z.object({
  id: z.string().uuid(),
  propertyCategory: z.enum(['residential', 'commercial']),
  listingPurpose: z.enum(['sale', 'rent']),
  auctioned: z.boolean(),
  availabilityMode: z.enum(['immediate', 'scheduled']),
  availableDate: z.string().optional().nullable(),
  coAgency: z.boolean(),
  referenceNumber: z.string().max(250),
  location: locationSchema,
  unitDetails: unitDetailsSchema,
  pricing: pricingSchema,
  headline: z.string().min(10).max(70),
  description: z.string().min(20).max(2000),
  media: mediaCollectionSchema,
  platformSettings: platformSettingsSchema,
  updatedAt: z.string()
});

export type ListingDraftInput = z.infer<typeof listingDraftSchema>;
