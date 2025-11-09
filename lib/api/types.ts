export interface ApiAgentSummary {
  id: string;
  full_name: string | null;
  developer_id: string | null;
}

export interface ApiAuthUser {
  id: number;
  name: string | null;
  email: string;
  agent: ApiAgentSummary | null;
}

export interface ApiListingLocation {
  development_name: string | null;
  address_line1: string | null;
  address_line2: string | null;
  street: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  is_bumi_lot: boolean | null;
  title_type: string | null;
  tenure: string | null;
  google_place_id: string | null;
  google_plus_code: string | null;
  google_formatted_address: string | null;
  google_metadata: Record<string, unknown> | null;
}

export interface ApiPropertyUnitTypeSummary {
  id: number;
  name: string;
  slug: string;
}

export interface ApiPropertySubTypeSummary {
  id: number;
  name: string;
  slug: string;
  unit_types?: ApiPropertyUnitTypeSummary[];
}

export interface ApiPropertyTypeSummary {
  id: number;
  name: string;
  slug: string;
  category: string;
  sub_types?: ApiPropertySubTypeSummary[];
}

export interface ApiListing {
  id: string;
  agent_id: string;
  developer_id: string | null;
  property_type_id: number | null;
  property_sub_type_id: number | null;
  property_unit_type_id: number | null;
  title: string;
  reference_number: string | null;
  status: string | null;
  listing_type: "sale" | "rent";
  category: string | null;
  price_currency: string | null;
  price_value: number | null;
  price_display: string | null;
  price_type: string | null;
  available_from: string | null;
  tenure: string | null;
  completion_year: string | null;
  headline: string | null;
  description: string | null;
  has_video: boolean | null;
  has_virtual_tour: boolean | null;
  has_floorplan: boolean | null;
  attributes: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
  property_type?: ApiPropertyTypeSummary | null;
  property_sub_type?: ApiPropertySubTypeSummary | null;
  property_unit_type?: ApiPropertyUnitTypeSummary | null;
  location?: ApiListingLocation | null;
  agent?: ApiAgentSummary | null;
  developer?: {
    id: string;
    name: string;
  } | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface ApiPaginatedLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface ApiPaginatedMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  per_page: number;
  to: number | null;
  total: number;
}

export interface ApiPaginatedResponse<T> {
  data: T[];
  links: ApiPaginatedLinks;
  meta: ApiPaginatedMeta;
}

export interface ApiPropertyUnitType extends ApiPropertyUnitTypeSummary {}

export interface ApiPropertySubType extends ApiPropertySubTypeSummary {
  unit_types: ApiPropertyUnitType[];
}

export interface ApiPropertyType extends ApiPropertyTypeSummary {
  sub_types: ApiPropertySubType[];
}

export interface LocationSuggestion {
  development_name: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  latitude: number | null;
  longitude: number | null;
  google_place_id: string | null;
}
