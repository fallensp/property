import { apiFetch } from "../lib/api/client";

const TOKEN = "6|uMS59Ock0wvpre41K1UWt848Pkt0snUbFmOu4F270fb7fe6a";
const LISTING_ID = "01K9M22YTR9P1PNFAPCRNAQVZP";

async function main() {
    try {
        console.log(`Fetching listing ${LISTING_ID}...`);
        const response = await apiFetch<any>(
            `/listings/${LISTING_ID}`,
            { token: TOKEN }
        );
        console.log("\n=== FULL API RESPONSE ===");
        console.log(JSON.stringify(response, null, 2));

        if (response.data) {
            console.log("\n=== KEY FIELDS ===");
            console.log("Headline:", response.data.headline);
            console.log("Description:", response.data.description);
            console.log("Attributes:", JSON.stringify(response.data.attributes, null, 2));
            console.log("Title:", response.data.title);
            console.log("Price Display:", response.data.price_display);
        }
    } catch (error) {
        console.error("Error fetching listing:", error);
    }
}

main();
