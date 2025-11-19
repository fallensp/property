import { create } from 'zustand';
import {
  locationSchema,
  pricingSchema,
  unitDetailsSchema
} from '@/lib/validation/schemas';
import {
  SAMPLE_PHOTO_LIBRARY,
  PROJECT_PHOTO_LIBRARY,
  type SamplePhoto
} from '@/lib/mock-data/gallery';
import { type ListingDetail } from '@/lib/mock-data/listing-details';

export type WizardStep =
  | 'listingType'
  | 'location'
  | 'unitDetails'
  | 'price'
  | 'marketingCopy'
  | 'gallery'
  | 'platform'
  | 'preview';

export type StepStatus = 'not-started' | 'in-progress' | 'complete' | 'blocked';

export type ValidationErrorMap = Record<string, string>;

export type StepValidationResult = {
  isValid: boolean;
  errors: ValidationErrorMap;
  message: string;
};

export type ListingDraft = {
  id: string;
  propertyName: string;
  propertyCategory: 'residential' | 'commercial' | 'industrial' | null;
  listingPurpose: 'sale' | 'rent' | null;
  auctioned: boolean;
  availabilityMode: 'immediate' | 'scheduled' | null;
  availableDate: string | null;
  coAgency: boolean;
  referenceNumber: string;
  location: LocationSelection | null;
  unitDetails: UnitDetails;
  pricing: Pricing;
  headline: string;
  description: string;
  media: MediaCollection;
  platformSettings: PlatformSettings;
  updatedAt: string;
};

export type LocationSelection = {
  searchTerm: string;
  developmentName: string;
  propertyTypeId?: number | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  propertyType?: string;
  propertySubTypeId?: number | null;
  propertySubType?: string;
  propertyUnitTypeId?: number | null;
  propertyUnitType?: string;
  state?: string;
  city?: string;
  street?: string;
  postalCode?: string;
  tenure?: string;
  completionYear?: string;
  titleType?: string;
  leaseYearsRemaining?: string;
  bumiLot?: string;
};

export type UnitDetails = {
  bedrooms: number | null;
  bathrooms: number | null;
  maidRooms: number;
  builtUp: number | null;
  builtUpWidth: number | null;
  builtUpLength: number | null;
  block: string;
  floor: string;
  unitNumber: string;
  hideLocationDetails: boolean;
  parkingSpots: number;
  furnishing: 'fully' | 'partial' | 'unfurnished' | null;
  features: string[];
};

export type Pricing = {
  priceType: 'none' | 'negotiable' | 'fixed' | 'poa';
  sellingPrice: number | null;
  maintenanceFee: number | null;
  pricePerSqft: number | null;
};

export type MediaAsset = {
  id: string;
  type: 'photo' | 'video' | 'floorplan' | 'virtualTour';
  fileName: string;
  url: string;
  thumbnailUrl?: string;
  sizeBytes?: number;
  altText?: string;
  order: number;
  tag?: string;
  referenceId?: string;
  source?: 'sample' | 'project' | 'upload';
};

export type MediaCollection = {
  photos: MediaAsset[];
  videos: MediaAsset[];
  floorplans: MediaAsset[];
  virtualTours: MediaAsset[];
  projectPhotos: MediaAsset[];
  coverPhotoId: string | null;
};

export type PlatformSettings = {
  publishIProperty: boolean;
  publishPropertyGuru: boolean;
  boost: boolean;
  scheduledPublish: boolean;
  scheduledDate: string | null;
};

