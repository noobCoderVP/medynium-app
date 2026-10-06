import { DataState } from '@/components/shared/data-state';
import { RecordRow } from '@/components/shared/record-row';
import { Badge } from '@/components/ui/badge';

import { useGoldenRuns } from '../hooks/use-admin';

/**
 * The latest stored golden run: pass rate, and every question that failed with the reason. Runs are started from the
 * command line (`poe eval:golden --store` in medynium-apis); this card only shows what was stored.
 */
export function GoldenReportCard() {
  const query = useGoldenRuns();
  return (
    <DataState query={query}>
      {(runs) => {
        const latest = runs.latest;
        if (!latest) {
          return (
            <RecordRow
              title="Golden report"
              lines={['No golden run has been stored yet.', 'Run poe eval:golden --store in medynium-apis.']}
            />
          );
        }
        const failures = latest.cases.filter((c) => c.result === 'FAIL');
        return (
          <>
            <RecordRow
              title={`${latest.passed} of ${latest.total} passed`}
              lines={[
                latest.started_at ? latest.started_at.slice(0, 16).replace('T', ' ') : null,
                failures.length === 0 ? 'Every question passed in this run.' : null,
                runs.history.length > 0
                  ? `Earlier runs: ${runs.history.map((r) => `${r.passed}/${r.total}`).join(', ')}`
                  : null,
              ]}
              right={
                <Badge
                  label={failures.length === 0 ? 'All passed' : `${failures.length} failed`}
                  tone={failures.length === 0 ? 'success' : 'warning'}
                />
              }
            />
            {failures.map((f) => (
              <RecordRow key={f.seq} title={f.question} lines={[f.detail]} />
            ))}
          </>
        );
      }}
    </DataState>
  );
}
