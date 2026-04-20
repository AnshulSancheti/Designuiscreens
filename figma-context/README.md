# PlacedOn Figma Context

This folder is the Figma-facing source of truth for frontend generation.

Use these files before generating or changing UI:

- `route-contract.md` - target routes and page ownership.
- `visual-identity.md` - visual rules to keep the app consistent.
- `data-contracts.md` - frontend data shape and service expectations.
- `pages/candidate-matches.md` - `/candidate/matches` page direction.
- `pages/candidate-interviews.md` - `/candidate/interviews` page direction.
- `pages/employer-dashboard.md` - `/employer` page direction.

## Ownership Rule

Figma AI owns visual React page/component implementation in this repo.

Codex-owned changes should be limited to non-visual contracts, page specs, route notes, and implementation guidance unless visual code changes are explicitly requested.

## Sync Rule

When Figma-generated frontend changes are complete, push this repo. The PlacedOn main repo can then pull this repo and copy the frontend into `PlacedOn/frontend`.
