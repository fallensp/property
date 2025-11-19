# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 14 property listing application built with React 18, TypeScript, Tailwind CSS, and shadcn/ui components. It features a multi-step wizard for creating property listings and a portal for managing listings.

## Development Commands

### Core Commands
- **Development**: `npm run dev` - Start development server
- **Build**: `npm run build` - Build for production
- **Production**: `npm start` - Start production server
- **Lint**: `npm run lint` - Run ESLint checks
- **Type Check**: `npm run lint` also handles TypeScript checking

### Testing
- **Unit Tests**: `npm test` - Run Vitest unit tests
- **Watch Mode**: `npm run test:watch` - Run tests in watch mode
- **Update Snapshots**: `npm run test:update` - Update test snapshots
- **E2E Tests**: `npm run test:e2e` - Run Playwright end-to-end tests
- **E2E Headed**: `npm run test:e2e:headed` - Run E2E tests with browser UI

### Performance
- **Lighthouse CI**: `npm run lint:perf` - Run Lighthouse performance audits

## Architecture & Structure

### App Directory Structure (Next.js 14 App Router)
- **`app/(auth)/`** - Authentication pages (login, register)
- **`app/(listing)/listing/create/`** - Multi-step listing creation wizard
- **`app/(portal)/portal/`** - Listing management portal
- **`app/property/[id]/`** - Individual property detail pages
- **`app/layout.tsx`** - Root layout with theme provider

### Key State Management
- **Zustand Store**: `app/(listing)/listing/create/state/listing-store.ts`
  - Central state for the listing creation wizard
  - Handles step navigation, validation, and form data
  - Contains draft persistence and media management

### Core Libraries & Patterns
- **UI Framework**: shadcn/ui (Radix UI + Tailwind CSS)
- **State Management**: Zustand for client-side state
- **Validation**: Zod schemas in `lib/validation/schemas`
- **Mock Data**: Extensive mock data system in `lib/mock-data/`
- **Styling**: Tailwind CSS with CSS variables for theming

### Listing Creation Wizard
The main feature is an 8-step wizard for creating property listings:

1. **Listing Type** - Property category, listing purpose, availability
2. **Location** - Development search with autocomplete
3. **Unit Details** - Bedrooms, bathrooms, size, furnishing
4. **Price** - Selling price, maintenance fees, price per sqft
5. **Marketing Copy** - Headline and description with AI auto-fill
6. **Gallery** - Photo/video uploads with 5-photo minimum requirement
7. **Platform** - Publishing settings (anticipated)
8. **Preview** - Final review before publishing (anticipated)

### Component Architecture
- **Step Components**: Located in `app/(listing)/listing/create/components/steps/`
- **Shared Components**: `components/ui/` for shadcn/ui components
- **Portal Components**: `app/(portal)/portal/listings/components/`
- **Media Handling**: `components/media/` for photo/video management

### Data Models
Key TypeScript interfaces defined in the listing store:
- `ListingDraft` - Complete listing data structure
- `LocationSelection` - Property location and development details
- `UnitDetails` - Room counts, size, features
- `MediaCollection` - Photos, videos, floorplans, virtual tours
- `PlatformSettings` - Publishing configuration

### Mock Data System
- **Listings**: `lib/mock-data/listings.ts` - Sample property listings
- **Locations**: `lib/mock-data/locations.ts` - Development search data
- **Gallery**: `lib/mock-data/gallery.ts` - Sample photos and project media
- **Templates**: `lib/mock-data/listing-templates.ts` - Pre-filled listing templates

## Environment Configuration

### Theme System
- Theme toggle can be enabled via `NEXT_PUBLIC_ENABLE_THEME_TOGGLE=true`
- Default theme is dark mode with system preference detection
- Theme state stored in localStorage as 'property-theme'

### GitHub Pages Support
The app includes GitHub Pages deployment configuration:
- Automatic basePath detection from `GITHUB_REPOSITORY` environment variable
- Override with `NEXT_PUBLIC_BASE_PATH` for custom deployment paths
- Trailing slash enabled for static exports

### Validation Mode
- Strict validation can be enabled via `NEXT_PUBLIC_LISTING_WIZARD_STRICT=true`
- When disabled, allows bypassing validation for development/testing

## Testing Strategy

### Unit Testing (Vitest)
- Test files use `.test.ts` or `.test.tsx` extensions
- Component testing with React Testing Library
- Jest DOM matchers included globally

### E2E Testing (Playwright)
- Configuration in `playwright.config.ts`
- Tests located in `tests/` directory
- Supports cross-browser testing

## Development Guidelines

### Property Types
Reference `property_type.md` for complete property type hierarchy:
- **Main Categories**: Residential, Commercial, Industrial
- **Property Types**: Bungalow/Villa, Apartment/Condo, Semi-Detached, Terrace/Link House
- **Unit Types**: Intermediate, Corner Lot, End Lot, Duplex, Penthouse, etc.

### Design Requirements
The PRD (`prd.md`) contains detailed UI/UX specifications:
- Progressive step-based form with left sidebar navigation
- Responsive design for desktop and mobile
- Accessibility compliance (ARIA labels, keyboard navigation)
- Real-time validation with inline error messages
- 5-photo minimum requirement for gallery step

### Mock Data Usage
When working with data:
- Extend existing mock datasets rather than creating new ones
- Use the established data structures in `lib/mock-data/`
- Property metadata is managed via `lib/stores/property-metadata-store.ts`

### Component Development
- Follow shadcn/ui patterns for new components
- Use Tailwind CSS with the established design system
- Implement proper TypeScript types for all props
- Include appropriate ARIA attributes for accessibility

### State Management
- Use the existing Zustand store for listing-related state
- Validate data with Zod schemas before state updates
- Handle media uploads through the established MediaAsset system
- Maintain step validation status for wizard navigation