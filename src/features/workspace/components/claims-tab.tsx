import { StyleSheet, View } from 'react-native';

import { RecordRow } from '@/components/shared/record-row';
import { StatGrid, StatTile } from '@/components/shared/stat-tile';
import { Text } from '@/components/ui/text';
import { copy } from '@/lib/copy';
import { formatDate, formatMoney } from '@/lib/format';

import { useClaims } from '../hooks/use-patient-data';
import { PagedList } from './paged-list';

export function ClaimsTab({ patientId }: { patientId: string }) {
  const query = useClaims(patientId);
  const utilization = query.data?.pages[0]?.utilization;
  return (
    <View style={styles.stack}>
      {utilization && (
        <StatGrid>
          <StatTile label="Billed" value={formatMoney(utilization.billed)} />
          <StatTile label="Approved" value={formatMoney(utilization.approved)} />
        </StatGrid>
      )}
      <PagedList
        query={query}
        empty={copy.empty.claims}
        getItems={(page) => page.claims}
        renderItem={(claim) => {
          return (
            <RecordRow
              key={claim.claim_id}
              title={claim.service ?? 'Claim'}
              lines={[formatDate(claim.service_date), claim.status]}
              right={
                <>
                  <Text variant="label">{formatMoney(claim.approved)}</Text>
                  <Text variant="caption" color="mutedForeground">
                    of {formatMoney(claim.billed)}
                  </Text>
                </>
              }
            />
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({ stack: { gap: 12 } });
