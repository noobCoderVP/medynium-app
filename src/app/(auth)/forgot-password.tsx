import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { ForgotPasswordForm } from '@/features/session';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  return (
    <Screen header={false} center contentStyle={styles.content}>
      <Text variant="title" accessibilityRole="header">
        Reset your password
      </Text>
      <ForgotPasswordForm onBack={() => router.back()} />
    </Screen>
  );
}

const styles = StyleSheet.create({ content: { gap: 24 } });
