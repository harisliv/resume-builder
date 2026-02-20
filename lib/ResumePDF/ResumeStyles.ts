import { StyleSheet } from '@react-pdf/renderer';
import { PDF_FONTS, FONT_FAMILY } from './fonts';
import {
  COLOR_PALETTES,
  type TPaletteId,
  type TFontId
} from '@/types/documentStyle';

export const BASE_COLORS = {
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
  slate600: '#475569'
};

export const getColors = (paletteId: TPaletteId = 'aesthetic') => {
  const palette = COLOR_PALETTES[paletteId];
  return {
    ...BASE_COLORS,
    summary: palette.summary,
    experience: palette.experience,
    education: palette.education,
    skills: palette.skills
  };
};

export const COLORS = getColors('aesthetic');

export const createStyles = (
  paletteId: TPaletteId = 'aesthetic',
  fontId: TFontId = 'inter'
) => {
  const colors = getColors(paletteId);
  const fontFamily = PDF_FONTS[fontId] || FONT_FAMILY.sans;
  return StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: colors.background,
      fontFamily: fontFamily,
      paddingTop: 32,
      paddingBottom: 40,
      paddingHorizontal: 32
    },
    header: {
      paddingBottom: 20,
      borderBottom: `1 solid ${colors.cardBorder}`,
      marginBottom: 0,
      marginHorizontal: 0,
      paddingHorizontal: 0
    },
    name: {
      fontSize: 24,
      fontWeight: 700,
      color: colors.textPrimary,
      marginBottom: 12,
      fontFamily: fontFamily,
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
      backgroundColor: colors.cardBg,
      justifyContent: 'center',
      alignItems: 'center'
    },
    contactText: {
      fontSize: 9,
      color: colors.textSecondary
    },
    contactLink: {
      fontSize: 9,
      color: colors.experience,
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
      borderLeft: `2 solid ${colors.summary}`
    },
    summaryText: {
      fontSize: 10,
      color: colors.textSecondary,
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
    sectionTitle: {
      fontSize: 14,
      fontWeight: 600,
      color: colors.textPrimary,
      fontFamily: fontFamily,
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
      backgroundColor: colors.background,
      borderWidth: 2,
      borderColor: colors.experience,
      borderStyle: 'solid',
      marginTop: 6,
      flexShrink: 0
    },
    card: {
      backgroundColor: colors.cardBg,
      borderRadius: 8,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.cardBorder,
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
      color: colors.textPrimary,
      fontFamily: fontFamily,
      marginBottom: 3
    },
    company: {
      fontSize: 10,
      fontWeight: 600,
      color: colors.experience,
      fontFamily: fontFamily
    },
    location: {
      fontSize: 8,
      color: colors.textMuted,
      marginBottom: 2
    },
    dateRangeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 0
    },
    dateRange: {
      fontSize: 8,
      color: colors.textDark,
      fontFamily: FONT_FAMILY.mono
    },
    description: {
      fontSize: 9,
      color: colors.textMuted,
      lineHeight: 1.625
    },
    educationItem: {
      marginBottom: 8
    },
    degree: {
      fontSize: 11,
      fontWeight: 600,
      color: colors.textPrimary,
      fontFamily: fontFamily,
      marginBottom: 3
    },
    institution: {
      fontSize: 10,
      fontWeight: 600,
      color: colors.education,
      fontFamily: fontFamily
    },
    gpa: {
      fontSize: 8,
      color: colors.skills,
      marginTop: 3
    },
    skillsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6
    },
    skillTag: {
      fontSize: 9,
      color: colors.textSecondary,
      backgroundColor: colors.cardBg,
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      borderStyle: 'solid'
    },
    pageNumber: {
      position: 'absolute',
      bottom: 20,
      right: 0,
      fontSize: 8,
      color: colors.textDark
    }
  });
};
