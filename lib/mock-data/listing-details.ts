import {
  LISTING_THUMBNAIL_PLACEHOLDER,
  listings,
  type ListingSummary,
} from "./listings";

type AvailabilityMode = "immediate" | "scheduled";
type PriceType = "negotiable" | "fixed" | "poa" | "none";
type FurnishingLevel = "Fully furnished" | "Partially furnished" | "Unfurnished";

export interface ListingDetail {
  id: string;
  summary: ListingSummary;
  referenceNumber: string;
  headline: string;
  description: string;
  propertyCategory: "residential" | "commercial" | "industrial";
  listingPurpose: "sale" | "rent";
  availabilityMode: AvailabilityMode;
  availableDate?: string;
  location: {
    developmentName: string;
    address: string;
    propertyType: string;
    propertySubType: string;
    propertyUnitType: string;
    tenure: string;
    completionYear: string;
  };
  unit: {
    builtUp: string;
    landArea?: string;
    bedrooms: number;
    bathrooms: number;
    maidRooms?: number;
    parking: number;
    furnishing: FurnishingLevel;
    features: string[];
  };
  pricing: {
    priceType: PriceType;
    sellingPrice: string;
    maintenanceFee: string;
    pricePerSqft?: string;
  };
  gallery: { src: string; alt: string }[];
}

