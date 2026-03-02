import React from 'react';
import { Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import type { TResumeData } from '@/types/schema';
import type { getColors } from '../ResumeStyles';
import { FONT_FAMILY } from '../fonts';
import { groupExperience } from '@/components/ResumePreview/groupExperience';
import { getSkillEntries } from '@/lib/skills';

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
  const skillEntries = getSkillEntries(skills);

  /** Minimum points of content required ahead to prevent orphaned headers */
  const MIN_PRESENCE = { experience: 110, education: 90, skills: 45 } as const;

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
              <Link
                src={`mailto:${personalInfo.email}`}
                style={styles.contactText}
              >
                {personalInfo.email}
              </Link>
            </View>
          )}
          {personalInfo?.phone && (
            <View style={styles.contactItem}>
              <Link src={`tel:${personalInfo.phone}`} style={styles.contactText}>
                {personalInfo.phone}
              </Link>
            </View>
          )}
          {personalInfo?.linkedIn && (
            <View style={styles.contactItem}>
              <Link src={personalInfo.linkedIn} style={styles.contactText}>
                LinkedIn
              </Link>
            </View>
          )}
          {personalInfo?.website && (
            <View style={styles.contactItem}>
              <Link src={personalInfo.website} style={styles.contactText}>
                Portfolio
              </Link>
            </View>
          )}
          {personalInfo?.location && (
            <View style={styles.contactItem}>
              <Text style={styles.contactText}>{personalInfo.location}</Text>
            </View>
          )}
        </View>

        {skillEntries.length > 0 && (
          <View style={styles.skillsSection}>
            <Text style={styles.sidebarSectionTitle}>Skills</Text>
            <View>
              {skillEntries.map(([category, values]) => (
                <View key={category} style={{ marginBottom: 8 }}>
                  <Text style={[styles.contactText, { marginBottom: 4 }]}>
                    {category}
                  </Text>
                  <View style={styles.skillsWrap}>
                    {values.map((skill, index) => (
                      <Text key={`${category}-${index}`} style={styles.skillTag}>
                        {skill}
                      </Text>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

      <View style={styles.main}>
        {personalInfo?.summary && (
          <View wrap={false}>
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
              minPresenceAhead={MIN_PRESENCE.experience}
            >
              Experience
            </Text>
            {groupExperience(experience).map((group, gi) => {
              const [firstEntry, ...restEntries] = group.entries;
              return (
                <View
                  key={gi}
                  style={[
                    styles.entryContainer,
                    { borderLeftColor: colors.experience }
                  ]}
                >
                  {/* Company header + first role coupled */}
                  <View wrap={false}>
                    <View style={styles.entryRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.entryTitle}>{group.company}</Text>
                      </View>
                      <View style={{ alignItems: 'flex-end', flexShrink: 0 }}>
                        <Text style={styles.entryDate}>
                          {group.startDate} —{' '}
                          {group.current ? 'Present' : group.endDate}
                        </Text>
                        {group.location ? (
                          <Text style={styles.entryLocation}>
                            {group.location}
                          </Text>
                        ) : null}
                      </View>
                    </View>
                    {firstEntry && (
                      <View style={{ marginTop: 4 }}>
                        <Text
                          style={[
                            styles.entrySubtitle,
                            { color: colors.experience }
                          ]}
                        >
                          {firstEntry.position}
                        </Text>
                        {firstEntry.description ? (
                          <Text style={styles.entryDescription}>
                            {firstEntry.description}
                          </Text>
                        ) : null}
                        {firstEntry.highlights && firstEntry.highlights.length > 0 && (
                          <View style={{ marginTop: 4 }}>
                            {firstEntry.highlights.map((h, i) => (
                              <View
                                key={i}
                                style={{
                                  flexDirection: 'row',
                                  marginBottom: 2
                                }}
                              >
                                <Text
                                  style={{
                                    fontSize: 9,
                                    color: '#475569',
                                    marginRight: 6
                                  }}
                                >
                                  •
                                </Text>
                                <Text
                                  style={{
                                    fontSize: 9,
                                    color: '#475569',
                                    flex: 1,
                                    lineHeight: 1.5
                                  }}
                                >
                                  {h}
                                </Text>
                              </View>
                            ))}
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                  {/* Remaining role entries */}
                  {restEntries.map((exp, ei) => (
                    <View key={ei} style={{ marginTop: 4 }} wrap={false}>
                      <Text
                        style={[
                          styles.entrySubtitle,
                          { color: colors.experience }
                        ]}
                      >
                        {exp.position}
                      </Text>
                      {exp.description ? (
                        <Text style={styles.entryDescription}>
                          {exp.description}
                        </Text>
                      ) : null}
                      {exp.highlights && exp.highlights.length > 0 && (
                        <View style={{ marginTop: 4 }}>
                          {exp.highlights.map((h, i) => (
                            <View
                              key={i}
                              style={{
                                flexDirection: 'row',
                                marginBottom: 2
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 9,
                                  color: '#475569',
                                  marginRight: 6
                                }}
                              >
                                •
                              </Text>
                              <Text
                                style={{
                                  fontSize: 9,
                                  color: '#475569',
                                  flex: 1,
                                  lineHeight: 1.5
                                }}
                              >
                                {h}
                              </Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              );
            })}
          </View>
        )}

        {education && education.length > 0 && (() => {
          const [firstEdu, ...restEdu] = education;
          return (
            <View style={styles.section}>
              <Text
                style={[styles.sectionTitle, { color: colors.education }]}
                minPresenceAhead={MIN_PRESENCE.education}
              >
                Education
              </Text>
              {/* Header + first item coupled */}
              {firstEdu && (
                <View
                  style={[
                    styles.entryContainer,
                    { borderLeftColor: colors.education }
                  ]}
                  wrap={false}
                >
                  <View style={styles.entryRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.entryTitle}>
                        {firstEdu.degree} in {firstEdu.field}
                      </Text>
                      <Text
                        style={[
                          styles.entrySubtitle,
                          { color: colors.education }
                        ]}
                      >
                        {firstEdu.institution}
                      </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end', flexShrink: 0 }}>
                      <Text style={styles.entryLocation}>{firstEdu.location}</Text>
                      <Text style={styles.entryDate}>
                        {firstEdu.graduationDate}
                      </Text>
                      {firstEdu.gpa && (
                        <Text style={[styles.gpa, { color: colors.skills }]}>
                          GPA: {firstEdu.gpa}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              )}
              {restEdu.map((edu, index) => (
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
          );
        })()}
      </View>
    </Page>
  );
};
