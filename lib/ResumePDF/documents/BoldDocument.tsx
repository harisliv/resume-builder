import React from 'react';
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { TResumeData } from '@/types';
import type { getColors } from '../ResumeStyles';
import { FONT_FAMILY } from '../fonts';

interface IBoldDocumentProps {
  data: TResumeData;
  colors: ReturnType<typeof getColors>;
  fontFamily: string;
}

export const BoldDocument = ({ data, colors, fontFamily }: IBoldDocumentProps) => {
  const { personalInfo, experience, education, skills } = data;

  const boldStyles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#ffffff',
      fontFamily: fontFamily,
      paddingTop: 0,
      paddingBottom: 40,
      paddingHorizontal: 0
    },
    headerContainer: {
      backgroundColor: colors.summary,
      paddingVertical: 24,
      paddingHorizontal: 32
    },
    name: {
      fontSize: 28,
      fontWeight: 900,
      color: '#ffffff',
      letterSpacing: -0.5
    },
    contactRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 8,
      gap: 16
    },
    contactText: {
      fontSize: 10,
      color: 'rgba(255,255,255,0.9)'
    },
    body: {
      paddingHorizontal: 32,
      paddingTop: 20
    },
    summaryBox: {
      backgroundColor: `${colors.summary  }15`,
      padding: 14,
      borderRadius: 6,
      marginBottom: 20
    },
    summaryText: {
      fontSize: 10,
      color: '#334155',
      lineHeight: 1.6,
      fontWeight: 500
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 12,
      marginTop: 8
    },
    sectionBar: {
      width: 30,
      height: 4,
      borderRadius: 2
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: 900,
      textTransform: 'uppercase',
      letterSpacing: 0.5
    },
    card: {
      paddingLeft: 12,
      paddingVertical: 10,
      paddingRight: 12,
      borderLeftWidth: 4,
      backgroundColor: '#f8fafc',
      borderRadius: 4,
      marginBottom: 10
    },
    cardRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 4
    },
    itemTitle: {
      fontSize: 12,
      fontWeight: 700,
      color: '#0f172a'
    },
    itemSubtitle: {
      fontSize: 11,
      fontWeight: 700
    },
    itemLocation: {
      fontSize: 8,
      color: '#64748b',
      fontWeight: 500
    },
    itemDate: {
      fontSize: 8,
      color: '#94a3b8',
      fontFamily: FONT_FAMILY.mono,
      fontWeight: 700
    },
    itemDescription: {
      fontSize: 9,
      color: '#475569',
      lineHeight: 1.5,
      marginTop: 4
    },
    skillsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6
    },
    skillTag: {
      fontSize: 9,
      color: '#ffffff',
      backgroundColor: colors.skills,
      paddingVertical: 5,
      paddingHorizontal: 12,
      borderRadius: 20,
      fontWeight: 600
    }
  });

  return (
    <Page size="A4" style={boldStyles.page} wrap>
      <View style={boldStyles.headerContainer}>
        <Text style={boldStyles.name}>
          {personalInfo?.fullName || 'Your Name'}
        </Text>
        <View style={boldStyles.contactRow}>
          {personalInfo?.email && (
            <Text style={boldStyles.contactText}>{personalInfo.email}</Text>
          )}
          {personalInfo?.phone && (
            <Text style={boldStyles.contactText}>{personalInfo.phone}</Text>
          )}
          {personalInfo?.location && (
            <Text style={boldStyles.contactText}>{personalInfo.location}</Text>
          )}
        </View>
      </View>

      <View style={boldStyles.body}>
        {personalInfo?.summary && (
          <View style={boldStyles.summaryBox}>
            <Text style={boldStyles.summaryText}>{personalInfo.summary}</Text>
          </View>
        )}

        {experience && experience.length > 0 && (
          <>
            <View style={boldStyles.sectionHeader}>
              <View
                style={[
                  boldStyles.sectionBar,
                  { backgroundColor: colors.experience }
                ]}
              />
              <Text
                style={[boldStyles.sectionTitle, { color: colors.experience }]}
              >
                Experience
              </Text>
            </View>
            {experience.map((exp, index) => (
              <View
                key={index}
                style={[
                  boldStyles.card,
                  { borderLeftColor: colors.experience }
                ]}
                wrap={false}
              >
                <View style={boldStyles.cardRow}>
                  <View>
                    <Text style={boldStyles.itemTitle}>{exp.position}</Text>
                    <Text
                      style={[
                        boldStyles.itemSubtitle,
                        { color: colors.experience }
                      ]}
                    >
                      {exp.company}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={boldStyles.itemLocation}>{exp.location}</Text>
                    <Text style={boldStyles.itemDate}>
                      {exp.startDate} → {exp.current ? 'Present' : exp.endDate}
                    </Text>
                  </View>
                </View>
                <Text style={boldStyles.itemDescription}>{exp.description}</Text>
              </View>
            ))}
          </>
        )}

        {education && education.length > 0 && (
          <>
            <View style={boldStyles.sectionHeader}>
              <View
                style={[
                  boldStyles.sectionBar,
                  { backgroundColor: colors.education }
                ]}
              />
              <Text
                style={[boldStyles.sectionTitle, { color: colors.education }]}
              >
                Education
              </Text>
            </View>
            {education.map((edu, index) => (
              <View
                key={index}
                style={[boldStyles.card, { borderLeftColor: colors.education }]}
                wrap={false}
              >
                <View style={boldStyles.cardRow}>
                  <View>
                    <Text style={boldStyles.itemTitle}>
                      {edu.degree} in {edu.field}
                    </Text>
                    <Text
                      style={[
                        boldStyles.itemSubtitle,
                        { color: colors.education }
                      ]}
                    >
                      {edu.institution}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={boldStyles.itemLocation}>{edu.location}</Text>
                    <Text style={boldStyles.itemDate}>{edu.graduationDate}</Text>
                    {edu.gpa && (
                      <Text
                        style={[boldStyles.itemDate, { color: colors.skills }]}
                      >
                        GPA: {edu.gpa}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </>
        )}

        {skills && skills.length > 0 && (
          <>
            <View style={boldStyles.sectionHeader}>
              <View
                style={[boldStyles.sectionBar, { backgroundColor: colors.skills }]}
              />
              <Text style={[boldStyles.sectionTitle, { color: colors.skills }]}>
                Skills
              </Text>
            </View>
            <View style={boldStyles.skillsContainer}>
              {skills.map((skill, index) => (
                <Text key={index} style={boldStyles.skillTag}>
                  {skill}
                </Text>
              ))}
            </View>
          </>
        )}
      </View>
    </Page>
  );
};
