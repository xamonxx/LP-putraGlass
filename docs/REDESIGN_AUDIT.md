# Putra Glass V3 — audit, 20 October 2026

Baseline: Next 15.5.28, React 19.3.1, TypeScript strict, CSS Modules, static export. `npm run build` passed before changes: homepage 127 kB route / 230 kB first-load JS, shared 103 kB; post-build inlined 8.4 kB CSS. Earlier browser run: 23/27 passed; fresh-export rerun recorded in QA report. Lint and `tsc --noEmit --incremental false` passed during planning.

Existing dirty work retained: .gitignore, IMPLEMENTATION_REPORT.md, ConfiguratorSection.tsx, CookieBanner.tsx, HeroSection.tsx, tsconfig.tsbuildinfo; untracked Playwright configuration, tests, and configurator CSS. No reset, clean, or checkout of these changes.

Reusable: responsive PictureImage / image metadata, lead validation and endpoint fallback, phone/UTM helpers, Radix, existing business options and form draft. Current configurator is a quotation tool, not a pricing calculator. Its limits are 30–200 cm; separate lead form accepts 20–300 cm. Preserve both.

Issues: fixture testimonials rendered as verified; unconfirmed warranty values; example price exposed as live structured offer; scripts loaded before affirmative consent; tracking did not recheck consent; catalog selection did not reach configurator; SVG preview was not true 3D. Forced clicks and early hydration in existing tests can miss actual interactions.

Tokopedia access is blocked by browser policy. No listing data was imported or verified. User approved existing local assets and clearly labeled approximate visualization. Local PRD documents catalog renders and workshop/installation photographs; that provenance does not verify marketplace availability or product dimensions. No external site access workaround.

User choices: local references; no public prices; two desktop-only pinned stories with native scrolling; no checkout or deployment to a new hosting service.

## Final verification

Fresh baseline export: 27/27 browser tests passed; the four historical failures did not reproduce. Final V3: build, lint, strict TypeScript and 57/57 automated tests passed. Homepage first-load JS 215 kB. Read QA_REPORT.md for regression fixes, exact performance measurements, external-service limits and physical-device work not performed.