type ListingStoreState = {
  draft: ListingDraft;
  currentStep: WizardStep;
  stepOrder: WizardStep[];
  statusByStep: Record<WizardStep, StepStatus>;
  errorsByStep: Partial<Record<WizardStep, ValidationErrorMap>>;
  validationBypassEnabled: boolean;
  isUpdateMode: boolean;
  goToStep: (step: WizardStep) => void;
  nextStep: () => void;
  previousStep: () => void;
  setStepStatus: (step: WizardStep, status: StepStatus) => void;
  setStepErrors: (step: WizardStep, errors: ValidationErrorMap) => void;
  clearStepErrors: (step: WizardStep) => void;
  validateStep: (step: WizardStep) => StepValidationResult;
  setValidationBypass: (enabled: boolean) => void;
  updateLocationFields: (fields: Partial<LocationSelection>) => void;
  addPhotos: (assets: MediaAsset[]) => void;
  addSamplePhotos: (count?: number) => void;
  removePhoto: (id: string) => void;
  movePhoto: (id: string, direction: 'left' | 'right') => void;
  setCoverPhoto: (id: string) => void;
  toggleProjectPhoto: (sampleId: string, selected: boolean) => void;
  selectAllProjectPhotos: (selected: boolean) => void;
  updateListingType: (
    payload: Partial<
      Pick<
        ListingDraft,
        | 'propertyName'
        | 'propertyCategory'
        | 'listingPurpose'
        | 'referenceNumber'
        | 'auctioned'
        | 'availabilityMode'
        | 'availableDate'
        | 'coAgency'
      >
    >
  ) => void;
  updateLocation: (payload: Partial<LocationSelection>) => void;
  updateUnitDetails: (payload: Partial<UnitDetails>) => void;
  updatePricing: (payload: Partial<Pricing>) => void;
  updateNarrative: (payload: { headline: string; description: string }) => void;
  setMedia: (payload: MediaCollection) => void;
  updatePlatformSettings: (payload: Partial<PlatformSettings>) => void;
  recalculatePricePerSqft: () => void;
  reset: () => void;
  loadFromExisting: (listingId: string, data: any) => void;
  resolvePropertyTypeIds: (propertyTypes: any[]) => void;
};

const stepOrder: WizardStep[] = [
  'listingType',
  'location',
  'unitDetails',
  'price',
  'marketingCopy',
  'gallery',
  'preview'
];

const defaultValidationBypassEnabled =
  process.env.NEXT_PUBLIC_LISTING_WIZARD_STRICT === 'true' ? false : true;

const createEmptyLocation = (): LocationSelection => ({
  searchTerm: '',
  developmentName: '',
  propertyTypeId: null,
  address: '',
  propertyType: '',
  propertySubTypeId: null,
  propertySubType: '',
  propertyUnitTypeId: null,
  propertyUnitType: '',
  state: '',
  city: '',
  street: '',
  postalCode: '',
  tenure: '',
  completionYear: '',
  titleType: '',
  leaseYearsRemaining: '',
  bumiLot: 'Do not specify'
});

const initialStepStatus = (): Record<WizardStep, StepStatus> =>
  stepOrder.reduce(
    (acc, step, index) => ({
      ...acc,
      [step]: index === 0 ? 'in-progress' : 'not-started'
    }),
    {} as Record<WizardStep, StepStatus>
  );

const markAllStepsComplete = (): Record<WizardStep, StepStatus> =>
  stepOrder.reduce(
    (acc, step) => ({
      ...acc,
      [step]: 'complete'
    }),
    {} as Record<WizardStep, StepStatus>
  );

const emptyMediaCollection = (): MediaCollection => ({
  photos: [],
  videos: [],
  floorplans: [],
  virtualTours: [],
  projectPhotos: [],
  coverPhotoId: null
});

const createInitialDraft = (): ListingDraft => ({
  id: crypto.randomUUID(),
  propertyName: '',
  propertyCategory: null,
  listingPurpose: null,
  auctioned: false,
  availabilityMode: 'immediate',
  availableDate: null,
  coAgency: false,
  referenceNumber: '',
  location: null,
  unitDetails: {
    bedrooms: null,
    bathrooms: null,
    maidRooms: 0,
    builtUp: null,
    builtUpWidth: null,
    builtUpLength: null,
    block: '',
    floor: '',
    unitNumber: '',
    hideLocationDetails: false,
    parkingSpots: 0,
    furnishing: null,
    features: []
  },
  pricing: {
    priceType: 'none',
    sellingPrice: null,
    maintenanceFee: null,
    pricePerSqft: null
  },
  headline: '',
  description: '',
  media: emptyMediaCollection(),
  platformSettings: {
    publishIProperty: true,
    publishPropertyGuru: false,
    boost: false,
    scheduledPublish: false,
    scheduledDate: null
  },
  updatedAt: new Date().toISOString()
});

