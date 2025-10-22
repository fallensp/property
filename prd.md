Create Listing Page – Layout & Field Requirements
Overview

The Create Listing flow is divided into a series of steps, presented in a left‑hand progress bar. Each step collects specific information and uses clear card‑style layouts with concise text and intuitive controls. Required fields are highlighted and validated before the user can proceed.

1. Listing Type

Layout:

Two horizontal card groups:

Property Category (two selectable cards side‑by‑side)

Listing Purpose (two selectable cards side‑by‑side)

Below these, optional toggles and date selection.

“Next” button at bottom right; progress indicator in sidebar.

Fields & Requirements:

Field	Control	Required?	Notes
Property Category	Selectable cards: Residential, Commercial
iproperty.com.my
	Yes	Only one can be active; cards show icons and example property types.
Listing Purpose	Selectable cards: Sale, Rent
iproperty.com.my
	Yes	Only one may be selected.
Auctioned Property	Checkbox	No	Indicates listing will be auctioned.
Availability	Selectable cards: Immediately, Choose a date	Yes	If “Choose a date,” display date picker.
Co‑Agency Listing	Checkbox	No	Marks the listing as co‑agency.
Listing Reference No.	Text field	No	Internal use only (max 250 characters).

Styling:

Cards should have a soft grey border, clear icon at top left and descriptive text below.

Selected cards use a filled background with primary brand colour.

Use small helper text below fields (“Bungalow, Condos, Terrace House,” etc.) to clarify categories.

2. Location

Layout:

Search bar at top (“Search by property name”) with a pinned interactive map taking up right half.

Minimalist design: search bar left, map right; no clutter below.

Fields & Requirements:

Field	Control	Required?	Notes
Property Search	Autocomplete search bar	Yes	User searches by development name or address; they must select a valid suggestion to proceed.
Map Confirmation	Google Map widget	Read‑only	Shows selected property. A tooltip may prompt user to confirm location accuracy.

Styling:

Use subtle border around the map to delineate it from the form.

Provide “Report issue regarding property location” link below the map (as shown) for location corrections.

3. Unit Details
iproperty.com.my

Layout:

Organized vertical sections: Rooms, Size, Floor Details, Parking, Furnishing, Unit Features.

Each numeric value uses a ± stepper; optional fields clearly labelled.

Responsive layout: on desktop, a decorative illustration appears on the right; on mobile, sections stack vertically.

Fields & Requirements:

Section	Field	Control	Required?	Notes
Rooms	Bedrooms	Numeric stepper	Yes	Min 0; show inline label “Bedrooms cannot be empty” on error.
	Bathrooms	Numeric stepper	Yes	Same style as Bedrooms.
	Maid/Store Rooms	Numeric stepper	No	Optional; labelled accordingly.
Size	Built‑up (sqft)	Numeric input with unit	Yes	Must be >0. Show unit suffix (“sqft”) in a small badge inside the input.
	Built‑up Dimensions	Two numeric inputs (Width, Length)	No	Each has a unit suffix (“ft”). Grouped horizontally.
Floor Details	Block, Floor, Unit/House No.	Text inputs	No	Optional; set side by side with dashes between. Include toggle to hide these details on published listing.
Parking	Parking spots	Numeric stepper	No	Display “Parking (optional)” heading.
Furnishing	Furnishing options	Button group (Fully Furnished, Partially Furnished, Unfurnished)	Yes	Show selected state with brand colour; include helper text if none selected.
Unit Features	Multi-select chips / checkboxes	No	Allow users to pick multiple features; optional; display as collapsible panel if list is long.	

Styling:

Use clear section headings with small sub‑title text (e.g., “Maid/Store rooms (optional)”) to differentiate optional fields.

Place error messages in small, red text directly under the offending input.

Stepper buttons use minimal square icons with +/– symbols.

4. Price
iproperty.com.my

Layout:

Simple stacked inputs with uniform width.

Currency prefix (“RM”) appears inside the input on the left; fields have consistent padding.

Fields & Requirements:

Field	Control	Required?	Notes
Price Type	Dropdown	No	Options such as “None,” “Negotiable,” “Fixed,” “Price on Application.” Default is “None.”
Selling Price (RM)	Numeric input	Yes	Must be positive; auto‑formats with thousands separators.
Monthly Maintenance Fee (RM)	Numeric input	No	For condos/strata units; optional.
Price per sqft (RM)	Numeric input	No	Can be auto‑calculated from built‑up and selling price or entered manually.

Styling:

Use red border highlight on the price input when empty, with error text “Price cannot be empty” if user tries to proceed without entering it.

Include subtle placeholder text (“Enter selling price”) to guide users.

5. Description
iproperty.com.my

Layout:

Optional “Auto‑fill with AI” card at the top with a call‑to‑action button.

