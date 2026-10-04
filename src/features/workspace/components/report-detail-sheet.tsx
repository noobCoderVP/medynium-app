import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { DataState } from '@/components/shared/data-state';
import { Button } from '@/components/ui/button';
import { Chips } from '@/components/ui/chips';
import { Sheet } from '@/components/ui/sheet';
import { Text } from '@/components/ui/text';

import { reportErrorText, useReport, useReportActions } from '../hooks/use-patient-data';
import { ReportRowCard } from './report-row';
import { REPORT_STATUS } from './reports-tab';

/**
 * One report: what was read from it, row by row, with the words and page each came from. A doctor accepts or
 * rejects rows, then approves; only accepted rows are written to the record, and only on approval.
 */
export function ReportDetailSheet({
  patientId,
  reportId,
  onClose,
}: {
  patientId: string;
  reportId: string | null;
  onClose: () => void;
}) {
  const query = useReport(patientId, reportId);
  const { decide, approve, reject } = useReportActions(patientId);
  const [confirm, setConfirm] = useState(false);
  const error = decide.error ?? approve.error ?? reject.error;
  return (
    <Sheet visible={!!reportId} onClose={onClose} title={query.data?.filename ?? 'Report'}>
      <ScrollView contentContainerStyle={styles.body}>
        <DataState query={query}>
          {(report) => (
            <>
              <Text color="mutedForeground">
                {REPORT_STATUS[report.status]}
                {report.status_detail ? `. ${report.status_detail}` : ''}
              </Text>
              {report.identity_status && report.identity_status !== 'MATCH' && (
                <View style={styles.identity}>
                  <Text color="warning" bold accessibilityRole="alert">
                    The name on the report ({report.name_on_report ?? 'not found'}) does not match this patient.
                  </Text>
                  {report.status === 'EXTRACTED' && (
                    <Chips
                      options={[{ value: 'ok', label: 'I have checked it belongs to them' }]}
                      value={confirm ? 'ok' : undefined}
                      onChange={(value) => setConfirm(value === 'ok')}
                    />
                  )}
                </View>
              )}
              {report.rows.length === 0 ? (
                <Text color="mutedForeground">Nothing was read from this report.</Text>
              ) : (
                report.rows.map((row) => (
                  <ReportRowCard
                    key={row.row_id}
                    row={row}
                    busy={decide.isPending}
                    onDecide={
                      report.status === 'EXTRACTED'
                        ? (decision) =>
                            decide.mutate({
                              reportId: report.report_id,
                              rowId: row.row_id,
                              decision,
                              version: row.version,
                            })
                        : undefined
                    }
                  />
                ))
              )}
              {error && (
                <Text color="destructive" accessibilityRole="alert">
                  {reportErrorText(error)}
                </Text>
              )}
              {report.status === 'EXTRACTED' && (
                <View style={styles.actions}>
                  <Button
                    title="Approve accepted rows"
                    loading={approve.isPending}
                    onPress={() => approve.mutate({ reportId: report.report_id, confirmIdentity: confirm })}
                  />
                  <Button
                    title="Reject report"
                    variant="secondary"
                    loading={reject.isPending}
                    onPress={() => reject.mutate(report.report_id)}
                  />
                </View>
              )}
            </>
          )}
        </DataState>
      </ScrollView>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  body: { gap: 10, paddingBottom: 8 },
  identity: { gap: 8 },
  actions: { gap: 8 },
});
