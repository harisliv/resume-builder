import React from 'react';
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { TResumeData } from '@/types';
import type { getColors } from '../ResumeStyles';

interface IMinimalDocumentProps {
  data: TResumeData;
  colors: ReturnType<typeof getColors>;
  fontFamily: string;
}

export const MinimalDocument = ({ data, colors, fontFamily }: IMinimalDocumentProps) => {
  const { personalInfo, experience, education, skills } = data;

  const minimalStyles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#ffffff',
      fontFamily: fontFamily,
      paddingTop: 50,
      paddingBottom: 50,
      paddingHorizontal: 50
    },
    name: {
      fontSize: 18,
      fontWeight: 300,
      color: '#334155',
      letterSpacing: -0.5
    },
    contactRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 6,
      gap: 10
    },
    contactText: {
      fontSize: 9,
      color: '#64748b'
    },
    summary: {
      fontSize: 10,
      color: '#475569',
      lineHeight: 1.6,
      marginTop: 16,
      marginBottom: 16
    },
    divider: {
      borderBottomWidth: 0.5,
      borderBottomColor: '#e2e8f0',
      marginVertical: 12
    },
    sectionTitle: {
      fontSize: 10,
      fontWeight: 500,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 10
    },
    section: {
      marginBottom: 16
    },
    itemContainer: {
      marginBottom: 12
    },
    itemRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline'
    },
    itemTitle: {
      fontSize: 11,
      fontWeight: 500,
      color: '#334155'
    },
    itemSubtitle: {
      fontSize: 9,
      color: '#64748b'
    },
    itemDate: {
      fontSize: 8,
      color: '#94a3b8'
    },
    itemDescription: {
      fontSize: 9,
      color: '#64748b',
      marginTop: 3,
      lineHeight: 1.5
    },
    skillsText: {
      fontSize: 9,
      color: '#475569'
    }
  });

  return (
    <Page size="A4" style={minimalStyles.page} wrap>
      <Text style={minimalStyles.name}>
        {personalInfo?.fullName || 'Your Name'}
      </Text>
      <View style={minimalStyles.contactRow}>
        {personalInfo?.email && (
          <Text style={minimalStyles.contactText}>{personalInfo.email}</Text>
        )}
        {personalInfo?.phone && (
          <Text style={minimalStyles.contactText}>{personalInfo.phone}</Text>
        )}
        {personalInfo?.location && (
          <Text style={minimalStyles.contactText}>{personalInfo.location}</Text>
        )}
      </View>

      {personalInfo?.summary && (
        <Text style={minimalStyles.summary}>{personalInfo.summary}</Text>
      )}

      <View style={minimalStyles.divider} />

      {experience && experience.length > 0 && (
        <View style={minimalStyles.section}>
          <Text style={[minimalStyles.sectionTitle, { color: colors.experience }]}>
            Experience
          </Text>
          {experience.map((exp, index) => (
            <View key={index} style={minimalStyles.itemContainer} wrap={false}>
              <View style={minimalStyles.itemRow}>
                <Text style={minimalStyles.itemTitle}>{exp.position}</Text>
                <Text style={minimalStyles.itemDate}>
                  {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                </Text>
              </View>
              <Text style={minimalStyles.itemSubtitle}>
                {exp.company}, {exp.location}
              </Text>
              <Text style={minimalStyles.itemDescription}>{exp.description}</Text>
            </View>
          ))}
        </View>
      )}

      {education && education.length > 0 && (
        <View style={minimalStyles.section}>
          <Text style={[minimalStyles.sectionTitle, { color: colors.education }]}>
            Education
          </Text>
          {education.map((edu, index) => (
            <View key={index} style={minimalStyles.itemContainer} wrap={false}>
              <View style={minimalStyles.itemRow}>
                <View style={{ flexDirection: 'row', gap: 4 }}>
                  <Text style={minimalStyles.itemTitle}>
                    {edu.degree} in {edu.field}
                  </Text>
                  <Text style={minimalStyles.itemSubtitle}>
                    — {edu.institution}
                  </Text>
                </View>
                <Text style={minimalStyles.itemDate}>{edu.graduationDate}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {skills && skills.length > 0 && (
        <View style={minimalStyles.section}>
          <Text style={[minimalStyles.sectionTitle, { color: colors.skills }]}>
            Skills
          </Text>
          <Text style={minimalStyles.skillsText}>{skills.join(', ')}</Text>
        </View>
      )}
    </Page>
  );
};