Two stacked text areas: one for headline, one for full description.

Character/word counters aligned to the bottom right of each text area.

Fields & Requirements:

Field	Control	Required?	Validation	Notes
Auto‑fill with AI	Button	Optional	N/A	If clicked, prompts the system to generate headline and description; confirm before replacing.
Headline	Textarea (1‑line height)	Yes	10–70 characters	Use placeholder “A short sentence to describe the highlights.”
Description	Textarea (multi‑line)	Yes	Minimum 20 words; max 2,000 characters	Include guidelines (e.g., “Describe the property and its surroundings”).

Styling:

Show grey counter text (“0/70”, “0/2000”) on the bottom right of the fields. Update in real time.

If the minimum requirement isn’t met, display message like “A minimum of 20 words” next to the counter in red.

6. Gallery
iproperty.com.my

Layout:

A “Get started with media upload” panel at the top featuring four large tiles: Add Videos, Add Photos, Add Floorplans, Add Virtual Tours. Each tile has an icon, short description, and (for photos) the note “Minimum of 5 photos required.”

Sections below show uploaded media in horizontal rows: Photos, Videos, Floorplans, Virtual Tours, and Project Photos.

Each row has a small “+” button on the right to upload new files.

“Project Photos” row displays thumbnails of pre‑loaded images with a pencil/edit icon. “Deselect all” button removes them from the listing.

“Next” button remains disabled until at least 5 photos are uploaded.

Fields & Requirements:

Section	Required?	Notes
Photos	Yes (≥5)	Minimum 5 photos needed to proceed. Must be high resolution; each file validated for size and format. Drag‑and‑drop reorder supported.
Videos	No	Optional; uploads accepted if they meet size and format restrictions.
Floorplans	No	Optional; accepts floorplan images or PDFs.
Virtual Tours	No	Optional; allows embedding 3D tours via supported providers (Matterport, etc.).
Project Photos	No	Pre‑loaded images provided by developer. They don’t count toward the 5‑photo requirement; user can deselect.

Styling:

Use thumbnail grids; each thumbnail should have a small overlay icon for editing/renaming or deleting.

Display an orange/red alert at the top (“Add more photos to proceed”) when the minimum photo requirement isn’t met
iproperty.com.my
.

Keep the page responsive by using horizontal scroll for large numbers of media items.

7. Platform Posting (anticipated)

Layout:

Step with toggles/switches for each platform (e.g., iProperty, PropertyGuru).

Options grouped into “Basic Posting” and “Premium Features (Boost, Featured)” sections.

Scheduling section with date/time picker for delayed posting.

Footer with “Back” and “Next/Publish” buttons.

Fields & Requirements (expected):

Publish to iProperty (toggle) – required if listing should appear on iProperty.

Publish to PropertyGuru (toggle) – optional; hidden if agent doesn’t have subscription.

Boost Listing (checkbox) – optional; may show cost.

Scheduled Posting Date/Time – optional; if provided, must be in the future.

8. Preview (anticipated)

Layout:

Full‑width preview of the listing as it will appear on the portal.

Sticky summary sidebar on the right showing key fields (price, category, built‑up size, location).

Top bar with actions: Back, Save Draft, Publish.

All fields displayed as read‑only with edit buttons that jump back to the relevant section.

Key Elements:

Gallery Carousel – shows uploaded photos, with the first five displayed prominently.

Property Details Section – summarises room counts, built‑up area, features, furnishing.

Description Section – headline and full description.

Map – static map of selected location.

Platform Summary – shows which platforms listing will be posted to and scheduling details.

Styling:

Use consistent typography and spacing to mirror the final published listing.

Highlight any missing required elements with warnings if a user attempts to publish without meeting requirements (e.g., missing photos, incomplete fields).

Design & Usability Guidelines

Progress Tracking: The left‑hand progress bar should show a green checkmark for each completed step and a red exclamation mark if required fields are missing. Disabled steps remain greyed out until prerequisites are met.

Responsive Design: Ensure the form is usable on both desktop and mobile screens. On mobile, collapse sidebars and use accordion components for sections.

Consistency: Use the platform’s primary colour for actions (e.g., selected cards, buttons) and red/orange for errors. Maintain uniform margins and paddings.

Accessibility: All inputs should have ARIA labels, and the form should be fully navigable by keyboard. Provide focus states for interactive elements.

Feedback: Provide real‑time validation feedback so users know why a field is invalid before clicking “Next.” Use inline messages rather than modals where possible.

Save & Exit: Always offer a “Save & Exit” option for users to save drafts without completing all steps. Indicate unsaved changes before navigating away.

This focused PRD should give designers and developers a clear blueprint of the fields and layout styling required to build the Create Listing flow up to the preview stage.