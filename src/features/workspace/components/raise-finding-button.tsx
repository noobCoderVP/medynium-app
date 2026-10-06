import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

import { useFindings } from '../hooks/use-findings';

/** Under a review conclusion: record it as a finding so a decision can be made and kept. Repeating is harmless. */
export function RaiseFindingButton({
  patientId,
  answerId,
  considerationId,
}: {
  patientId: string;
  answerId: string;
  considerationId: string;
}) {
  const { raise } = useFindings(patientId);
  if (raise.isSuccess) {
    return (
      <Text variant="caption" color="success" accessibilityLiveRegion="polite">
        Added to findings below. Record your decision there.
      </Text>
    );
  }
  return (
    <>
      <Button
        title="Add to findings"
        icon="clipboard-outline"
        size="sm"
        variant="secondary"
        loading={raise.isPending}
        onPress={() => raise.mutate({ answer_id: answerId, consideration_id: considerationId })}
      />
      {raise.isError ? (
        <Text variant="caption" color="destructive" accessibilityRole="alert">
          That did not save. Try again.
        </Text>
      ) : null}
    </>
  );
}