const transformToListingDraft = (listingId: string, detail: ListingDetail): ListingDraft => {
  // Parse numeric values from strings
  const parseNumber = (str: string): number | null => {
    const cleaned = str.replace(/[^\d.]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? null : parsed;
  };

  // Map furnishing levels
  const mapFurnishing = (furnishing: string): 'fully' | 'partial' | 'unfurnished' | null => {
    const lower = furnishing.toLowerCase();
    if (lower.includes('full')) return 'fully';
    if (lower.includes('partial')) return 'partial';
    if (lower.includes('unfurnished')) return 'unfurnished';
    return null;
  };

  // Map price type
  const mapPriceType = (priceType: string): 'none' | 'negotiable' | 'fixed' | 'poa' => {
    switch (priceType) {
      case 'negotiable': return 'negotiable';
      case 'fixed': return 'fixed';
      case 'poa': return 'poa';
      default: return 'none';
    }
  };

  // Debug logging for property type data
  if (typeof window !== 'undefined') {
    console.log('Property Type Data from Detail:', {
      propertyType: detail.location.propertyType,
      propertySubType: detail.location.propertySubType,
      propertyUnitType: detail.location.propertyUnitType
    });
  }

  return {
    id: listingId,
    propertyName: detail.propertyName,
    propertyCategory: detail.propertyCategory as 'residential' | 'commercial' | 'industrial',
    listingPurpose: detail.listingPurpose,
    auctioned: false, // Default, not in detail data
    availabilityMode: detail.availabilityMode === 'immediate' ? 'immediate' : 'scheduled',
    availableDate: detail.availableDate || null,
    coAgency: false, // Default, not in detail data
    referenceNumber: detail.referenceNumber,
    location: {
      searchTerm: detail.location.developmentName,
      developmentName: detail.location.developmentName,
      propertyTypeId: null, // Will be resolved by metadata lookup
      address: detail.location.address,
      propertyType: detail.location.propertyType,
      propertySubTypeId: null, // Will be resolved by metadata lookup
      propertySubType: detail.location.propertySubType,
      propertyUnitTypeId: null, // Will be resolved by metadata lookup
      propertyUnitType: detail.location.propertyUnitType,
      tenure: detail.location.tenure,
      completionYear: detail.location.completionYear,
      // Default values for missing fields
      latitude: null,
      longitude: null,
      state: '',
      city: '',
      street: '',
      postalCode: '',
      titleType: '',
      leaseYearsRemaining: '',
      bumiLot: 'Do not specify'
    },
    unitDetails: {
      bedrooms: detail.unit.bedrooms,
      bathrooms: detail.unit.bathrooms,
      maidRooms: detail.unit.maidRooms || 0,
      builtUp: parseNumber(detail.unit.builtUp),
      builtUpWidth: null, // Not available in mock data
      builtUpLength: null, // Not available in mock data
      block: '', // Not available in mock data - could be extracted from address if needed
      floor: '', // Not available in mock data
      unitNumber: '', // Not available in mock data
      hideLocationDetails: false,
      parkingSpots: detail.unit.parking,
      furnishing: mapFurnishing(detail.unit.furnishing),
      features: detail.unit.features
    },
    pricing: {
      priceType: mapPriceType(detail.pricing.priceType),
      sellingPrice: parseNumber(detail.pricing.sellingPrice),
      maintenanceFee: parseNumber(detail.pricing.maintenanceFee),
      pricePerSqft: detail.pricing.pricePerSqft ? parseNumber(detail.pricing.pricePerSqft) : null
    },
    headline: detail.headline,
    description: detail.description,
    media: {
      photos: detail.gallery.map((item, index) => ({
        id: `gallery-${index}`,
        type: 'photo' as const,
        fileName: item.alt,
        url: item.src,
        altText: item.alt,
        order: index,
        source: 'upload' as const
      })),
      videos: [],
      floorplans: [],
      virtualTours: [],
      projectPhotos: [],
      coverPhotoId: detail.gallery.length > 0 ? 'gallery-0' : null
    },
    platformSettings: {
      publishIProperty: true,
      publishPropertyGuru: false,
      boost: false,
      scheduledPublish: false,
      scheduledDate: null
    },
    updatedAt: new Date().toISOString()
  };
};

export const useListingStore = create<ListingStoreState>((set, get) => ({
  draft: createInitialDraft(),
  currentStep: 'listingType',
  stepOrder,
  statusByStep: initialStepStatus(),
  errorsByStep: {},
  validationBypassEnabled: defaultValidationBypassEnabled,
  isUpdateMode: false,
  goToStep: (step) => {
    if (!stepOrder.includes(step)) {
      return;
    }
    set((state) => ({
      currentStep: step,
      statusByStep: {
        ...state.statusByStep,
        [step]:
          state.statusByStep[step] === 'complete'
            ? 'complete'
            : 'in-progress'
      }
    }));
  },
  nextStep: () => {
    const { currentStep } = get();
    const index = stepOrder.indexOf(currentStep);
    if (index === -1) return;
    const next = stepOrder[index + 1];
    if (!next) return;
    set((state) => ({
      currentStep: next,
      statusByStep: {
        ...state.statusByStep,
        [next]:
          state.statusByStep[next] === 'complete'
            ? 'complete'
            : 'in-progress'
      }
    }));
  },
  previousStep: () => {
    const { currentStep } = get();
    const index = stepOrder.indexOf(currentStep);
    const prev = stepOrder[index - 1];
    if (!prev) return;
    set((state) => ({
      currentStep: prev,
      statusByStep: {
        ...state.statusByStep,
        [prev]: 'in-progress'
      }
    }));
  },
  setStepStatus: (step, status) =>
    set((state) => ({
      statusByStep: { ...state.statusByStep, [step]: status }
    })),
  setStepErrors: (step, errors) =>
    set((state) => ({
      errorsByStep: { ...state.errorsByStep, [step]: errors }
    })),
  clearStepErrors: (step) =>
    set((state) => {
      const updated = { ...state.errorsByStep };
      delete updated[step];
      return { errorsByStep: updated };
    }),
  validateStep: (step) => {
    const draft = get().draft;
    return validateByStep(step, draft);
  },
  setValidationBypass: (enabled) =>
    set((state) => {
      if (enabled) {
        return {
          validationBypassEnabled: true,
          errorsByStep: {}
        };
      }

      const validation = validateByStep(state.currentStep, state.draft);
      return {
        validationBypassEnabled: false,
        errorsByStep: validation.isValid
          ? state.errorsByStep
          : {
            ...state.errorsByStep,
            [state.currentStep]: validation.errors
          },
        statusByStep: validation.isValid
          ? state.statusByStep
          : {
            ...state.statusByStep,
            [state.currentStep]: 'blocked'
          }
      };
    }),
  addPhotos: (assets) =>
    set((state) => ({
      draft: {
        ...state.draft,
        media: mergePhotos(state.draft.media, assets),
        updatedAt: new Date().toISOString()
      }
    })),
  addSamplePhotos: (count = 5) =>
    set((state) => ({
      draft: {
        ...state.draft,
        media: mergePhotos(state.draft.media, buildSampleAssets(state.draft.media.photos, count)),
        updatedAt: new Date().toISOString()
      }
    })),
  removePhoto: (id) =>
    set((state) => ({
      draft: {
        ...state.draft,
        media: removePhotoById(state.draft.media, id),
        updatedAt: new Date().toISOString()
      }
    })),
  movePhoto: (id, direction) =>
    set((state) => ({
      draft: {
        ...state.draft,
        media: movePhotoByDirection(state.draft.media, id, direction),
        updatedAt: new Date().toISOString()
      }
    })),
  setCoverPhoto: (id) =>
    set((state) => ({
      draft: {
        ...state.draft,
        media: setCoverPhotoId(state.draft.media, id),
        updatedAt: new Date().toISOString()
      }
    })),
  toggleProjectPhoto: (sampleId, selected) =>
    set((state) => ({
      draft: {
        ...state.draft,
        media: toggleProjectPhoto(state.draft.media, sampleId, selected),
        updatedAt: new Date().toISOString()
      }
    })),
  selectAllProjectPhotos: (selected) =>
    set((state) => ({
      draft: {
        ...state.draft,
        media: setAllProjectPhotos(state.draft.media, selected),
        updatedAt: new Date().toISOString()
      }
    })),
  updateListingType: (payload) =>
    set((state) => ({
      draft: {
        ...state.draft,
        ...payload,
        updatedAt: new Date().toISOString()
      }
    })),
  updateLocation: (payload) =>
    set((state) => ({
      draft: {
        ...state.draft,
        location: {
          ...(state.draft.location ?? createEmptyLocation()),
          ...payload
        },
        updatedAt: new Date().toISOString()
      }
    })),
  updateLocationFields: (fields) =>
    set((state) => ({
      draft: {
        ...state.draft,
        location: {
          ...(state.draft.location ?? createEmptyLocation()),
          ...fields
        },
        updatedAt: new Date().toISOString()
      }
    })),
  updateUnitDetails: (payload) =>
    set((state) => ({
      draft: {
        ...state.draft,
        unitDetails: {
          ...state.draft.unitDetails,
          ...payload
        },
        updatedAt: new Date().toISOString()
      }
    })),
  updatePricing: (payload) =>
    set((state) => {
      const draft = {
        ...state.draft,
        pricing: {
          ...state.draft.pricing,
          ...payload
        }
      };
      return {
        draft: {
          ...draft,
          pricing: {
            ...draft.pricing,
            pricePerSqft:
              payload.sellingPrice && state.draft.unitDetails.builtUp
                ? Number(
                  (
                    payload.sellingPrice /
                    state.draft.unitDetails.builtUp
                  ).toFixed(2)
                )
                : draft.pricing.pricePerSqft
          },
          updatedAt: new Date().toISOString()
        }
      };
    }),
  updateNarrative: ({ headline, description }) =>
    set((state) => ({
      draft: {
        ...state.draft,
        headline,
        description,
        updatedAt: new Date().toISOString()
      }
    })),
  setMedia: (payload) =>
    set((state) => ({
      draft: {
        ...state.draft,
        media: payload,
        updatedAt: new Date().toISOString()
      }
    })),
  updatePlatformSettings: (payload) =>
    set((state) => ({
      draft: {
        ...state.draft,
        platformSettings: {
          ...state.draft.platformSettings,
          ...payload
        },
        updatedAt: new Date().toISOString()
      }
    })),
  recalculatePricePerSqft: () =>
    set((state) => {
      const builtUp = state.draft.unitDetails.builtUp;
      const price = state.draft.pricing.sellingPrice;
      return {
        draft: {
          ...state.draft,
          pricing: {
            ...state.draft.pricing,
            pricePerSqft:
              builtUp && price ? Number((price / builtUp).toFixed(2)) : null
          },
          updatedAt: new Date().toISOString()
        }
      };
    }),
  reset: () =>
    set({
      draft: createInitialDraft(),
      statusByStep: initialStepStatus(),
      errorsByStep: {},
      validationBypassEnabled: defaultValidationBypassEnabled,
      currentStep: 'listingType',
      isUpdateMode: false
    }),
  loadFromExisting: (listingId, data) =>
    set({
      draft: transformToListingDraft(listingId, data),
      statusByStep: markAllStepsComplete(),
      errorsByStep: {},
      validationBypassEnabled: defaultValidationBypassEnabled,
      currentStep: 'listingType',
      isUpdateMode: true
    }),
  resolvePropertyTypeIds: (propertyTypes) => {
    const { draft } = get();
    if (!draft.location || !propertyTypes.length) return;

    // Find property type by name
    const propertyType = propertyTypes.find(
      (type: any) => type.name === draft.location?.propertyType
    );

    if (!propertyType) return;

    // Find sub type by name within the property type
    const subType = propertyType.sub_types?.find(
      (sub: any) => sub.name === draft.location?.propertySubType
    );

    // Find unit type by name within the sub type
    const unitType = subType?.unit_types?.find(
      (unit: any) => unit.name === draft.location?.propertyUnitType
    );

    // Update the location with resolved IDs
    if (propertyType.id || subType?.id || unitType?.id) {
      set(state => ({
        ...state,
        draft: {
          ...state.draft,
          location: {
            ...state.draft.location!,
            propertyTypeId: propertyType.id || null,
            propertySubTypeId: subType?.id || null,
            propertyUnitTypeId: unitType?.id || null
          }
        }
      }));

      if (typeof window !== 'undefined') {
        console.log('Resolved Property Type IDs:', {
          propertyType: draft.location.propertyType,
          propertyTypeId: propertyType.id,
          propertySubType: draft.location.propertySubType,
          propertySubTypeId: subType?.id,
          propertyUnitType: draft.location.propertyUnitType,
          propertyUnitTypeId: unitType?.id
        });
      }
    }
  }
}));

if (typeof window !== 'undefined') {
  // @ts-ignore
  window.__store = useListingStore;
}

const ensureOrder = (photos: MediaAsset[]): MediaAsset[] =>
  photos
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((photo, index) => ({ ...photo, order: index }));

const buildSampleAsset = (
  sample: SamplePhoto,
  order: number,
  source: 'sample' | 'project' = 'sample'
): MediaAsset => ({
  id: `${sample.id}-${crypto.randomUUID()}`,
  type: 'photo',
  fileName: sample.fileName,
  url: sample.url,
  altText: sample.label,
  order,
  tag: sample.tag,
  referenceId: sample.id,
  source
});

const buildSampleAssets = (
  existingPhotos: MediaAsset[],
  count: number
): MediaAsset[] => {
  const existingIds = new Set(
    existingPhotos
      .map((photo) => photo.referenceId)
      .filter((value): value is string => Boolean(value))
  );
  const available = SAMPLE_PHOTO_LIBRARY.filter(
    (sample) => !existingIds.has(sample.id)
  );
  const selected = available.slice(0, count);
  const startOrder = existingPhotos.length;
  return selected.map((sample, index) =>
    buildSampleAsset(sample, startOrder + index, 'sample')
  );
};

const mergePhotos = (
  media: MediaCollection,
  newAssets: MediaAsset[]
): MediaCollection => {
  if (newAssets.length === 0) {
    return media;
  }
  const combined = ensureOrder([...media.photos, ...newAssets]);
  const coverPhotoId = combined.some((photo) => photo.id === media.coverPhotoId)
    ? media.coverPhotoId
    : combined[0]?.id ?? null;
  return {
    ...media,
    photos: combined,
    coverPhotoId
  };
};

const removePhotoById = (
  media: MediaCollection,
  id: string
): MediaCollection => {
  const remaining = ensureOrder(media.photos.filter((photo) => photo.id !== id));
  const coverPhotoId = remaining.some((photo) => photo.id === media.coverPhotoId)
    ? media.coverPhotoId
    : remaining[0]?.id ?? null;
  return {
    ...media,
    photos: remaining,
    coverPhotoId
  };
};

const movePhotoByDirection = (
  media: MediaCollection,
  id: string,
  direction: 'left' | 'right'
): MediaCollection => {
  const ordered = ensureOrder(media.photos);
  const index = ordered.findIndex((photo) => photo.id === id);
  if (index === -1) {
    return media;
  }
  const targetIndex = direction === 'left' ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= ordered.length) {
    return media;
  }
  const swapped = ordered.slice();
  [swapped[index], swapped[targetIndex]] = [
    swapped[targetIndex],
    swapped[index]
  ];
  const normalized = ensureOrder(swapped);
  return {
    ...media,
    photos: normalized,
    coverPhotoId: normalized.some((photo) => photo.id === media.coverPhotoId)
      ? media.coverPhotoId
      : normalized[0]?.id ?? null
  };
};

