<!--
Sync Impact Report
Version change: N/A → 1.0.0
Modified principles: Created I. Code Quality Excellence; Created II. Verified Testing Discipline; Created III. Consistent Experience Commitment; Created IV. Performance Guardrails
Added sections: Core Principles; Quality Gates & Metrics; Delivery Workflow & Review; Governance
Removed sections: None
Templates requiring updates: .specify/templates/plan-template.md ✅ updated; .specify/templates/spec-template.md ✅ updated; .specify/templates/tasks-template.md ✅ updated; .specify/templates/commands (N/A) ✅ no files present
Follow-up TODOs: None
-->
# Property Project Constitution

## Core Principles

### I. Code Quality Excellence
- Every change MUST pass automated linting, formatting, and static analysis configured for the target stack.
- Code MUST remain modular with clear ownership boundaries; new dependencies require documented justification in plan.md.
- Pull requests MUST document the impact on existing architecture and highlight risk areas for reviewers.
Rationale: Maintaining high-quality code reduces regressions, keeps the codebase approachable, and lowers long-term maintenance cost.

### II. Verified Testing Discipline
- Feature work MUST include automated tests that fail without the feature and succeed once complete; tests cover happy paths, edge cases, and regressions.
- UI flows MUST include scripted journeys (integration or E2E) that exercise the user-facing behavior described in specs.
- Continuous Integration MUST block merges unless the full test suite passes and coverage for touched files stays at or above 80%.
Rationale: Reliable, automated testing is essential to detect regressions early and protect delivery velocity.

### III. Consistent Experience Commitment
- User flows MUST follow the approved interaction patterns, copy, and design tokens documented in approved specs or design references.
- Accessibility MUST meet WCAG 2.1 AA equivalents: keyboard navigation, focus management, and assistive labels cannot regress.
- Validation, error feedback, and progressive disclosure MUST behave consistently across flow steps, matching spec acceptance criteria.
Rationale: A predictable experience builds user trust, reduces support load, and keeps the product aligned with brand standards.

### IV. Performance Guardrails
- Initial load for any workflow step MUST keep Largest Contentful Paint under 2.5s on mid-tier hardware and 3G Fast profiles.
- Interactive actions (form validation, state transitions) MUST respond within 150ms at p95; long operations require visible progress affordances.
- Backend APIs powering the listing flow MUST maintain <200ms p95 latency under expected peak load; deviations require explicit mitigation plans.
Rationale: Strong performance maintains usability for agents on constrained networks and protects conversion-critical funnels.

## Quality Gates & Metrics
- Plans MUST document code quality impacts, dependency changes, and mitigation strategies before implementation begins (Principle I).
- Specs MUST define acceptance tests, UX walkthroughs, and accessibility checkpoints covering all prioritized stories (Principle III).
- Implementation MUST ship with automated test coverage matching new or updated behaviors and update regression suites (Principle II).
- Performance budgets stated in specs MUST be measured and reported before handoff; failing budgets block release until remediated (Principle IV).

## Delivery Workflow & Review
- Work initiates with research and planning deliverables (`plan.md`, `spec.md`, `tasks.md`) capturing quality, testing, UX, and performance commitments.
- Each pull request MUST reference the relevant deliverables, list executed automated checks, and summarize performance measurements.
- Reviewers MUST enforce principle compliance; violations require remediation or an approved rollout plan before merge.
- Releases MUST include a verification checklist capturing test runs, UX smoke checks, and performance snapshots.

## Governance
- This constitution supersedes conflicting process guidance; all contributors must certify compliance in reviews.
- Amendments require consensus from at least two maintainers, documentation of rationale, and updates to affected templates before adoption.
- Versioning follows Semantic Versioning: MAJOR for breaking governance changes, MINOR for new principles or substantive policy expansion, PATCH for clarifications.
- Compliance is reviewed quarterly via audits of recent plans, specs, and release retrospectives; findings drive corrective actions.

**Version**: 1.0.0 | **Ratified**: 2025-10-22 | **Last Amended**: 2025-10-22
