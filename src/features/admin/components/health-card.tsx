import { DataState } from '@/components/shared/data-state';
import { RecordRow } from '@/components/shared/record-row';
import { Badge } from '@/components/ui/badge';

import { useHealthDetails } from '../hooks/use-admin';

/** Platform health: the API, Snowflake, Cortex and audit writes, as the server reports them. */
export function HealthCard() {
  const query = useHealthDetails();
  return (
    <DataState query={query}>
      {(health) => (
        <RecordRow
          title={`Platform ${health.status}`}
          lines={[
            `Version ${health.version}`,
            `Environment ${health.environment}`,
            `Audit writes ${health.audit_writes}`,
          ]}
          right={
            <Badge
              label={health.status === 'ok' ? 'OK' : 'Degraded'}
              tone={health.status === 'ok' ? 'success' : 'warning'}
            />
          }
        />
      )}
    </DataState>
  );
}
