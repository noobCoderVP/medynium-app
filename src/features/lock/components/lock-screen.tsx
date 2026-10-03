import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { Logo } from '@/components/brand/logo';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useSession } from '@/features/session';
import { useTheme } from '@/hooks/use-theme';
import { fadeIn, fadeOut } from '@/lib/motion';

import { useAppLock } from '../hooks/lock-context';

/**
 * Covers the whole app while locked, so nothing underneath is readable. It asks for the phone's fingerprint, face or
 * screen lock as soon as it appears, and offers Sign out if that is not possible.
 */
export function LockScreen() {
  const theme = useTheme();
  const { locked, unlock } = useAppLock();
  const { signOut } = useSession();
  const [failed, setFailed] = useState(false);
  const asked = useRef(false);

  useEffect(() => {
    if (!locked) {
      asked.current = false;
      return;
    }
    if (asked.current) return;
    asked.current = true;
    void unlock().then((ok) => setFailed(!ok));
  }, [locked, unlock]);

  if (!locked) return null;
  return (
    <Animated.View entering={fadeIn} exiting={fadeOut} style={[styles.cover, { backgroundColor: theme.background }]}>
      <View style={styles.body} accessibilityViewIsModal>
        <Logo size={48} />
        <Text variant="title" accessibilityRole="header" style={styles.title}>
          Medynium is locked
        </Text>
        <Text color="mutedForeground" style={styles.center}>
          Unlock with your fingerprint, face or screen lock to continue.
        </Text>
        {failed && (
          <Text variant="label" color="destructive" accessibilityRole="alert">
            That did not work. Try again, or sign out.
          </Text>
        )}
        <Button title="Unlock" icon="lock-open-outline" onPress={() => void unlock().then((ok) => setFailed(!ok))} />
        <Button title="Sign out instead" variant="ghost" onPress={() => void signOut()} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cover: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100, justifyContent: 'center' },
  body: { padding: 24, gap: 14, alignItems: 'stretch' },
  title: { marginTop: 12 },
  center: { textAlign: 'center' },
});
