import * as DocumentPicker from 'expo-document-picker';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { DataState } from '@/components/shared/data-state';
import { RecordRow } from '@/components/shared/record-row';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';
import { ListSkeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import type { ReportSummary } from '@/lib/api/types';
import { formatDate } from '@/lib/format';

import { reportErrorText, useReportActions, useReports } from '../hooks/use-patient-data';
import { ReportDetailSheet } from './report-detail-sheet';

export const REPORT_STATUS: Record<ReportSummary['status'], string> = {
  UPLOADED: 'Waiting to be read',
  PARSING: 'Being read',
  EXTRACTED: 'Ready for review',
  REVIEWED: 'Reviewed',
  REJECTED: 'Rejected',
  FAILED: 'Could not be read',
};

/**
 * Upload a lab report or prescription (PDF, PNG or JPEG), see what was read from it, and approve what is right.
 * What is read is only staged: each row shows the exact words and page it came from, and nothing is written to
 * the record until a doctor approves.
 */
export function ReportsTab({ patientId }: { patientId: string }) {
  const query = useReports(patientId);
  const { upload } = useReportActions(patientId);
  const [open, setOpen] = useState<string | null>(null);

  const pick = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/png', 'image/jpeg'],
      copyToCacheDirectory: true,
    });
    const asset = result.canceled ? null : result.assets[0];
    if (!asset) return;
    const blob = await (await fetch(asset.uri)).blob();
    upload.mutate(
      { blob, name: asset.name, type: asset.mimeType ?? blob.type },
      { onSuccess: (report) => setOpen(report.report_id) },
    );
  };

  return (
    <View style={styles.list}>
      <Button
        title="Upload a report"
        icon="cloud-upload-outline"
        loading={upload.isPending}
        onPress={() => void pick()}
      />
      <Text variant="caption" color="mutedForeground">
        PDF, PNG or JPEG, up to 10 MB. Synthetic data only. Nothing is written to the record until you approve.
      </Text>
      {upload.isError && (
        <Text color="destructive" accessibilityRole="alert">
          {reportErrorText(upload.error)}
        </Text>
      )}
      <DataState
        query={query}
        skeleton={<ListSkeleton rows={3} />}
        isEmpty={(data) => data.items.length === 0}
        empty={{ title: 'No reports uploaded for this patient yet.' }}
      >
        {(data) => (
          <>
            {data.items.map((report, index) => (
              <Reveal key={report.report_id} index={index}>
                <RecordRow
                  title={report.filename}
                  lines={[`Uploaded ${formatDate(report.uploaded_at)}`, REPORT_STATUS[report.status]]}
                  label={`${report.filename}. ${REPORT_STATUS[report.status]}${report.rows_waiting > 0 ? `, ${report.rows_waiting} to review` : ''}. Open.`}
                  onPress={() => setOpen(report.report_id)}
                  right={
                    report.rows_waiting > 0 ? <Badge label={`${report.rows_waiting} to review`} tone="warning" /> : null
                  }
                />
              </Reveal>
            ))}
          </>
        )}
      </DataState>
      <ReportDetailSheet patientId={patientId} reportId={open} onClose={() => setOpen(null)} />
    </View>
  );
}

const styles = StyleSheet.create({ list: { gap: 10 } });
