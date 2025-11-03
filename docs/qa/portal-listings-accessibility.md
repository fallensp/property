# Accessibility Audit: Portal Listings Landing

Date: 2025-10-23  
Owner: Frontend Platform Team

## Automated Checks
- [x] Axe scans pass on `/portal/listings` with all filters applied
- [x] Playwright journey validates focusable elements and keyboard-only navigation for search, filters, tabs, and CTA
- [x] Lighthouse Accessibility score ≥ 95 on desktop throttled profile

## Manual Verification
- [x] Screen reader announces tab labels and counts (tested with VoiceOver)
- [x] Search input and filter controls expose programmatic labels and instructions
- [x] `More actions` and `Create listing` buttons include descriptive aria labels
- [x] Keyboard navigation order follows the visual layout without traps

## Follow-ups
- Track addition of bulk action menu items to ensure each entry exposes role `menuitem`
- Evaluate need for live region updates when filter counts update dynamically (queued for post-MVP review)
