import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import { useEffect } from 'react';
import type { ColorValue } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { FontFamily } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { spring } from '@/lib/motion';

type IconName = ComponentProps<typeof Ionicons>['name'];

/** The icon lifts and springs when its tab becomes active. */
function TabIcon({
  active,
  inactive,
  focused,
  color,
}: {
  active: IconName;
  inactive: IconName;
  focused: boolean;
  color: ColorValue;
}) {
  const scale = useSharedValue(focused ? 1.12 : 1);
  useEffect(() => {
    scale.value = withSpring(focused ? 1.12 : 1, spring);
  }, [focused, scale]);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View style={style}>
      <Ionicons name={focused ? active : inactive} size={24} color={color} />
    </Animated.View>
  );
}

const icon =
  (active: IconName, inactive: IconName) =>
  // eslint-disable-next-line react/display-name
  ({ focused, color }: { focused: boolean; color: ColorValue }) => (
    <TabIcon active={active} inactive={inactive} focused={focused} color={color} />
  );

export default function TabsLayout() {
  const theme = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.mutedForeground,
        tabBarStyle: { backgroundColor: theme.card, borderTopColor: theme.border },
        tabBarLabelStyle: { fontSize: 11, fontFamily: FontFamily.medium },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: icon('home', 'home-outline') }} />
      <Tabs.Screen name="patients" options={{ title: 'Patients', tabBarIcon: icon('people', 'people-outline') }} />
      <Tabs.Screen name="ask" options={{ title: 'Ask', tabBarIcon: icon('sparkles', 'sparkles-outline') }} />
      <Tabs.Screen name="knowledge" options={{ title: 'Knowledge', tabBarIcon: icon('library', 'library-outline') }} />
      <Tabs.Screen name="you" options={{ title: 'You', tabBarIcon: icon('person', 'person-outline') }} />
    </Tabs>
  );
}
