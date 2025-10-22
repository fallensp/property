import { afterEach, describe, expect, it } from 'vitest';
import { useListingStore } from '@/app/(listing)/listing/create/state/listing-store';

describe('listing-store validation', () => {
  beforeEach(() => {
    const { setValidationBypass } = useListingStore.getState();
    setValidationBypass(false);
  });

  afterEach(() => {
    const { reset } = useListingStore.getState();
    reset();
  });

  it('requires listing type selections before proceeding', () => {
    const { validateStep, updateListingType } = useListingStore.getState();

    const initial = validateStep('listingType');
    expect(initial.isValid).toBe(false);
    expect(initial.errors.propertyCategory).toBeDefined();
    expect(initial.errors.listingPurpose).toBeDefined();

    updateListingType({
      propertyCategory: 'residential',
      listingPurpose: 'sale',
      auctioned: false,
      availabilityMode: 'immediate',
      availableDate: null,
      coAgency: false,
      referenceNumber: ''
    });

    const after = useListingStore.getState().validateStep('listingType');
    expect(after.isValid).toBe(true);
    expect(after.errors).toEqual({});
  });

  it('blocks pricing step until selling price provided', () => {
    const { validateStep, updatePricing } = useListingStore.getState();

    const initial = validateStep('price');
    expect(initial.isValid).toBe(false);
    expect(initial.errors.sellingPrice).toBeDefined();

    updatePricing({ sellingPrice: 1500000 });

    const after = useListingStore.getState().validateStep('price');
    expect(after.isValid).toBe(true);
  });

  it('allows navigation when validation bypass is enabled', () => {
    const { setValidationBypass, validateStep } = useListingStore.getState();

    setValidationBypass(true);
    const result = validateStep('listingType');
    expect(result.isValid).toBe(false);
    expect(useListingStore.getState().validationBypassEnabled).toBe(true);
  });

  it('requires extended location selections when strict mode is on', () => {
    const {
      setValidationBypass,
      updateLocation,
      validateStep
    } = useListingStore.getState();

    setValidationBypass(false);
    updateLocation({
      searchTerm: 'Empire',
      developmentName: 'Empire Damansara'
    });

    const result = validateStep('location');
    expect(result.isValid).toBe(false);
    expect(result.errors.propertyType).toBeDefined();
    expect(result.errors.propertyUnitType).toBeDefined();
  });
});