const setCoverPhotoId = (
  media: MediaCollection,
  id: string
): MediaCollection => {
  if (!media.photos.some((photo) => photo.id === id)) {
    return media;
  }
  return {
    ...media,
    coverPhotoId: id,
    photos: ensureOrder(media.photos)
  };
};

const toggleProjectPhoto = (
  media: MediaCollection,
  sampleId: string,
  selected: boolean
): MediaCollection => {
  if (selected) {
    if (media.projectPhotos.some((photo) => photo.referenceId === sampleId)) {
      return media;
    }
    const sample = PROJECT_PHOTO_LIBRARY.find((item) => item.id === sampleId);
    if (!sample) {
      return media;
    }
    return {
      ...media,
      projectPhotos: [
        ...media.projectPhotos,
        buildSampleAsset(sample, media.projectPhotos.length, 'project')
      ]
    };
  }
  return {
    ...media,
    projectPhotos: media.projectPhotos.filter(
      (photo) => photo.referenceId !== sampleId
    )
  };
};

const setAllProjectPhotos = (
  media: MediaCollection,
  selected: boolean
): MediaCollection => {
  if (!selected) {
    return {
      ...media,
      projectPhotos: []
    };
  }
  return {
    ...media,
    projectPhotos: PROJECT_PHOTO_LIBRARY.map((sample, index) =>
      buildSampleAsset(sample, index, 'project')
    )
  };
};

