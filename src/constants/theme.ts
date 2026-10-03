/**
 * Design tokens, ported from medynium-ui/src/app/globals.css (oklch converted to sRGB). Roles, not hex values:
 * brand, agent, fact / source / synth (the three evidence tags) and warning / critical / success.
 * `npm run contrast` checks every text and background pair used.
 */

export const Colors = {
  light: {
    background: '#f6f9fd',
    foreground: '#121b29',
    card: '#ffffff',
    primary: '#1e59cd',
    primaryForeground: '#fcfcfc',
    secondary: '#ebf1f8',
    muted: '#ecf1f7',
    mutedForeground: '#4e5969',
    accent: '#ddecff',
    accentForeground: '#132b5a',
    destructive: '#bb0916',
    border: '#dee3eb',
    ring: '#3876dd',
    agent: '#653eae',
    agentSoft: '#efecfe',
    fact: '#3a4198',
    factSoft: '#e8edff',
    source: '#00554d',
    sourceSoft: '#d9f6f1',
    synth: '#713f00',
    synthSoft: '#fff0cc',
    warning: '#894100',
    warningSoft: '#ffedce',
    critical: '#b3000d',
    criticalSoft: '#ffebe8',
    success: '#005e31',
    successSoft: '#daf7e3',
    info: '#3a4198',
  },
  dark: {
    background: '#090d16',
    foreground: '#ebeff4',
    card: '#101621',
    primary: '#7cb4fc',
    primaryForeground: '#051027',
    secondary: '#1d2430',
    muted: '#1d2430',
    mutedForeground: '#a1acbb',
    accent: '#1f304f',
    accentForeground: '#ebeff4',
    destructive: '#ff7979',
    border: '#292c34',
    ring: '#6aa7f4',
    agent: '#c3aeff',
    agentSoft: '#2b2243',
    fact: '#abb9fe',
    factSoft: '#1e2343',
    source: '#7cd7cc',
    sourceSoft: '#002e2a',
    synth: '#f2c86c',
    synthSoft: '#382500',
    warning: '#fab36d',
    warningSoft: '#3e2104',
    critical: '#ff8e86',
    criticalSoft: '#431614',
    success: '#72d699',
    successSoft: '#062f19',
    info: '#abb9fe',
  },
} as const;

export type ThemeColors = { [K in keyof typeof Colors.light]: string };
export type ThemeColor = keyof ThemeColors;

export const Radius = { sm: 6, md: 10, lg: 14, xl: 20, full: 999 } as const;

export const Spacing = { half: 2, one: 4, two: 8, three: 12, four: 16, five: 24, six: 32 } as const;

export const MaxContentWidth = 720;

/** Roboto for headings and the wordmark, Inter for everything else (as on the web). Loaded in the root layout. */
export const FontFamily = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  heading: 'Roboto_700Bold',
} as const;
