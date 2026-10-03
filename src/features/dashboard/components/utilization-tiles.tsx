import { StatGrid, StatTile } from '@/components/shared/stat-tile';
import type { UtilizationSummary } from '@/lib/api/types';
import { formatMoney, formatNumber } from '@/lib/format';

export function UtilizationTiles({ utilization }: { utilization: UtilizationSummary }) {
  return (
    <StatGrid>
      <StatTile label="Patients" value={formatNumber(utilization.patients)} />
      <StatTile label="Outpatient visits" value={formatNumber(utilization.opd_visits)} />
      <StatTile label="Emergency visits" value={formatNumber(utilization.emergency_visits)} />
      <StatTile label="Admissions" value={formatNumber(utilization.hospitalizations)} />
      <StatTile label="Approved claims" value={formatMoney(utilization.approved)} />
    </StatGrid>
  );
}