const detailContent: Record<string, Omit<ListingDetail, "id" | "summary">> = {
  IPP500273554: {
    referenceNumber: "IPP500273554",
    headline: "Resort-style living with landscaped gardens",
    description:
      "This meticulously renovated villa balances open entertaining spaces with private bedroom wings overlooking a sculpted courtyard pool. Natural light pours through double-height windows while custom joinery anchors every room. Perfect for multigenerational living with flexible guest suites and a hidden office loft.",
    propertyCategory: "residential",
    listingPurpose: "sale",
    availabilityMode: "immediate",
    location: {
      developmentName: "Glenmarie Gardens",
      address: "Jalan Rektor U1/7, Saujana, 40150, Selangor",
      propertyType: "Bungalow / Villa",
      propertySubType: "Zero-Lot Bungalow",
      propertyUnitType: "Corner Lot",
      tenure: "Freehold",
      completionYear: "2018",
    },
    unit: {
      builtUp: "6,355 sq.ft.",
      landArea: "8,900 sq.ft.",
      bedrooms: 6,
      bathrooms: 8,
      maidRooms: 1,
      parking: 6,
      furnishing: "Fully furnished",
      features: [
        "Dual kitchen with chef-spec appliances",
        "Automated smart home and zoned AC",
        "Infinity-edge saltwater plunge pool",
        "Private wellness studio with sauna",
      ],
    },
    pricing: {
      priceType: "fixed",
      sellingPrice: "RM 6,000,000",
      maintenanceFee: "RM 980 / month",
      pricePerSqft: "RM 945",
    },
    gallery: [
      { src: LISTING_THUMBNAIL_PLACEHOLDER, alt: "Sunlit living hall" },
      { src: LISTING_THUMBNAIL_PLACEHOLDER, alt: "Pool deck at dusk" },
      { src: LISTING_THUMBNAIL_PLACEHOLDER, alt: "Master suite with courtyard views" },
    ],
  },
  IPP500270959: {
    referenceNumber: "IPP500270959",
    headline: "Classic family residence with mature gardens",
    description:
      "Crisp interiors, generous bedrooms and a sunlit family lounge that opens out to a pergola dining deck. Perfect for families seeking privacy and ample outdoor space for weekend gatherings.",
    propertyCategory: "residential",
    listingPurpose: "sale",
    availabilityMode: "scheduled",
    availableDate: "15/11/2025",
    location: {
      developmentName: "Glenmarie Gardens",
      address: "Jalan Rektor U1/7, Saujana, 40150, Selangor",
      propertyType: "Bungalow / Villa",
      propertySubType: "Bungalow",
      propertyUnitType: "Corner Lot",
      tenure: "Freehold",
      completionYear: "2015",
    },
    unit: {
      builtUp: "5,980 sq.ft.",
      landArea: "8,200 sq.ft.",
      bedrooms: 5,
      bathrooms: 6,
      parking: 4,
      furnishing: "Partially furnished",
      features: [
        "Vaulted ceiling great room",
        "En-suite bedrooms across all floors",
        "Separate annex pantry for guests",
        "Manicured lawn with irrigation system",
      ],
    },
    pricing: {
      priceType: "negotiable",
      sellingPrice: "RM 6,000,000",
      maintenanceFee: "RM 780 / month",
      pricePerSqft: "RM 1,004",
    },
    gallery: [
      { src: LISTING_THUMBNAIL_PLACEHOLDER, alt: "Family lounge with garden view" },
      { src: LISTING_THUMBNAIL_PLACEHOLDER, alt: "Kitchen with island counter" },
      { src: LISTING_THUMBNAIL_PLACEHOLDER, alt: "Pergola deck for outdoor dining" },
    ],
  },
  IPP500268477: {
    referenceNumber: "IPP500268477",
    headline: "Extended terrace with indoor-outdoor living flow",
    description:
      "Upgraded terrace with spacious open-plan ground floor and landscaped backyard that doubles as an al fresco studio. Sun tunnels brighten the reading nook while a concealed pantry keeps the kitchen clutter-free.",
    propertyCategory: "residential",
    listingPurpose: "sale",
    availabilityMode: "immediate",
    location: {
      developmentName: "USJ 5",
      address: "USJ 5, Subang Jaya, 47610, Selangor",
      propertyType: "Terrace / Link House",
      propertySubType: "2-storey Terrace House",
      propertyUnitType: "Intermediate",
      tenure: "Freehold",
      completionYear: "2012",
    },
    unit: {
      builtUp: "3,400 sq.ft.",
      landArea: "2,520 sq.ft.",
      bedrooms: 4,
      bathrooms: 3,
      parking: 2,
      furnishing: "Partially furnished",
      features: [
        "Custom carpentry library wall",
        "Retractable awning for backyard events",
        "Dedicated laundry and drying courtyard",
        "Energy-efficient skylights with UV filters",
      ],
    },
    pricing: {
      priceType: "negotiable",
      sellingPrice: "RM 2,150,000",
      maintenanceFee: "RM 180 / month",
      pricePerSqft: "RM 632",
    },
    gallery: [
      { src: LISTING_THUMBNAIL_PLACEHOLDER, alt: "Open plan living and dining area" },
      { src: LISTING_THUMBNAIL_PLACEHOLDER, alt: "Backyard studio setup" },
      { src: LISTING_THUMBNAIL_PLACEHOLDER, alt: "Master bedroom with bay window" },
    ],
  },
  IPP500220001: {
    referenceNumber: "IPP500220001",
    headline: "Loft sanctuary with skyline panoramas",
    description:
      "Perched high in Damansara Uptown, this loft delivers dramatic double-volume living framed by metropolitan vistas. A floating staircase leads to a glass-encased study while the primary suite offers a bespoke walk-in wardrobe.",
    propertyCategory: "residential",
    listingPurpose: "sale",
    availabilityMode: "scheduled",
    availableDate: "01/12/2025",
    location: {
      developmentName: "Damansara Uptown Loft",
      address: "Damansara Uptown, 47400 Petaling Jaya",
      propertyType: "Apartment / Condo / Service Residence",
      propertySubType: "Loft",
      propertyUnitType: "Loft",
      tenure: "Leasehold",
      completionYear: "2020",
    },
    unit: {
      builtUp: "1,200 sq.ft.",
      bedrooms: 2,
      bathrooms: 2,
      parking: 1,
      furnishing: "Fully furnished",
      features: [
        "Automated blinds across double-height windows",
        "Custom floating media console and shelving",
        "Chef-standard galley kitchen with quartz tops",
        "Hotel-inspired bathrooms with backlit mirrors",
      ],
    },
    pricing: {
      priceType: "fixed",
      sellingPrice: "RM 950,000",
      maintenanceFee: "RM 580 / month",
      pricePerSqft: "RM 792",
    },
    gallery: [
      { src: LISTING_THUMBNAIL_PLACEHOLDER, alt: "Double-volume living area" },
      { src: LISTING_THUMBNAIL_PLACEHOLDER, alt: "Mezzanine study with glass balustrade" },
      { src: LISTING_THUMBNAIL_PLACEHOLDER, alt: "Primary suite with city night view" },
    ],
  },
  IPP500210777: {
    referenceNumber: "IPP500210777",
    headline: "Sky penthouse with private entertainment deck",
    description:
      "Occupying the top floor of Bangsar South Suites, this penthouse boasts a wraparound terrace, custom show kitchen and a tranquil bedroom wing.",
    propertyCategory: "residential",
    listingPurpose: "sale",
    availabilityMode: "immediate",
    location: {
      developmentName: "Bangsar South Suites",
      address: "Bangsar South, 59200 Kuala Lumpur",
      propertyType: "Apartment / Condo / Service Residence",
      propertySubType: "Penthouse",
      propertyUnitType: "Penthouse",
      tenure: "Leasehold",
      completionYear: "2021",
    },
    unit: {
      builtUp: "2,900 sq.ft.",
      bedrooms: 4,
      bathrooms: 4,
      parking: 3,
      furnishing: "Fully furnished",
      features: [
        "Wraparound terrace with outdoor kitchen",
        "Entertainment lounge with projection wall",
        "Hotel-style primary suite with skyline tub",
        "Dedicated utility room & helper quarters",
      ],
    },
    pricing: {
      priceType: "negotiable",
      sellingPrice: "RM 3,200,000",
      maintenanceFee: "RM 1,120 / month",
      pricePerSqft: "RM 1,103",
    },
    gallery: [
      { src: LISTING_THUMBNAIL_PLACEHOLDER, alt: "Terrace sunset view" },
      { src: LISTING_THUMBNAIL_PLACEHOLDER, alt: "Great room with custom bar" },
      { src: LISTING_THUMBNAIL_PLACEHOLDER, alt: "Primary suite spa bathroom" },
    ],
  },
  IPP500188888: {
    referenceNumber: "IPP500188888",
    headline: "Flexible retail suite in thriving commercial hub",
    description:
      "High-floor retail suite featuring a 30-foot glass facade, built-in pantry and modular lighting rails. Ideal for premium showrooms or boutique concepts.",
    propertyCategory: "commercial",
    listingPurpose: "rent",
    availabilityMode: "immediate",
    location: {
      developmentName: "Cheras Business Hub",
      address: "Cheras, 56000 Kuala Lumpur",
      propertyType: "Apartment / Condo / Service Residence",
      propertySubType: "Service Residence",
      propertyUnitType: "Prefer not to say",
      tenure: "Leasehold",
      completionYear: "2016",
    },
    unit: {
      builtUp: "1,500 sq.ft.",
      bedrooms: 0,
      bathrooms: 1,
      parking: 2,
      furnishing: "Partially furnished",
      features: [
        "30 ft floor-to-ceiling display frontage",
        "Dual access for customer and service entry",
        "Built-in reception with concealed storage",
        "Central AC with independent control",
      ],
    },
    pricing: {
      priceType: "fixed",
      sellingPrice: "RM 12,800 / month",
      maintenanceFee: "RM 420 / month",
    },
    gallery: [
      { src: LISTING_THUMBNAIL_PLACEHOLDER, alt: "Retail showcase frontage" },
      { src: LISTING_THUMBNAIL_PLACEHOLDER, alt: "Open floor plate with lighting rails" },
      { src: LISTING_THUMBNAIL_PLACEHOLDER, alt: "Pantry and storage area" },
    ],
  },
  IPP500166654: {
    referenceNumber: "IPP500166654",
    headline: "Corner residence redesigned with Scandinavian aesthetics",
    description:
      "Thoughtfully refreshed corner unit featuring muted timber tones, fluted panels and a calming palette. Oversized windows bathe the living areas in natural light.",
    propertyCategory: "residential",
    listingPurpose: "sale",
    availabilityMode: "scheduled",
    availableDate: "05/11/2025",
    location: {
      developmentName: "Eco City Residence",
      address: "Eco City, 59200 Kuala Lumpur",
      propertyType: "Apartment / Condo / Service Residence",
      propertySubType: "Service Residence",
      propertyUnitType: "Penthouse",
      tenure: "Leasehold",
      completionYear: "2019",
    },
    unit: {
      builtUp: "1,850 sq.ft.",
      bedrooms: 3,
      bathrooms: 3,
      parking: 2,
      furnishing: "Fully furnished",
      features: [
        "Light-filled corner layout with dual balconies",
        "Integrated workstation and modular shelving",
        "Primary suite with walk-through wardrobe",
        "Bathrooms upgraded with terrazzo tiles",
      ],
    },
    pricing: {
      priceType: "negotiable",
      sellingPrice: "RM 2,850,000",
      maintenanceFee: "RM 650 / month",
      pricePerSqft: "RM 1,540",
    },
    gallery: [
      { src: LISTING_THUMBNAIL_PLACEHOLDER, alt: "Living room with corner windows" },
      { src: LISTING_THUMBNAIL_PLACEHOLDER, alt: "Minimalist kitchen with island" },
      { src: LISTING_THUMBNAIL_PLACEHOLDER, alt: "Bedroom with calming palette" },
    ],
  },
  IPP500122233: {
    referenceNumber: "IPP500122233",
    headline: "Duplex retreat with private rooftop lounge",
    description:
      "Two expansive levels offering a seamless flow between formal entertaining spaces and intimate family zones. Rooftop lounge invites alfresco dinners with skyline views.",
    propertyCategory: "residential",
    listingPurpose: "sale",
    availabilityMode: "immediate",
    location: {
      developmentName: "Mont Kiara Duplex",
      address: "Mont Kiara, 50480 Kuala Lumpur",
      propertyType: "Semi-Detached House",
      propertySubType: "Semi-Detached House",
      propertyUnitType: "Dual Key",
      tenure: "Freehold",
      completionYear: "2014",
    },
    unit: {
      builtUp: "4,200 sq.ft.",
      landArea: "3,800 sq.ft.",
      bedrooms: 5,
      bathrooms: 5,
      parking: 4,
      furnishing: "Fully furnished",
      features: [
        "Double-volume foyer with designer chandelier",
        "Dual-key configuration for extended family",
        "Rooftop entertainment deck with wet bar",
        "Sound-insulated media room",
      ],
    },
    pricing: {
      priceType: "negotiable",
      sellingPrice: "RM 6,800,000",
      maintenanceFee: "RM 620 / month",
      pricePerSqft: "RM 1,619",
    },
    gallery: [
      { src: LISTING_THUMBNAIL_PLACEHOLDER, alt: "Grand double-volume foyer" },
      { src: LISTING_THUMBNAIL_PLACEHOLDER, alt: "Rooftop lounge with evening setup" },
      { src: LISTING_THUMBNAIL_PLACEHOLDER, alt: "Chef's kitchen with island" },
    ],
  },
};

