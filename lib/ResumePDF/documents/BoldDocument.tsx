import React from 'react';
import { Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import type { TResumeData } from '@/types/schema';
import type { getColors } from '../ResumeStyles';
import { FONT_FAMILY } from '../fonts';
import { formatPosition } from '@/components/ResumePreview/formatPosition';
import { groupExperience } from '@/components/ResumePreview/groupExperience';
import { getSkillEntries } from '@/lib/skills';

interface IBoldDocumentProps {
  data: TResumeData;
  colors: ReturnType<typeof getColors>;
  fontFamily: string;
}

export const BoldDocument = ({
  data,
  colors,
  fontFamily
}: IBoldDocumentProps) => {
  const { personalInfo, experience, education, skills } = data;
  const skillEntries = getSkillEntries(skills);

  /** Minimum points of content required ahead to prevent orphaned headers */
  const MIN_PRESENCE = { experience: 110, education: 90, skills: 45 } as const;

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
      backgroundColor: `${colors.summary}15`,
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
            <Link
              src={`mailto:${personalInfo.email}`}
              style={boldStyles.contactText}
            >
              {personalInfo.email}
            </Link>
          )}
          {personalInfo?.phone && (
            <Link src={`tel:${personalInfo.phone}`} style={boldStyles.contactText}>
              {personalInfo.phone}
            </Link>
          )}
          {personalInfo?.linkedIn && (
            <Link src={personalInfo.linkedIn} style={boldStyles.contactText}>
              LinkedIn
            </Link>
          )}
          {personalInfo?.website && (
            <Link src={personalInfo.website} style={boldStyles.contactText}>
              Portfolio
            </Link>
          )}
          {personalInfo?.location && (
            <Text style={boldStyles.contactText}>{personalInfo.location}</Text>
          )}
        </View>
      </View>

      <View style={boldStyles.body}>
        {personalInfo?.summary && (
          <View style={boldStyles.summaryBox} wrap={false}>
            <Text style={boldStyles.summaryText}>{personalInfo.summary}</Text>
          </View>
        )}

        {experience && experience.length > 0 && (
          <>
            <View style={boldStyles.sectionHeader} minPresenceAhead={MIN_PRESENCE.experience}>
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
            {groupExperience(experience).map((group, gi) => {
              const [firstEntry, ...restEntries] = group.entries;
              return (
                <View
                  key={gi}
                  style={[
                    boldStyles.card,
                    { borderLeftColor: colors.experience }
                  ]}
                >
                  {/* Company header + first role coupled */}
                  <View wrap={false}>
                    <View style={boldStyles.cardRow}>
                      <View>
                        <Text style={boldStyles.itemTitle}>{group.company}</Text>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={boldStyles.itemDate}>
                          {group.startDate} →{' '}
                          {group.current ? 'Present' : group.endDate}
                        </Text>
                        {group.location ? (
                          <Text style={boldStyles.itemLocation}>
                            {group.location}
                          </Text>
                        ) : null}
                      </View>
                    </View>
                    {firstEntry && (
                      <View style={{ marginTop: 4 }}>
                        <Text
                          style={[
                            boldStyles.itemSubtitle,
                            { color: colors.experience }
                          ]}
                        >
                          {formatPosition(firstEntry.position, firstEntry.projectName)}
                        </Text>
                        {firstEntry.description ? (
                          <Text style={boldStyles.itemDescription}>
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
                                  {h.value}
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
                          boldStyles.itemSubtitle,
                          { color: colors.experience }
                        ]}
                      >
                        {formatPosition(exp.position, exp.projectName)}
                      </Text>
                      {exp.description ? (
                        <Text style={boldStyles.itemDescription}>
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
                                {h.value}
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
          </>
        )}

        {education && education.length > 0 && (() => {
          const [firstEdu, ...restEdu] = education;
          return (
            <>
              <View style={boldStyles.sectionHeader} minPresenceAhead={MIN_PRESENCE.education}>
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
              {/* Header + first item coupled */}
              {firstEdu && (
                <View
                  style={[boldStyles.card, { borderLeftColor: colors.education }]}
                  wrap={false}
                >
                  <View style={boldStyles.cardRow}>
                    <View>
                      <Text style={boldStyles.itemTitle}>
                        {firstEdu.degree} in {firstEdu.field}
                      </Text>
                      <Text
                        style={[
                          boldStyles.itemSubtitle,
                          { color: colors.education }
                        ]}
                      >
                        {firstEdu.institution}
                      </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={boldStyles.itemLocation}>{firstEdu.location}</Text>
                      <Text style={boldStyles.itemDate}>
                        {firstEdu.graduationDate}
                      </Text>
                      {firstEdu.gpa && (
                        <Text
                          style={[boldStyles.itemDate, { color: colors.skills }]}
                        >
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
                      <Text style={boldStyles.itemDate}>
                        {edu.graduationDate}
                      </Text>
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
          );
        })()}

        {skillEntries.length > 0 && (
          <View wrap={false}>
            <View style={boldStyles.sectionHeader} minPresenceAhead={MIN_PRESENCE.skills}>
              <View
                style={[
                  boldStyles.sectionBar,
                  { backgroundColor: colors.skills }
                ]}
              />
              <Text style={[boldStyles.sectionTitle, { color: colors.skills }]}>
                Skills
              </Text>
            </View>
            <View>
              {skillEntries.map(([category, values]) => (
                <View key={category} style={{ marginBottom: 8 }}>
                  <Text
                    style={[
                      boldStyles.itemSubtitle,
                      { color: colors.skills, marginBottom: 4 }
                    ]}
                  >
                    {category}
                  </Text>
                  <View style={boldStyles.skillsContainer}>
                    {values.map((skill, index) => (
                      <Text key={`${category}-${index}`} style={boldStyles.skillTag}>
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
    </Page>
  );
};
