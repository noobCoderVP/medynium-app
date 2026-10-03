import { Text as RNText, StyleSheet, type TextProps as RNTextProps } from 'react-native';

import { FontFamily, type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type TextVariant = 'title' | 'heading' | 'body' | 'label' | 'caption';

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: ThemeColor;
  bold?: boolean;
}

export function Text({ variant = 'body', color = 'foreground', bold, style, ...rest }: TextProps) {
  const theme = useTheme();
  return <RNText style={[{ color: theme[color] }, styles[variant], bold && styles.bold, style]} {...rest} />;
}

// Roboto for titles and headings, Inter for the rest, as on the web. Font files are loaded in the root layout.
const styles = StyleSheet.create({
  title: { fontFamily: FontFamily.heading, fontSize: 26, lineHeight: 32, letterSpacing: -0.4 },
  heading: { fontFamily: FontFamily.heading, fontSize: 17, lineHeight: 24, letterSpacing: -0.2 },
  body: { fontFamily: FontFamily.regular, fontSize: 15, lineHeight: 22 },
  label: { fontFamily: FontFamily.medium, fontSize: 13, lineHeight: 18 },
  caption: { fontFamily: FontFamily.regular, fontSize: 12, lineHeight: 16 },
  bold: { fontFamily: FontFamily.semibold },
});
