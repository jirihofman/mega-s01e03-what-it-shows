<script lang="ts">
  import raw from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { uniqueById, groupByCause, readAs, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';
  const reports = uniqueById(raw as Report[]).filter(r => r.mergedInto === 4471);
  const groups = groupByCause(reports, tenantOf);
  const mismatched = groups.reduce((n,g)=>n+g.reports.filter(r=>r.meta.intakeTag!==g.cause).length,0);
  const julyBacklog = reports.filter(r=>r.mergedAt?.startsWith('2026-07-02')).length;
</script>
<p>{raw.length} exported rows reduce to {reports.length} distinct reports; {raw.length-reports.length} overlapping rows are excluded. Intake tags disagree with the tenant-based cause for {mismatched} reports.</p>
{#each groups as g (g.cause)}
  {#if readAs(g, notes.oneDayMove)}
    <p>{readAs(g, notes.oneDayMove)} one-day-move descriptions remain included in {g.cause}, not a separate proven cause. Investigate these symptoms: {notes.oneDayMove.join(', ')}.</p>
  {/if}
{/each}
<p>The desk merged {julyBacklog} distinct reports on 2 July. This is processing activity; use received dates to assess arrival trends.</p>
