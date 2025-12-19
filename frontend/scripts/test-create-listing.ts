
import { createListing } from "../lib/api/listings";

const TOKEN = "6|uMS59Ock0wvpre41K1UWt848Pkt0snUbFmOu4F270fb7fe6a";

const PAYLOAD = {
    developer_id: null,
    property_type_id: 1, // Bungalow / Villa
    property_sub_type_id: 1, // Bungalow
    property_unit_type_id: 1, // Intermediate
    title: "Backend Test Property",
    reference_number: "REF-TEST-001",
    status: "draft",
    listing_type: "sale",
    category: "residential",
    price_currency: "MYR",
    price_value: 123456,
    price_display: "RM 123,456",
    price_type: "fixed",
    available_from: null,
    tenure: null,
    completion_year: null,
    headline: "Backend Test Headline",
    description: "Backend Test Description",
    has_video: false,
    has_virtual_tour: false,
    has_floorplan: false,
    attributes: {
        bedrooms: 5,
        bathrooms: 4,
        maid_rooms: 1,
        parking: 2,
        built_up_sqft: 3000,
        furnishing: "fully",
    },
    metadata: {
        listing_purpose: "sale",
        availability_mode: "immediate",
        available_date: null,
        maintenance_fee: null,
        price_per_sqft: 41.15,
        features: [],
    },
    location: {
        development_name: "Backend Test Development",
        address_line1: "Test Address",
        address_line2: null,
        street: "Test Street",
        city: "Test City",
        state: "Test State",
        postal_code: "12345",
        country: "Malaysia",
        latitude: null,
        longitude: null,
        is_bumi_lot: false,
        title_type: null,
        tenure: null,
        google_place_id: null,
        google_plus_code: null,
        google_formatted_address: null,
        google_metadata: null,
    },
};

async function main() {
    try {
        console.log("Creating listing...");
        // @ts-ignore
        const listing = await createListing(TOKEN, PAYLOAD);
        console.log("Full Response:", JSON.stringify(listing, null, 2));
        // @ts-ignore
        if (listing.data) {
            // @ts-ignore
            console.log("Headline:", listing.data.headline);
            // @ts-ignore
            console.log("Attributes:", JSON.stringify(listing.data.attributes, null, 2));
        }
    } catch (error) {
        console.error("Error creating listing:", error);
    }
}

main();
