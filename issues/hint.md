# booking-v3 date hint contradicts day-first tenant form parsing

**Reports covered: 33 distinct reports from source ticket #4471.**

booking-v3 displays MM/DD/YYYY while its day-first tenant form interprets dates in the tenant order. This is distinct from the shared parser bug. It affects form reports from alder.physio (de-DE), copper.studio (es-ES), and pale.harbour (pt-PT). R-41230 and R-41241 demonstrate the affected path. Align the hint and interpretation with tenant locale. Test the same tenant across form and app channels; a parser-only fix is insufficient.

## Evidence and scope

Source: kb export dated 2026-10-04. Seen 2026-04-17 through 2026-09-22, across 3 tenants. Counts come from `uniqueById`, `groupByCause`, and `causeOf` in `src/lib/kb/causes.ts`, joined to the tenant directory. Browser intake tags are not the cause: this group's tags are {'parser': 15, 'hint': 18}.

No one-day-move notes belong to this group.

## Acceptance

- Reproduce and verify the affected tenant/channel/form path described above.
- Add regression coverage for month/day reversal and verify unrelated date paths.
- Preserve report-ID counts; keep the other cause in its own issue.
- Confirm production behavior before declaring resolved; no fix is claimed here.

## Knowledge-base decision

See `src/routes/kb/decisions/0002-dedupe-by-cause/+page.svx` and `rendered/kb/decisions/0002-dedupe-by-cause/index.html`.

## Report membership

R-41230, R-41241, R-41251, R-41259, R-41262, R-41275, R-41294, R-41305, R-41308, R-41366, R-41372, R-41384, R-41387, R-41396, R-41400, R-41406, R-41415, R-41416, R-41418, R-41428, R-41439, R-41441, R-41449, R-41453, R-41456, R-41460, R-41472, R-41485, R-41493, R-41539, R-41572, R-41582, R-41584
