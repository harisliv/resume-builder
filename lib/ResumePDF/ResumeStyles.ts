import { StyleSheet } from '@react-pdf/renderer';

export const NORMAL_FONT_SIZE = 10;

export const createStyles = () =>
  StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#ffffff',
      padding: 32,
      fontSize: NORMAL_FONT_SIZE,
      fontFamily: 'Helvetica'
    },
    header: {
      marginBottom: 16
    },
    name: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#000000',
      marginBottom: 8,
      fontFamily: 'Helvetica-Bold'
    },
    contactRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 16,
      fontSize: NORMAL_FONT_SIZE,
      color: '#4b5563'
    },
    contactItem: {
      color: '#4b5563'
    },
    separator: {
      height: 1,
      backgroundColor: '#d1d5db',
      marginVertical: 12
    },
    section: {
      marginBottom: 16
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: 8,
      textTransform: 'uppercase',
      fontFamily: 'Helvetica-Bold'
    },
    summary: {
      fontSize: NORMAL_FONT_SIZE,
      color: '#374151',
      lineHeight: 1.5
    },
    experienceItem: {
      marginBottom: 12
    },
    experienceHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 4
    },
    experienceLeft: {},
    experienceRight: {
      textAlign: 'right'
    },
    position: {
      fontSize: 11,
      fontWeight: 'bold',
      color: '#111827',
      fontFamily: 'Helvetica-Bold'
    },
    company: {
      fontSize: NORMAL_FONT_SIZE,
      color: '#374151'
    },
    location: {
      fontSize: NORMAL_FONT_SIZE,
      color: '#4b5563'
    },
    dateRange: {
      fontSize: NORMAL_FONT_SIZE,
      color: '#4b5563'
    },
    description: {
      fontSize: NORMAL_FONT_SIZE,
      color: '#374151',
      lineHeight: 1.5,
      marginTop: 8
    },
    educationItem: {
      marginBottom: 8
    },
    educationHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    },
    educationLeft: {},
    educationRight: {
      textAlign: 'right'
    },
    degree: {
      fontSize: 11,
      fontWeight: 'bold',
      color: '#111827',
      fontFamily: 'Helvetica-Bold'
    },
    institution: {
      fontSize: NORMAL_FONT_SIZE,
      color: '#374151'
    },
    gpa: {
      fontSize: NORMAL_FONT_SIZE,
      color: '#4b5563'
    },
    skillsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8
    },
    skillTag: {
      fontSize: NORMAL_FONT_SIZE,
      backgroundColor: '#e5e7eb',
      color: '#1f2937',
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 4
    }
  });