const validateByStep = (
  step: WizardStep,
  draft: ListingDraft
): StepValidationResult => {
  const errors: ValidationErrorMap = {};

  const firstError = (fallback: string) =>
    Object.values(errors)[0] ?? fallback;

  switch (step) {
    case 'listingType': {
      if (!draft.propertyCategory) {
        errors.propertyCategory = 'Select a property category to proceed.';
      }
      if (!draft.listingPurpose) {
        errors.listingPurpose = 'Select whether the listing is for sale or rent.';
      }
      if (draft.availabilityMode === 'scheduled' && !draft.availableDate) {
        errors.availableDate = 'Choose an availability date for scheduled listings.';
      }
      return {
        isValid: Object.keys(errors).length === 0,
        errors: Object.keys(errors).length === 0 ? {} : errors,
        message: firstError('Listing basics captured.')
      };
    }
    case 'location': {
      if (!draft.location?.developmentName) {
        errors.developmentName = 'Choose a development before continuing.';
      } else {
        const parsed = locationSchema.safeParse(draft.location);
        if (!parsed.success) {
          errors.developmentName = 'Enter a valid development selection.';
        }
      }
      if (!draft.location?.propertyType) {
        errors.propertyType = 'Select a property type to continue.';
      }
      if (!draft.location?.propertySubType) {
        errors.propertySubType = 'Select a property subtype to continue.';
      }
      if (!draft.location?.propertyUnitType) {
        errors.propertyUnitType = 'Select a property unit type to continue.';
      }
      return {
        isValid: Object.keys(errors).length === 0,
        errors: Object.keys(errors).length === 0 ? {} : errors,
        message: firstError('Location confirmed.')
      };
    }
    case 'unitDetails': {
      const fields = draft.unitDetails;
      if (fields.bedrooms === null) {
        errors.bedrooms = 'Enter the number of bedrooms.';
      }
      if (fields.bathrooms === null) {
        errors.bathrooms = 'Enter the number of bathrooms.';
      }
      if (fields.builtUp === null || Number.isNaN(fields.builtUp) || fields.builtUp <= 0) {
        errors.builtUp = 'Provide the built-up size in sqft.';
      }
      if (!fields.furnishing) {
        errors.furnishing = 'Select a furnishing option.';
      }
      const parsed = unitDetailsSchema.safeParse({
        ...fields,
        bedrooms: fields.bedrooms ?? undefined,
        bathrooms: fields.bathrooms ?? undefined,
        builtUp: fields.builtUp ?? undefined
      });
      if (!parsed.success) {
        parsed.error.issues.forEach((issue) => {
          const key = issue.path[0];
          if (typeof key === 'string' && !errors[key]) {
            errors[key] = issue.message;
          }
        });
      }
      return {
        isValid: Object.keys(errors).length === 0,
        errors: Object.keys(errors).length === 0 ? {} : errors,
        message: firstError('Unit details captured.')
      };
    }
    case 'price': {
      if (!draft.pricing.sellingPrice || draft.pricing.sellingPrice <= 0) {
        errors.sellingPrice = 'Provide the selling price to continue.';
      }
      const parsed = pricingSchema.safeParse({
        ...draft.pricing,
        sellingPrice: draft.pricing.sellingPrice ?? undefined
      });
      if (!parsed.success) {
        parsed.error.issues.forEach((issue) => {
          const key = issue.path[0];
          if (typeof key === 'string' && !errors[key]) {
            errors[key] = issue.message;
          }
        });
      }
      return {
        isValid: Object.keys(errors).length === 0,
        errors: Object.keys(errors).length === 0 ? {} : errors,
        message: firstError('Pricing captured.')
      };
    }
    case 'marketingCopy': {
      if (!draft.description || draft.description.trim().length === 0) {
        errors.description = 'Add a description to continue.';
      }
      return {
        isValid: Object.keys(errors).length === 0,
        errors: Object.keys(errors).length === 0 ? {} : errors,
        message: firstError('Marketing copy captured.')
      };
    }
    case 'gallery': {
      if (draft.media.photos.length < 5) {
        errors.photos = 'Add at least 5 photos to continue.';
      }
      if (draft.media.photos.length > 0) {
        const hasCover = draft.media.coverPhotoId
          ? draft.media.photos.some((photo) => photo.id === draft.media.coverPhotoId)
          : false;
        if (!hasCover) {
          errors.coverPhotoId = 'Select a cover photo.';
        }
      }
      return {
        isValid: Object.keys(errors).length === 0,
        errors: Object.keys(errors).length === 0 ? {} : errors,
        message: firstError('Gallery ready for review.')
      };
    }
    case 'preview':
    case 'platform':
    default:
      return {
        isValid: true,
        errors: {},
        message: 'Review details and continue.'
      };
  }
};
