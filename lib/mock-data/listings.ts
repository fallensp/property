export type ListingStatus = "online" | "draft" | "offline" | "expired";

export type ListingBadgeVariant = "premium" | "standard" | "info" | "warning";

export interface ListingBadge {
  label: string;
  variant: ListingBadgeVariant;
}

export interface ListingAttribute {
  icon: "bed" | "bath" | "car" | "size" | "unit";
  label: string;
}

export interface ListingMetrics {
  impressions: number;
  pageViews: number;
  enquiries: number;
}

export interface ListingSummary {
  id: string;
  title: string;
  address: string;
  price: string;
  priceValue: number;
  badges: ListingBadge[];
  attributes: ListingAttribute[];
  metrics: ListingMetrics;
  rotationInfo: string;
  visibility: string;
  expiryCopy: string;
  thumbnailUrl: string;
  status: ListingStatus;
  postedOn: string;
  listingType: "sale" | "rent";
  category: "residential" | "commercial" | "industrial";
  propertyType:
    | "Bungalow / Villa"
    | "Apartment / Condo / Service Residence"
    | "Semi-Detached House"
    | "Terrace / Link House"
    | "Residential Land";
  unitType?:
    | "Intermediate"
    | "Corner Lot"
    | "End Lot"
    | "Duplex"
    | "Triplex"
    | "Penthouse"
    | "Studio"
    | "Soho"
    | "Loft"
    | "Dual Key"
    | "Prefer not to say";
  upgradeTiers: string[];
  hasVideo: boolean;
  hasVirtualTour: boolean;
  hasFloorplan: boolean;
}

export const LISTING_THUMBNAIL_PLACEHOLDER =
  "/images/placeholders/listing-card.svg";

