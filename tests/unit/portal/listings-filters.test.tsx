import { describe, expect, it } from 'vitest';

import {
  DEFAULT_FILTERS,
  filterListing,
  sortListings,
} from '@/app/(portal)/portal/listings/hooks/use-listings-filter';
import { listings } from '@/lib/mock-data/listings';

describe('Listings filter utilities', () => {
  const sample = listings;

  it('matches listings by search term and status', () => {
    const filters = { ...DEFAULT_FILTERS, searchTerm: 'Glenmarie' };

    const matches = sample.filter((listing) =>
      filterListing(listing, filters, 'online'),
    );

    expect(matches).toHaveLength(2);
    matches.forEach((listing) =>
      expect(listing.title).toMatch(/Glenmarie/i),
    );
  });

  it('applies media filters for video and virtual tour', () => {
    const filters = {
      ...DEFAULT_FILTERS,
      more: { ...DEFAULT_FILTERS.more, video: true, 'virtual-tour': true },
    };

    const matches = sample.filter((listing) =>
      filterListing(listing, filters, 'online'),
    );

    expect(matches).toHaveLength(1);
    expect(matches[0]?.title).toContain('Glenmarie Gardens');
  });

  it('sorts by price descending', () => {
    const sorted = sortListings(sample.slice(0, 3), 'price_desc');
    expect(sorted[0]?.priceValue).toBeGreaterThanOrEqual(sorted[1]?.priceValue ?? 0);
  });
});
