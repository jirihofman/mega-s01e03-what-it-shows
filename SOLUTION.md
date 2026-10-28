# S01E03 — what it shows

The supplied classifier splits source ticket #4471 into **379 parser reports** and **33 form-hint reports**. There are 412 unique report IDs in 427 exported rows. Five one-day-move descriptions remain in the parser group, with uncertainty recorded. Browser intake tags disagree with tenant classification in 38 reports.

## Deliverables

- Signed decision: [0002 source](src/routes/kb/decisions/0002-dedupe-by-cause/+page.svx).
- Actual Svelte/MDsveX-rendered page: [HTML](rendered/kb/decisions/0002-dedupe-by-cause/index.html) and adjacent interactive JavaScript.
- [Rendered page screenshot](evidence/decision-preview.jpg).
- Issue drafts: [parser](issues/parser.md) and [hint](issues/hint.md).
- [Computed counts and complete report membership](evidence/analysis.json).

The original export files are preserved unchanged. The replacement decision remains proposed; engineering outcomes are attributed to the course update, and no independent production verification or desk approval is claimed. All report data is fictional course material from the provided export.

## Build and inspect

Use Node 24 or later with the exact development dependencies declared in package.json. Run `npm run analyze` and `npm run build`. The renderer uses the real MDsveX preprocessor, Svelte compiler, SSR renderer, and browser hydration. It resolves the export's Vite-style eager globs at build time, preserving their tenant and page-metadata inputs. The output includes the original shared layout, stylesheet, tables, chart, and interactive explorer.

Serve `rendered/` as a static directory, for example `python3 -m http.server 8763 --bind 127.0.0.1 --directory rendered`, then visit `/kb/decisions/0002-dedupe-by-cause/`. GitHub's file view shows HTML source; download or serve the directory to view the page. A full-page screenshot is included for direct review.

## Validation

- Executed the supplied TypeScript classifier and its `Intl.DateTimeFormat` locale logic.
- Checked disjoint cause memberships and full coverage of all 412 IDs.
- Verified all original archive files remain byte-identical.
- Built every exported page plus the new decision with Svelte and MDsveX.
- Inspected the new page in Chrome: counts, classifications, timeline and computed signature stamp appear.
- Changed the explorer's first channel from form to app: verdict changed from different causes to same cause; restored form and observed it change back.

The rendered output is a 2026-10-28 snapshot. Rebuild to refresh time-dependent stale warnings and changes in data. Published issues: [parser #1](https://github.com/jirihofman/mega-s01e03-what-it-shows/issues/1), completed after the course reported the parser fix; [hint #2](https://github.com/jirihofman/mega-s01e03-what-it-shows/issues/2), closed as not planned after booking-v3 retirement. The course update dates both outcomes to 5 October 2026.