export const listings: ListingSummary[] = [
  {
    id: "IPP500273554",
    title: "Glenmarie Gardens",
    address: "Jalan Rektor U1/7, Saujana, 40150, Selangor",
    price: "RM 6,000,000",
    priceValue: 6000000,
    badges: [
      { label: "Residential", variant: "premium" },
      { label: "Sale", variant: "info" },
      { label: "Bungalow / Villa", variant: "standard" },
    ],
    attributes: [
      { icon: "bed", label: "6+1" },
      { icon: "bath", label: "8" },
      { icon: "car", label: "6" },
      { icon: "size", label: "Built-up: 6,355 sq.ft." },
    ],
    metrics: { impressions: 0, pageViews: 0, enquiries: 0 },
    rotationInfo: "Next rotation: 5 days",
    visibility: "Visibility: 1st page",
    expiryCopy: "Upgrade expiry: 26 days",
    thumbnailUrl: LISTING_THUMBNAIL_PLACEHOLDER,
    status: "online",
    postedOn: "21/10/2025",
    listingType: "sale",
    category: "residential",
    propertyType: "Bungalow / Villa",
    unitType: "Corner Lot",
    upgradeTiers: ["premium"],
    hasVideo: true,
    hasVirtualTour: true,
    hasFloorplan: true,
  },
  {
    id: "IPP500270959",
    title: "Glenmarie Gardens",
    address: "Jalan Rektor U1/7, Saujana, 40150, Selangor",
    price: "RM 6,000,000",
    priceValue: 6000000,
    badges: [
      { label: "Residential", variant: "standard" },
      { label: "Sale", variant: "info" },
      { label: "Bungalow / Villa", variant: "standard" },
    ],
    attributes: [
      { icon: "bed", label: "6+1" },
      { icon: "bath", label: "8" },
      { icon: "car", label: "6" },
      { icon: "size", label: "Built-up: 6,355 sq.ft." },
    ],
    metrics: { impressions: 0, pageViews: 0, enquiries: 0 },
    rotationInfo: "Next rotation: 8 days",
    visibility: "Visibility: Low",
    expiryCopy: "Upgrade expiry: 24 days",
    thumbnailUrl: LISTING_THUMBNAIL_PLACEHOLDER,
    status: "online",
    postedOn: "20/10/2025",
    listingType: "sale",
    category: "residential",
    propertyType: "Bungalow / Villa",
    unitType: "Corner Lot",
    upgradeTiers: ["standard"],
    hasVideo: false,
    hasVirtualTour: true,
    hasFloorplan: true,
  },
  {
    id: "IPP500268477",
    title: "USJ 5",
    address: "USJ 5, Subang Jaya, 47610, Selangor",
    price: "RM 2,150,000",
    priceValue: 2150000,
    badges: [
      { label: "Residential", variant: "standard" },
      { label: "Sale", variant: "info" },
      { label: "Terrace / Link House", variant: "standard" },
    ],
    attributes: [
      { icon: "bed", label: "4" },
      { icon: "bath", label: "3" },
      { icon: "car", label: "2" },
      { icon: "size", label: "Built-up: 3,400 sq.ft." },
    ],
    metrics: { impressions: 6, pageViews: 3, enquiries: 0 },
    rotationInfo: "Next rotation: 12 days",
    visibility: "Visibility: Low",
    expiryCopy: "Upgrade expiry: 27 days",
    thumbnailUrl: LISTING_THUMBNAIL_PLACEHOLDER,
    status: "online",
    postedOn: "20/10/2025",
    listingType: "sale",
    category: "residential",
    propertyType: "Terrace / Link House",
    unitType: "Intermediate",
    upgradeTiers: ["standard"],
    hasVideo: false,
    hasVirtualTour: false,
    hasFloorplan: true,
  },
  {
    id: "IPP500220001",
    title: "Damansara Uptown Loft",
    address: "Damansara Uptown, 47400 Petaling Jaya",
    price: "RM 950,000",
    priceValue: 950000,
    badges: [
      { label: "Draft", variant: "info" },
      { label: "Sale", variant: "info" },
      { label: "Loft", variant: "standard" },
    ],
    attributes: [
      { icon: "bed", label: "2" },
      { icon: "bath", label: "2" },
      { icon: "car", label: "1" },
      { icon: "size", label: "Built-up: 1,200 sq.ft." },
    ],
    metrics: { impressions: 0, pageViews: 0, enquiries: 0 },
    rotationInfo: "Draft last edited: 3 days ago",
    visibility: "Visibility: Preview",
    expiryCopy: "Complete details to publish",
    thumbnailUrl: LISTING_THUMBNAIL_PLACEHOLDER,
    status: "draft",
    postedOn: "—",
    listingType: "sale",
    category: "residential",
    propertyType: "Apartment / Condo / Service Residence",
    unitType: "Loft",
    upgradeTiers: [],
    hasVideo: false,
    hasVirtualTour: false,
    hasFloorplan: false,
  },
  {
    id: "IPP500210777",
    title: "Bangsar South Suites",
    address: "Bangsar South, 59200 Kuala Lumpur",
    price: "RM 3,200,000",
    priceValue: 3200000,
    badges: [
      { label: "Draft", variant: "info" },
      { label: "Sale", variant: "info" },
      { label: "Penthouse", variant: "standard" },
    ],
    attributes: [
      { icon: "bed", label: "4" },
      { icon: "bath", label: "4" },
      { icon: "car", label: "3" },
      { icon: "size", label: "Built-up: 2,900 sq.ft." },
    ],
    metrics: { impressions: 0, pageViews: 0, enquiries: 0 },
    rotationInfo: "Draft saved: 19/10/2025",
    visibility: "Visibility: Preview",
    expiryCopy: "Add media to publish",
    thumbnailUrl: LISTING_THUMBNAIL_PLACEHOLDER,
    status: "draft",
    postedOn: "—",
    listingType: "sale",
    category: "residential",
    propertyType: "Apartment / Condo / Service Residence",
    unitType: "Penthouse",
    upgradeTiers: [],
    hasVideo: true,
    hasVirtualTour: false,
    hasFloorplan: false,
  },
  {
    id: "IPP500188888",
    title: "Cheras Business Hub",
    address: "Cheras, 56000 Kuala Lumpur",
    price: "RM 12,800",
    priceValue: 12800,
    badges: [
      { label: "Commercial", variant: "standard" },
      { label: "Rent", variant: "info" },
      { label: "Service Residence", variant: "standard" },
    ],
    attributes: [
      { icon: "size", label: "Built-up: 1,500 sq.ft." },
      { icon: "unit", label: "High floor" },
    ],
    metrics: { impressions: 15, pageViews: 5, enquiries: 1 },
    rotationInfo: "Last online: 18/10/2025",
    visibility: "Visibility: Offline",
    expiryCopy: "Reason: Payment pending",
    thumbnailUrl: LISTING_THUMBNAIL_PLACEHOLDER,
    status: "offline",
    postedOn: "18/10/2025",
    listingType: "rent",
    category: "commercial",
    propertyType: "Apartment / Condo / Service Residence",
    unitType: "Prefer not to say",
    upgradeTiers: [],
    hasVideo: false,
    hasVirtualTour: false,
    hasFloorplan: false,
  },
  {
    id: "IPP500166654",
    title: "Eco City Residence",
    address: "Eco City, 59200 Kuala Lumpur",
    price: "RM 2,850,000",
    priceValue: 2850000,
    badges: [
      { label: "Residential", variant: "standard" },
      { label: "Sale", variant: "info" },
      { label: "Apartment / Condo / Service Residence", variant: "standard" },
    ],
    attributes: [
      { icon: "bed", label: "3" },
      { icon: "bath", label: "3" },
      { icon: "car", label: "2" },
      { icon: "size", label: "Built-up: 1,850 sq.ft." },
    ],
    metrics: { impressions: 29, pageViews: 2, enquiries: 0 },
    rotationInfo: "Posted: 19/10/2025",
    visibility: "Visibility: Low",
    expiryCopy: "Performance: 75% below avg.",
    thumbnailUrl: LISTING_THUMBNAIL_PLACEHOLDER,
    status: "expired",
    postedOn: "19/10/2025",
    listingType: "sale",
    category: "residential",
    propertyType: "Apartment / Condo / Service Residence",
    unitType: "Penthouse",
    upgradeTiers: ["featured"],
    hasVideo: false,
    hasVirtualTour: false,
    hasFloorplan: true,
  },
  {
    id: "IPP500122233",
    title: "Mont Kiara Duplex",
    address: "Mont Kiara, 50480 Kuala Lumpur",
    price: "RM 6,800,000",
    priceValue: 6800000,
    badges: [
      { label: "Expired", variant: "warning" },
      { label: "Sale", variant: "info" },
      { label: "Semi-Detached House", variant: "standard" },
    ],
    attributes: [
      { icon: "bed", label: "5" },
      { icon: "bath", label: "5" },
      { icon: "car", label: "4" },
      { icon: "size", label: "Built-up: 4,200 sq.ft." },
    ],
    metrics: { impressions: 0, pageViews: 0, enquiries: 0 },
    rotationInfo: "Expired: 15/10/2025",
    visibility: "Visibility: Expired",
    expiryCopy: "Renew to reactivate listing",
    thumbnailUrl: LISTING_THUMBNAIL_PLACEHOLDER,
    status: "expired",
    postedOn: "15/08/2025",
    listingType: "sale",
    category: "residential",
    propertyType: "Semi-Detached House",
    unitType: "Dual Key",
    upgradeTiers: [],
    hasVideo: true,
    hasVirtualTour: true,
    hasFloorplan: false,
  },
];

export const statusOrder: ListingStatus[] = [
  "online",
  "draft",
  "offline",
  "expired",
];
