/**
 * WAVY Design System - Authentic Google Brand & Material 3 Colors
 * The iconic Google 4-color system:
 * - Google Blue: #1A73E8 / #8AB4F8
 * - Google Red: #EA4335 / #F28B82
 * - Google Yellow: #FBBC04 / #FDD663
 * - Google Green: #34A853 / #81C995
 * - Google Surfaces: #F8F9FA & #202124
 */

export interface ColorTheme {
  isDark: boolean;
  background: string;
  surface: string;
  surfaceVariant: string;
  surfaceRaised: string;
  surfaceSubtle: string;
  surfaceContainer: string;
  border: string;
  borderSubtle: string;

  // Google Brand Accents
  primary: string;
  primaryHover: string;
  primaryMuted: string;
  primaryContainer: string;
  onPrimaryContainer: string;

  secondary: string;
  secondaryMuted: string;
  secondaryContainer: string;

  // Google 4-Color Quartet
  googleBlue: string;
  googleRed: string;
  googleYellow: string;
  googleGreen: string;

  // Status Tones
  success: string;
  successMuted: string;
  warning: string;
  warningMuted: string;
  danger: string;
  dangerMuted: string;
  error: string;
  urgent: string;
  urgentMuted: string;

  // Typography (Google Roboto/Product Sans standards)
  text: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;

  // Tab & Search
  searchBarBg: string;
  tabBarBackground: string;
  tabBarBorder: string;
  activePillBg: string;
  cardHighlight: string;
}

export const lightTheme: ColorTheme = {
  isDark: false,
  background: '#F8F9FA',           // Google standard light canvas
  surface: '#FFFFFF',              // Google clean card white
  surfaceVariant: '#F1F3F4',       // Google pill chip & search bar grey
  surfaceRaised: '#FFFFFF',
  surfaceSubtle: '#E8EAED',
  surfaceContainer: '#F1F3F4',
  border: '#DADCE0',               // Google signature border
  borderSubtle: '#F1F3F4',

  // Google Blue is flagship primary
  primary: '#1A73E8',
  primaryHover: '#1557B0',
  primaryMuted: '#E8F0FE',
  primaryContainer: '#E8F0FE',
  onPrimaryContainer: '#1967D2',

  secondary: '#5F6368',
  secondaryMuted: '#F1F3F4',
  secondaryContainer: '#F1F3F4',

  // The 4 Iconic Google Colors
  googleBlue: '#1A73E8',
  googleRed: '#EA4335',
  googleYellow: '#FBBC04',
  googleGreen: '#34A853',

  success: '#34A853',
  successMuted: '#E6F4EA',
  warning: '#F9AB00',
  warningMuted: '#FEF7E0',
  danger: '#EA4335',
  dangerMuted: '#FCE8E6',
  error: '#EA4335',
  urgent: '#EA4335',
  urgentMuted: '#FCE8E6',

  text: '#202124',                 // Google high-contrast dark text
  textSecondary: '#5F6368',        // Google standard grey text
  textTertiary: '#80868B',
  textInverse: '#FFFFFF',

  searchBarBg: '#FFFFFF',
  tabBarBackground: '#FFFFFF',
  tabBarBorder: '#DADCE0',
  activePillBg: '#E8F0FE',
  cardHighlight: 'rgba(0, 0, 0, 0.02)',
};

export const darkTheme: ColorTheme = {
  isDark: true,
  background: '#202124',           // Google dark theme root
  surface: '#303134',              // Google search bar & card surface
  surfaceVariant: '#3C4043',       // Google chip surface
  surfaceRaised: '#303134',
  surfaceSubtle: '#3C4043',
  surfaceContainer: '#35363A',
  border: '#3C4043',
  borderSubtle: '#2D2E30',

  // Google Blue in Dark Mode
  primary: '#8AB4F8',
  primaryHover: '#ADC6FA',
  primaryMuted: 'rgba(138, 180, 248, 0.16)',
  primaryContainer: 'rgba(138, 180, 248, 0.16)',
  onPrimaryContainer: '#8AB4F8',

  secondary: '#9AA0A6',
  secondaryMuted: 'rgba(154, 160, 166, 0.14)',
  secondaryContainer: '#3C4043',

  // The 4 Iconic Google Colors (Dark Mode calibrated)
  googleBlue: '#8AB4F8',
  googleRed: '#F28B82',
  googleYellow: '#FDD663',
  googleGreen: '#81C995',

  success: '#81C995',
  successMuted: 'rgba(129, 201, 149, 0.16)',
  warning: '#FDD663',
  warningMuted: 'rgba(253, 214, 99, 0.16)',
  danger: '#F28B82',
  dangerMuted: 'rgba(242, 139, 130, 0.16)',
  error: '#F28B82',
  urgent: '#F28B82',
  urgentMuted: 'rgba(242, 139, 130, 0.16)',

  text: '#E8EAED',                 // Google dark theme text
  textSecondary: '#BDC1C6',        // Google dark secondary text
  textTertiary: '#9AA0A6',
  textInverse: '#202124',

  searchBarBg: '#303134',
  tabBarBackground: '#202124',
  tabBarBorder: '#3C4043',
  activePillBg: 'rgba(138, 180, 248, 0.16)',
  cardHighlight: 'rgba(255, 255, 255, 0.04)',
};

// Default is lightTheme for the authentic, iconic bright Google look
export const colors = lightTheme;
