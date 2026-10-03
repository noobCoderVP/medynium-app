import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Icon, type IconName } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

export function EmptyState({
  title,
  description,
  icon = 'file-tray-outline',
  actionLabel,
  onAction,
}: {
  title: string;
  description?: string;
  icon?: IconName;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.wrap}>
      <Icon name={icon} size={32} color="mutedForeground" />
      <Text variant="heading">{title}</Text>
      {description && (
        <Text variant="body" color="mutedForeground" style={styles.center}>
          {description}
        </Text>
      )}
      {actionLabel && onAction && <Button title={actionLabel} onPress={onAction} size="sm" />}
    </View>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <EmptyState
      icon="cloud-offline-outline"
      title="Something went wrong"
      description={message}
      actionLabel={onRetry ? 'Try again' : undefined}
      onAction={onRetry}
    />
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 8, paddingVertical: 40, paddingHorizontal: 24 },
  center: { textAlign: 'center' },
});
