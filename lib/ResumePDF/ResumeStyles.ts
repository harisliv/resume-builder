import { StyleSheet } from '@react-pdf/renderer';
import { FONT_FAMILY } from './fonts';

export const COLORS = {
  background: '#ffffff',
  backgroundAlt: '#f8fafc',
  cardBg: '#f1f5f9',
  cardBorder: '#e2e8f0',
  headerBorder: 'rgba(0, 0, 0, 0.1)',
  white: '#ffffff',
  textPrimary: '#0f172a',
  textSecondary: '#334155',
  textMuted: '#64748b',
  textDark: '#94a3b8',
  slate600: '#475569',
  cyan300: '#67e8f9',
  cyan400: '#22d3ee',
  cyan: '#06b6d4',
  cyan600: '#0891b2',
  cyan700: '#0e7490',
  violet300: '#c4b5fd',
  violet400: '#a78bfa',
  violet: '#8b5cf6',
  violet600: '#7c3aed',
  violet700: '#6d28d9',
  fuchsia300: '#f0abfc',
  fuchsia400: '#e879f9',
  fuchsia: '#d946ef',
  fuchsia600: '#c026d3',
  fuchsia700: '#a21caf',
  rose: '#f43f5e'
};

export const createStyles = () =>
  StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: COLORS.background,
      fontFamily: FONT_FAMILY.sans,
      paddingTop: 32,
      paddingBottom: 40,
      paddingHorizontal: 32
    },
    header: {
      paddingBottom: 20,
      borderBottom: `1 solid ${COLORS.cardBorder}`,
      marginBottom: 0,
      marginHorizontal: 0,
      paddingHorizontal: 0
    },
    name: {
      fontSize: 24,
      fontWeight: 700,
      color: COLORS.textPrimary,
      marginBottom: 12,
      fontFamily: FONT_FAMILY.sans,
      letterSpacing: -0.5
    },
    contactRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      flexWrap: 'nowrap'
    },
    contactItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6
    },
    contactIconBox: {
      width: 24,
      height: 24,
      borderRadius: 6,
      backgroundColor: COLORS.cardBg,
      justifyContent: 'center',
      alignItems: 'center'
    },
    contactText: {
      fontSize: 9,
      color: COLORS.textSecondary
    },
    contactLink: {
      fontSize: 9,
      color: COLORS.cyan,
      textDecoration: 'none'
    },
    body: {
      paddingTop: 0,
      paddingBottom: 0
    },
    summarySection: {
      marginTop: 20,
      marginBottom: 20,
      paddingLeft: 12,
      borderLeft: `2 solid ${COLORS.cyan}`
    },
    summaryText: {
      fontSize: 10,
      color: COLORS.textSecondary,
      lineHeight: 1.6
    },
    section: {
      marginBottom: 24
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 12,
      marginTop: 0
    },
    sectionIconBox: {
      width: 26,
      height: 26,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center'
    },
    sectionIconBoxCyan: {
      backgroundColor: COLORS.cyan
    },
    sectionIconBoxViolet: {
      backgroundColor: COLORS.violet
    },
    sectionIconBoxFuchsia: {
      backgroundColor: COLORS.fuchsia
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: 600,
      color: COLORS.textPrimary,
      fontFamily: FONT_FAMILY.sans,
      letterSpacing: 0.3
    },
    experienceContainer: {
      paddingLeft: 0
    },
    experienceItem: {
      marginBottom: 10,
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12
    },
    timelineDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: COLORS.background,
      borderWidth: 2,
      borderColor: COLORS.cyan,
      borderStyle: 'solid',
      marginTop: 6,
      flexShrink: 0
    },
    card: {
      backgroundColor: COLORS.cardBg,
      borderRadius: 8,
      padding: 12,
      borderWidth: 1,
      borderColor: COLORS.cardBorder,
      borderStyle: 'solid'
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10
    },
    cardLeft: {
      flex: 1
    },
    cardRight: {
      alignItems: 'flex-end'
    },
    position: {
      fontSize: 11,
      fontWeight: 600,
      color: COLORS.textPrimary,
      fontFamily: FONT_FAMILY.sans,
      marginBottom: 3
    },
    company: {
      fontSize: 10,
      fontWeight: 600,
      color: COLORS.cyan600,
      fontFamily: FONT_FAMILY.sans
    },
    location: {
      fontSize: 8,
      color: COLORS.textMuted,
      marginBottom: 2
    },
    dateRangeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 0
    },
    dateRange: {
      fontSize: 8,
      color: COLORS.textDark,
      fontFamily: FONT_FAMILY.mono
    },
    description: {
      fontSize: 9,
      color: COLORS.textMuted,
      lineHeight: 1.625
    },
    educationItem: {
      marginBottom: 8
    },
    degree: {
      fontSize: 11,
      fontWeight: 600,
      color: COLORS.textPrimary,
      fontFamily: FONT_FAMILY.sans,
      marginBottom: 3
    },
    institution: {
      fontSize: 10,
      fontWeight: 600,
      color: COLORS.violet,
      fontFamily: FONT_FAMILY.sans
    },
    gpa: {
      fontSize: 8,
      color: COLORS.fuchsia,
      marginTop: 3
    },
    skillsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6
    },
    skillTag: {
      fontSize: 9,
      color: COLORS.textSecondary,
      backgroundColor: COLORS.cardBg,
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: COLORS.cardBorder,
      borderStyle: 'solid'
    },
    pageNumber: {
      position: 'absolute',
      bottom: 20,
      right: 0,
      fontSize: 8,
      color: COLORS.textDark
    }
  });
