
import { fetchListing } from "../lib/api/listings";

const LISTING_ID = "01KAD80DY1JF17B9ADG6KQCHQ9";
const TOKEN = "mock-token"; // Assuming mock token is sufficient or I need to login first.

// Mocking fetch for the script context if needed, or relying on node's fetch
// But wait, the project uses a custom apiFetch which relies on process.env.NEXT_PUBLIC_API_BASE_URL
// I need to set that environment variable.

async function main() {
    try {
        console.log(`Fetching listing ${LISTING_ID}...`);
        const listing = await fetchListing(TOKEN, LISTING_ID);
        console.log("Listing data:", JSON.stringify(listing, null, 2));
    } catch (error) {
        console.error("Error fetching listing:", error);
    }
}

main();
