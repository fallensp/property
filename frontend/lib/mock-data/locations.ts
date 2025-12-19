export type MockLocation = {
  developmentName: string;
  address: string;
  latitude: number;
  longitude: number;
  propertyType: string;
  propertySubType: string;
  propertyUnitType: string;
  state: string;
  city: string;
  street: string;
  postalCode: string;
  tenure: string;
  completionYear: string;
  titleType: string;
  bumiLot?: string;
};

export const mockLocations: MockLocation[] = [
  {
    developmentName: 'Skyline Residences',
    address: '123 Bukit Timah Road, Singapore',
    latitude: 1.3302,
    longitude: 103.7765,
    propertyType: 'Apartment / Condo / Service Residence',
    propertySubType: 'Service Residence',
    propertyUnitType: 'Intermediate',
    state: 'Selangor',
    city: 'Damansara Perdana',
    street: 'Jalan PJU 8/8A',
    postalCode: '47820',
    tenure: 'Leasehold',
    completionYear: '2013',
    titleType: 'Master',
    bumiLot: 'Do not specify'
  },
  {
    developmentName: 'Marina Terraces',
    address: '8 Marina View, Singapore',
    latitude: 1.2801,
    longitude: 103.8545,
    propertyType: 'Terrace / Link House',
    propertySubType: 'Townhouse',
    propertyUnitType: 'Dual Key',
    state: 'Kuala Lumpur',
    city: 'KL City Centre',
    street: 'Jalan Ampang',
    postalCode: '50450',
    tenure: 'Freehold',
    completionYear: '2018',
    titleType: 'Individual',
    bumiLot: 'No'
  },
  {
    developmentName: 'Emerald Hills Condominium',
    address: '88 Orchard Boulevard, Singapore',
    latitude: 1.3046,
    longitude: 103.8238,
    propertyType: 'Apartment / Condo / Service Residence',
    propertySubType: 'Condominium',
    propertyUnitType: 'Corner Lot',
    state: 'Selangor',
    city: 'Petaling Jaya',
    street: 'Jalan Universiti',
    postalCode: '46200',
    tenure: 'Freehold',
    completionYear: '2020',
    titleType: 'Strata',
    bumiLot: 'Do not specify'
  },
  {
    developmentName: 'Maple Twin Villas',
    address: '12 Robinson Road, Singapore',
    latitude: 1.2809,
    longitude: 103.8504,
    propertyType: 'Bungalow / Villa',
    propertySubType: 'Twin Villas',
    propertyUnitType: 'Duplex',
    state: 'Penang',
    city: 'George Town',
    street: 'Lebuh Pantai',
    postalCode: '10300',
    tenure: 'Leasehold',
    completionYear: '2015',
    titleType: 'Master',
    bumiLot: 'Yes'
  },
  {
    developmentName: 'Serenity Estate',
    address: 'Lot 42 Jalan Bukit, Malaysia',
    latitude: 4.2105,
    longitude: 101.9758,
    propertyType: 'Residential Land',
    propertySubType: 'Residential Land',
    propertyUnitType: 'Prefer not to say',
    state: 'Johor',
    city: 'Johor Bahru',
    street: 'Jalan Bukit Indah',
    postalCode: '79100',
    tenure: 'Freehold',
    completionYear: '2024',
    titleType: 'Individual',
    bumiLot: 'Do not specify'
  }
];

export function searchLocations(term: string): MockLocation[] {
  if (!term) return mockLocations;
  const lowered = term.toLowerCase();
  return mockLocations.filter(
    (location) =>
      location.developmentName.toLowerCase().includes(lowered) ||
      location.address.toLowerCase().includes(lowered)
  );
}
