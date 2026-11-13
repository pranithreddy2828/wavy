/**
 * WAVY Design System - Google Material 3 Aesthetic
 * Ultra-clean, calm, accessible, and distraction-free
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

  // Accents
  primary: string;
  primaryHover: string;
  primaryMuted: string;
  primaryContainer: string;
  onPrimaryContainer: string;

  secondary: string;
  secondaryMuted: string;
  secondaryContainer: string;

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

  // Typography
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

export const darkTheme: ColorTheme = {
  isDark: true,
  background: '#121316',
  surface: '#1E1F24',
  surfaceVariant: '#282A30',
  surfaceRaised: '#23252B',
  surfaceSubtle: '#2D3037',
  surfaceContainer: '#23252B',
  border: '#33363F',
  borderSubtle: '#26282E',

  primary: '#00D1B2',
  primaryHover: '#00BFA5',
  primaryMuted: 'rgba(0, 209, 178, 0.14)',
  primaryContainer: 'rgba(0, 209, 178, 0.14)',
  onPrimaryContainer: '#00D1B2',

  secondary: '#8AB4F8',
  secondaryMuted: 'rgba(138, 180, 248, 0.14)',
  secondaryContainer: 'rgba(138, 180, 248, 0.14)',

  success: '#81C995',
  successMuted: 'rgba(129, 201, 149, 0.16)',
  warning: '#FDD663',
  warningMuted: 'rgba(253, 214, 99, 0.16)',
  danger: '#F28B82',
  dangerMuted: 'rgba(242, 139, 130, 0.16)',
  error: '#F28B82',
  urgent: '#FF5252',
  urgentMuted: 'rgba(255, 82, 82, 0.16)',

  text: '#E3E3E3',
  textSecondary: '#C4C7C5',
  textTertiary: '#8E918F',
  textInverse: '#121316',

  searchBarBg: '#1E1F24',
  tabBarBackground: '#18191D',
  tabBarBorder: '#282A30',
  activePillBg: 'rgba(0, 209, 178, 0.16)',
  cardHighlight: 'rgba(255, 255, 255, 0.04)',
};

export const lightTheme: ColorTheme = {
  isDark: false,
  background: '#F8F9FA',
  surface: '#FFFFFF',
  surfaceVariant: '#F1F3F4',
  surfaceRaised: '#F1F3F4',
  surfaceSubtle: '#E8EAED',
  surfaceContainer: '#EDEDED',
  border: '#E0E2E5',
  borderSubtle: '#F1F3F4',

  primary: '#00875A',
  primaryHover: '#00704A',
  primaryMuted: '#E6F4EA',
  primaryContainer: '#E6F4EA',
  onPrimaryContainer: '#137333',

  secondary: '#1A73E8',
  secondaryMuted: '#E8F0FE',
  secondaryContainer: '#E8F0FE',

  success: '#188038',
  successMuted: 'rgba(24, 128, 56, 0.14)',
  warning: '#F29900',
  warningMuted: 'rgba(242, 153, 0, 0.14)',
  danger: '#D93025',
  dangerMuted: 'rgba(217, 48, 37, 0.14)',
  error: '#D93025',
  urgent: '#D93025',
  urgentMuted: 'rgba(217, 48, 37, 0.14)',

  text: '#1F1F1F',
  textSecondary: '#444746',
  textTertiary: '#747775',
  textInverse: '#FFFFFF',

  searchBarBg: '#FFFFFF',
  tabBarBackground: '#FFFFFF',
  tabBarBorder: '#E0E2E5',
  activePillBg: '#E6F4EA',
  cardHighlight: 'rgba(0, 0, 0, 0.02)',
};

export const colors = darkTheme;
