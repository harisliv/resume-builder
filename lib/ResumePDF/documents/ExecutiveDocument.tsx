import React from 'react';
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { TResumeData } from '@/types/schema';
import type { getColors } from '../ResumeStyles';
import { FONT_FAMILY } from '../fonts';

interface IExecutiveDocumentProps {
  data: TResumeData;
  colors: ReturnType<typeof getColors>;
  fontFamily: string;
}

export const ExecutiveDocument = ({
  data,
  colors,
  fontFamily
}: IExecutiveDocumentProps) => {
  const { personalInfo, experience, education, skills } = data;

  const styles = StyleSheet.create({
    page: {
      flexDirection: 'row',
      backgroundColor: '#ffffff',
      fontFamily: fontFamily
    },
    sidebar: {
      width: '30%',
      backgroundColor: colors.summary,
      paddingHorizontal: 20,
      paddingVertical: 24
    },
    name: {
      fontSize: 18,
      fontWeight: 700,
      color: '#ffffff',
      letterSpacing: -0.3,
      lineHeight: 1.2
    },
    contactSection: {
      marginTop: 20
    },
    contactItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8
    },
    contactText: {
      fontSize: 9,
      color: 'rgba(255,255,255,0.9)'
    },
    sidebarSectionTitle: {
      fontSize: 11,
      fontWeight: 700,
      color: 'rgba(255,255,255,0.6)',
      textTransform: 'uppercase',
      letterSpacing: 1.5,
      marginBottom: 10
    },
    skillsSection: {
      marginTop: 24
    },
    skillsWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 5
    },
    skillTag: {
      fontSize: 8,
      color: '#ffffff',
      backgroundColor: 'rgba(255,255,255,0.18)',
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderRadius: 20,
      fontWeight: 500
    },
    main: {
      width: '70%',
      paddingHorizontal: 24,
      paddingVertical: 24
    },
    sectionTitle: {
      fontSize: 11,
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: 1.5,
      marginBottom: 10
    },
    summaryText: {
      fontSize: 9,
      color: '#475569',
      lineHeight: 1.6
    },
    section: {
      marginTop: 18
    },
    entryContainer: {
      borderLeftWidth: 2,
      paddingLeft: 10,
      marginBottom: 10
    },
    entryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    entryTitle: {
      fontSize: 11,
      fontWeight: 600,
      color: '#0f172a'
    },
    entrySubtitle: {
      fontSize: 10,
      fontWeight: 600
    },
    entryLocation: {
      fontSize: 8,
      color: '#64748b'
    },
    entryDate: {
      fontSize: 8,
      color: '#94a3b8',
      fontFamily: FONT_FAMILY.mono
    },
    entryDescription: {
      fontSize: 9,
      color: '#475569',
      lineHeight: 1.5,
      marginTop: 4
    },
    gpa: {
      fontSize: 8,
      marginTop: 2,
      fontWeight: 500
    }
  });

  return (
    <Page size="A4" style={styles.page} wrap>
      <View style={styles.sidebar}>
        <Text style={styles.name}>
          {personalInfo?.fullName || 'Your Name'}
        </Text>

        <View style={styles.contactSection}>
          {personalInfo?.email && (
            <View style={styles.contactItem}>
              <Text style={styles.contactText}>{personalInfo.email}</Text>
            </View>
          )}
          {personalInfo?.phone && (
            <View style={styles.contactItem}>
              <Text style={styles.contactText}>{personalInfo.phone}</Text>
            </View>
          )}
          {personalInfo?.location && (
            <View style={styles.contactItem}>
              <Text style={styles.contactText}>{personalInfo.location}</Text>
            </View>
          )}
        </View>

        {skills && skills.length > 0 && (
          <View style={styles.skillsSection}>
            <Text style={styles.sidebarSectionTitle}>Skills</Text>
            <View style={styles.skillsWrap}>
              {skills.map((skill, index) => (
                <Text key={index} style={styles.skillTag}>
                  {skill}
                </Text>
              ))}
            </View>
          </View>
        )}
      </View>

      <View style={styles.main}>
        {personalInfo?.summary && (
          <View>
            <Text style={[styles.sectionTitle, { color: colors.summary }]}>
              Summary
            </Text>
            <Text style={styles.summaryText}>{personalInfo.summary}</Text>
          </View>
        )}

        {experience && experience.length > 0 && (
          <View style={styles.section}>
            <Text
              style={[styles.sectionTitle, { color: colors.experience }]}
            >
              Experience
            </Text>
            {experience.map((exp, index) => (
              <View
                key={index}
                style={[
                  styles.entryContainer,
                  { borderLeftColor: colors.experience }
                ]}
                wrap={false}
              >
                <View style={styles.entryRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.entryTitle}>{exp.position}</Text>
                    <Text
                      style={[
                        styles.entrySubtitle,
                        { color: colors.experience }
                      ]}
                    >
                      {exp.company}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end', flexShrink: 0 }}>
                    <Text style={styles.entryLocation}>{exp.location}</Text>
                    <Text style={styles.entryDate}>
                      {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                    </Text>
                  </View>
                </View>
                <Text style={styles.entryDescription}>{exp.description}</Text>
                {exp.highlights && exp.highlights.length > 0 && (
                  <View style={{ marginTop: 4 }}>
                    {exp.highlights.map((h, i) => (
                      <View key={i} style={{ flexDirection: 'row', marginBottom: 2 }}>
                        <Text style={{ fontSize: 9, color: '#475569', marginRight: 6 }}>•</Text>
                        <Text style={{ fontSize: 9, color: '#475569', flex: 1, lineHeight: 1.5 }}>{h}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {education && education.length > 0 && (
          <View style={styles.section}>
            <Text
              style={[styles.sectionTitle, { color: colors.education }]}
            >
              Education
            </Text>
            {education.map((edu, index) => (
              <View
                key={index}
                style={[
                  styles.entryContainer,
                  { borderLeftColor: colors.education }
                ]}
                wrap={false}
              >
                <View style={styles.entryRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.entryTitle}>
                      {edu.degree} in {edu.field}
                    </Text>
                    <Text
                      style={[
                        styles.entrySubtitle,
                        { color: colors.education }
                      ]}
                    >
                      {edu.institution}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end', flexShrink: 0 }}>
                    <Text style={styles.entryLocation}>{edu.location}</Text>
                    <Text style={styles.entryDate}>
                      {edu.graduationDate}
                    </Text>
                    {edu.gpa && (
                      <Text style={[styles.gpa, { color: colors.skills }]}>
                        GPA: {edu.gpa}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </Page>
  );
};
