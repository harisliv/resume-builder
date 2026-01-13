import React from 'react';
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { TResumeData } from '@/types';
import type { getColors } from '../ResumeStyles';
import { FONT_FAMILY } from '../fonts';

interface IClassicDocumentProps {
  data: TResumeData;
  colors: ReturnType<typeof getColors>;
  fontFamily: string;
}

export const ClassicDocument = ({ data, colors, fontFamily }: IClassicDocumentProps) => {
  const { personalInfo, experience, education, skills } = data;

  const classicStyles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#ffffff',
      fontFamily: fontFamily,
      paddingTop: 40,
      paddingBottom: 40,
      paddingHorizontal: 50
    },
    header: {
      textAlign: 'center',
      paddingBottom: 15,
      borderBottomWidth: 2,
      borderBottomColor: '#334155',
      marginBottom: 20
    },
    name: {
      fontSize: 22,
      fontWeight: 700,
      color: '#0f172a',
      textTransform: 'uppercase',
      letterSpacing: 2
    },
    contactRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginTop: 8,
      gap: 12
    },
    contactText: {
      fontSize: 9,
      color: '#475569'
    },
    sectionTitle: {
      fontSize: 11,
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: 1.5,
      marginBottom: 10,
      paddingBottom: 4,
      borderBottomWidth: 1
    },
    section: {
      marginBottom: 16
    },
    itemRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 2
    },
    itemTitle: {
      fontSize: 11,
      fontWeight: 700,
      color: '#0f172a'
    },
    itemSubtitle: {
      fontSize: 10,
      color: '#475569',
      fontStyle: 'italic'
    },
    itemDate: {
      fontSize: 8,
      color: '#64748b',
      fontFamily: FONT_FAMILY.mono
    },
    itemDescription: {
      fontSize: 9,
      color: '#475569',
      marginTop: 4,
      lineHeight: 1.5
    },
    skillsText: {
      fontSize: 9,
      color: '#475569',
      lineHeight: 1.5
    }
  });

  return (
    <Page size="A4" style={classicStyles.page} wrap>
      <View style={classicStyles.header}>
        <Text style={classicStyles.name}>
          {personalInfo?.fullName || 'Your Name'}
        </Text>
        <View style={classicStyles.contactRow}>
          {personalInfo?.email && (
            <Text style={classicStyles.contactText}>{personalInfo.email}</Text>
          )}
          {personalInfo?.phone && (
            <Text style={classicStyles.contactText}>• {personalInfo.phone}</Text>
          )}
          {personalInfo?.location && (
            <Text style={classicStyles.contactText}>
              • {personalInfo.location}
            </Text>
          )}
        </View>
      </View>

      {personalInfo?.summary && (
        <View style={classicStyles.section}>
          <Text
            style={[
              classicStyles.sectionTitle,
              { color: colors.summary, borderBottomColor: colors.summary }
            ]}
          >
            Professional Summary
          </Text>
          <Text style={classicStyles.itemDescription}>{personalInfo.summary}</Text>
        </View>
      )}

      {experience && experience.length > 0 && (
        <View style={classicStyles.section}>
          <Text
            style={[
              classicStyles.sectionTitle,
              { color: colors.experience, borderBottomColor: colors.experience }
            ]}
          >
            Professional Experience
          </Text>
          {experience.map((exp, index) => (
            <View key={index} style={{ marginBottom: 10 }} wrap={false}>
              <View style={classicStyles.itemRow}>
                <Text style={classicStyles.itemTitle}>{exp.position}</Text>
                <Text style={classicStyles.itemDate}>
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </Text>
              </View>
              <View style={classicStyles.itemRow}>
                <Text style={classicStyles.itemSubtitle}>{exp.company}</Text>
                <Text style={classicStyles.itemDate}>{exp.location}</Text>
              </View>
              <Text style={classicStyles.itemDescription}>{exp.description}</Text>
            </View>
          ))}
        </View>
      )}

      {education && education.length > 0 && (
        <View style={classicStyles.section}>
          <Text
            style={[
              classicStyles.sectionTitle,
              { color: colors.education, borderBottomColor: colors.education }
            ]}
          >
            Education
          </Text>
          {education.map((edu, index) => (
            <View key={index} style={{ marginBottom: 8 }} wrap={false}>
              <View style={classicStyles.itemRow}>
                <Text style={classicStyles.itemTitle}>
                  {edu.degree} in {edu.field}
                </Text>
                <Text style={classicStyles.itemDate}>{edu.graduationDate}</Text>
              </View>
              <View style={classicStyles.itemRow}>
                <Text style={classicStyles.itemSubtitle}>{edu.institution}</Text>
                <Text style={classicStyles.itemDate}>{edu.location}</Text>
              </View>
              {edu.gpa && (
                <Text style={[classicStyles.itemDate, { marginTop: 2 }]}>
                  GPA: {edu.gpa}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}

      {skills && skills.length > 0 && (
        <View style={classicStyles.section}>
          <Text
            style={[
              classicStyles.sectionTitle,
              { color: colors.skills, borderBottomColor: colors.skills }
            ]}
          >
            Skills
          </Text>
          <Text style={classicStyles.skillsText}>{skills.join(' • ')}</Text>
        </View>
      )}
    </Page>
  );
};
