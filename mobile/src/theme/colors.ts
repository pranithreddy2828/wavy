/**
 * WAVY Design System - Colors (Light & Dark Themes)
 * 2026 Hyperlocal Aesthetic: Obsidian/Teal Dark, Crisp Canvas Light
 */

export interface ColorTheme {
  isDark: boolean;
  background: string;
  surface: string;
  surfaceRaised: string;
  surfaceSubtle: string;
  border: string;
  borderSubtle: string;

  // Accents
  primary: string;
  primaryHover: string;
  primaryMuted: string;
  secondary: string;
  secondaryMuted: string;

  // Status & Urgency
  success: string;
  successMuted: string;
  warning: string;
  warningMuted: string;
  danger: string;
  dangerMuted: string;
  urgent: string;
  urgentMuted: string;

  // Typography
  text: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;

  // Navigation & Interactive
  tabBarBackground: string;
  tabBarBorder: string;
  cardHighlight: string;
}

export const darkTheme: ColorTheme = {
  isDark: true,
  background: '#090D16',
  surface: '#111726',
  surfaceRaised: '#182136',
  surfaceSubtle: '#1F2B44',
  border: '#243250',
  borderSubtle: '#1A243A',

  primary: '#00D1B2',
  primaryHover: '#00BFA5',
  primaryMuted: 'rgba(0, 209, 178, 0.14)',

  secondary: '#6366F1',
  secondaryMuted: 'rgba(99, 102, 241, 0.14)',

  success: '#10B981',
  successMuted: 'rgba(16, 185, 129, 0.16)',
  warning: '#F59E0B',
  warningMuted: 'rgba(245, 158, 11, 0.16)',
  danger: '#EF4444',
  dangerMuted: 'rgba(239, 68, 68, 0.16)',
  urgent: '#FF3366',
  urgentMuted: 'rgba(255, 51, 102, 0.18)',

  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  textTertiary: '#64748B',
  textInverse: '#090D16',

  tabBarBackground: '#0B101D',
  tabBarBorder: '#1E293B',
  cardHighlight: 'rgba(255, 255, 255, 0.03)',
};

export const lightTheme: ColorTheme = {
  isDark: false,
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceRaised: '#F1F5F9',
  surfaceSubtle: '#E2E8F0',
  border: '#CBD5E1',
  borderSubtle: '#E2E8F0',

  primary: '#009E87',
  primaryHover: '#008370',
  primaryMuted: 'rgba(0, 158, 135, 0.12)',

  secondary: '#4F46E5',
  secondaryMuted: 'rgba(79, 70, 229, 0.12)',

  success: '#059669',
  successMuted: 'rgba(5, 150, 105, 0.14)',
  warning: '#D97706',
  warningMuted: 'rgba(217, 119, 6, 0.14)',
  danger: '#DC2626',
  dangerMuted: 'rgba(220, 38, 38, 0.14)',
  urgent: '#E11D48',
  urgentMuted: 'rgba(225, 29, 72, 0.14)',

  text: '#0F172A',
  textSecondary: '#475569',
  textTertiary: '#94A3B8',
  textInverse: '#FFFFFF',

  tabBarBackground: '#FFFFFF',
  tabBarBorder: '#E2E8F0',
  cardHighlight: 'rgba(0, 0, 0, 0.02)',
};

// Default export is darkTheme for WAVY's flagship aesthetic
export const colors = darkTheme;
