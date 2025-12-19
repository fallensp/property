import { render, screen, within } from '@testing-library/react';
import { listings } from '@/tests/fixtures/listings';
import { ListingsTable } from '@/app/(portal)/portal/listings/components/listings-table';

describe('ListingsTable', () => {
  it('renders listing cards with key metadata', () => {
    render(<ListingsTable listings={listings.slice(0, 1)} viewMode="list" />);

    const card = screen.getByRole('article', { name: /glenmarie gardens/i });
    expect(card).toBeInTheDocument();
    expect(within(card).getByText(/RM 6,000,000/i)).toBeInTheDocument();
    expect(within(card).getByText(/Built-up: 6,355 sq.ft./i)).toBeInTheDocument();
    expect(within(card).getByText(/Visibility:/i)).toBeInTheDocument();
  });

  it('shows empty state when no listings available', () => {
    render(<ListingsTable listings={[]} viewMode="list" />);

    expect(
      screen.getByText(/no listings match your filters/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /create listing/i }),
    ).toBeInTheDocument();
  });
});
