import { StatGrid, StatTile } from '@/components/shared/stat-tile';
import type { UtilizationSummary } from '@/lib/api/types';
import { formatMoney, formatNumber } from '@/lib/format';

const count = (n: number) => formatNumber(Math.round(n));

export function UtilizationTiles({ utilization }: { utilization: UtilizationSummary }) {
  return (
    <StatGrid>
      <StatTile label="Patients" value={utilization.patients} format={count} />
      <StatTile label="Outpatient visits" value={utilization.opd_visits} format={count} />
      <StatTile label="Emergency visits" value={utilization.emergency_visits} format={count} />
      <StatTile label="Admissions" value={utilization.hospitalizations} format={count} />
      <StatTile
        label="Approved claims"
        value={utilization.approved.amount}
        format={(n) => formatMoney({ amount: n })}
      />
    </StatGrid>
  );
}