export const listingDetails: ListingDetail[] = listings.map((listing) => {
  const detail = detailContent[listing.id];

  if (!detail) {
    return {
      id: listing.id,
      summary: listing,
      referenceNumber: listing.id,
      headline: listing.title,
      description: "Detailed description coming soon.",
      propertyCategory: listing.category,
      listingPurpose: listing.listingType,
      availabilityMode: "immediate",
      location: {
        developmentName: listing.title,
        address: listing.address,
        propertyType: listing.propertyType,
        propertySubType: listing.propertyType,
        propertyUnitType: listing.unitType ?? "Prefer not to say",
        tenure: "Freehold",
        completionYear: "—",
      },
      unit: {
        builtUp: "—",
        bedrooms: listing.attributes.find((item) => item.icon === "bed")
          ? Number(listing.attributes.find((item) => item.icon === "bed")?.label)
          : 0,
        bathrooms: listing.attributes.find((item) => item.icon === "bath")
          ? Number(listing.attributes.find((item) => item.icon === "bath")?.label)
          : 0,
        parking: listing.attributes.find((item) => item.icon === "car")
          ? Number(listing.attributes.find((item) => item.icon === "car")?.label)
          : 0,
        furnishing: "Unfurnished",
        features: [],
      },
      pricing: {
        priceType: "none",
        sellingPrice: listing.price,
        maintenanceFee: "—",
      },
      gallery: [{ src: LISTING_THUMBNAIL_PLACEHOLDER, alt: listing.title }],
    };
  }

  return {
    id: listing.id,
    summary: listing,
    ...detail,
  };
});

export function findListingDetail(id: string) {
  return listingDetails.find((detail) => detail.id === id);
}
