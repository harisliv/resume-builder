/**
 * @file ClassicDocument.tsx
 * @description PDF export document for the Classic resume style.
 * Uses unified section header color (colors.summary), accent-colored position/degree titles,
 * pipe-separated contact info, and subtle bar prefixes on section headers.
 * Must stay visually in sync with components/ResumePreview/ClassicStyle.tsx.
 */
import React from 'react';
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { TResumeData } from '@/types/schema';
import type { getColors } from '../ResumeStyles';
import { FONT_FAMILY } from '../fonts';
import { groupExperience } from '@/components/ResumePreview/groupExperience';
import { CalendarIcon } from '../icons/CalendarIcon';
import { getSkillEntries } from '@/lib/skills';

interface IClassicDocumentProps {
  data: TResumeData;
  colors: ReturnType<typeof getColors>;
  fontFamily: string;
}

export const ClassicDocument = ({
  data,
  colors,
  fontFamily
}: IClassicDocumentProps) => {
  const { personalInfo, experience, education, skills } = data;
  const skillEntries = getSkillEntries(skills);

  /** Minimum points of content required ahead to prevent orphaned headers */
  const MIN_PRESENCE = { experience: 110, education: 90, skills: 45 } as const;

  const classicStyles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#ffffff',
      fontFamily: fontFamily,
      paddingTop: 44,
      paddingBottom: 60,
      paddingHorizontal: 50
    },
    header: {
      textAlign: 'center',
      paddingBottom: 20,
      marginBottom: 20
    },
    /** Colored accent line under the name */
    nameAccentLine: {
      width: 48,
      height: 2,
      backgroundColor: colors.summary,
      alignSelf: 'center',
      marginTop: 8
    },
    /** Header-specific divider spacing */
    headerDividerWrap: {
      marginTop: 12,
      gap: 2
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
      gap: 8
    },
    contactText: {
      fontSize: 9,
      color: '#475569'
    },
    contactSeparator: {
      fontSize: 8,
      color: colors.education
    },
    /** Flex row wrapping the colored bar + section title text */
    sectionTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 4
    },
    /** Double-line divider reused under header and section titles */
    dividerWrap: {
      gap: 2,
      marginBottom: 10
    },
    dividerColored: {
      height: 1,
      backgroundColor: colors.summary
    },
    dividerSlate: {
      height: 1,
      backgroundColor: '#e2e8f0'
    },
    /** Small colored bar prefix for section headers */
    sectionBar: {
      width: 4,
      height: 14,
      backgroundColor: colors.summary,
      borderRadius: 1
    },
    sectionTitle: {
      fontSize: 11,
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: 1.5,
      color: colors.summary
    },
    section: {
      marginBottom: 20
    },
    /** Outer row: left column (title + subtitle) | right column (date + location) */
    itemRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 2
    },
    /** Left column: position/degree + company/institution with normal spacing */
    itemLeft: {
      flex: 1,
      gap: 2
    },
    /** Right column: date + location, tighter spacing */
    itemRight: {
      alignItems: 'flex-end',
      gap: 2
    },
    itemTitle: {
      fontSize: 11,
      fontWeight: 700,
      color: colors.education
    },
    /** Experience company aligns with Aesthetic neutral heading tone */
    experienceCompany: {
      fontSize: 11,
      fontWeight: 700,
      color: '#1e293b'
    },
    /** Company marker row mirrors Aesthetic left border accent */
    experienceCompanyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6
    },
    experienceCompanyMarker: {
      width: 2.5,
      height: 10,
      backgroundColor: colors.summary
    },
    itemSubtitle: {
      fontSize: 10,
      color: '#475569'
    },
    /** Experience role aligns with Aesthetic secondary accent */
    experiencePosition: {
      fontSize: 10,
      fontWeight: 600,
      color: colors.experience
    },
    itemDate: {
      fontSize: 8,
      color: '#64748b',
      fontFamily: FONT_FAMILY.mono
    },
    /** Experience date uses accent; location uses muted neutral */
    experienceDate: {
      fontSize: 8,
      color: colors.education,
      fontWeight: 700
    },
    /** Date icon + text row mirrors Aesthetic metadata treatment */
    experienceDateRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 4
    },
    experienceDateArrow: {
      color: colors.experience
    },
    experienceLocation: {
      fontSize: 8,
      color: '#64748b',
      fontWeight: 600,
      fontFamily: FONT_FAMILY.mono
    },
    /** Full-width institution row with right-side date/location metadata */
    educationInstitutionRow: {
      marginTop: 4,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    },
    /** Education right meta lifted to align with institute row */
    educationMetaRight: {
      alignItems: 'flex-end',
      gap: 0,
      marginTop: -7
    },
    educationInstitution: {
      flex: 1,
      fontSize: 10,
      fontWeight: 600,
      color: colors.experience
    },
    /** GPA shown at end of degree line in section-accent color */
    educationGpaInline: {
      marginLeft: 8,
      fontSize: 8,
      color: colors.summary,
      fontWeight: 600
    },
    itemDescription: {
      fontSize: 9,
      color: '#475569',
      marginTop: 4,
      lineHeight: 1.5
    },
    /** Italic for experience position descriptions only */
    positionDescription: {
      fontSize: 9,
      color: '#475569',
      marginTop: 4,
      lineHeight: 1.5,
      fontStyle: 'italic'
    },
    skillsText: {
      fontSize: 9,
      color: '#475569',
      lineHeight: 1.5
    },
    skillCategory: {
      fontWeight: 700
    },
    /** Fixed footer for multi-page pagination */
    footer: {
      position: 'absolute',
      bottom: 20,
      left: 50,
      right: 50,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center'
    },
    footerText: {
      fontSize: 8,
      color: '#94a3b8'
    }
  });

  /** Collects non-empty contact fields into an ordered array */
  const contactItems: React.ReactNode[] = [];
  if (personalInfo?.email)
    contactItems.push(
      <Text key="email" style={classicStyles.contactText}>
        {personalInfo.email}
      </Text>
    );
  if (personalInfo?.phone)
    contactItems.push(
      <Text key="phone" style={classicStyles.contactText}>
        {personalInfo.phone}
      </Text>
    );
  if (personalInfo?.location)
    contactItems.push(
      <Text key="location" style={classicStyles.contactText}>
        {personalInfo.location}
      </Text>
    );
  if (personalInfo?.linkedIn)
    contactItems.push(
      <Text key="linkedin" style={classicStyles.contactText}>
        LinkedIn
      </Text>
    );
  if (personalInfo?.website)
    contactItems.push(
      <Text key="website" style={classicStyles.contactText}>
        Portfolio
      </Text>
    );

  return (
    <Page size="A4" style={classicStyles.page} wrap>
      <View style={classicStyles.header}>
        <Text style={classicStyles.name}>
          {personalInfo?.fullName || 'Your Name'}
        </Text>
        <View style={classicStyles.nameAccentLine} />
        <View style={classicStyles.contactRow}>
          {contactItems.map((item, i) => (
            <React.Fragment key={i}>
              {i > 0 && <Text style={classicStyles.contactSeparator}> | </Text>}
              {item}
            </React.Fragment>
          ))}
        </View>
        {/* Double-line divider */}
        <View style={classicStyles.headerDividerWrap}>
          <View style={classicStyles.dividerColored} />
          <View style={classicStyles.dividerSlate} />
        </View>
      </View>

      {personalInfo?.summary && (
        <View style={classicStyles.section} wrap={false}>
          <View style={classicStyles.sectionTitleRow}>
            <View style={classicStyles.sectionBar} />
            <Text style={classicStyles.sectionTitle}>Professional Summary</Text>
          </View>
          <View style={classicStyles.dividerWrap}>
            <View style={classicStyles.dividerColored} />
            <View style={classicStyles.dividerSlate} />
          </View>
          <Text style={classicStyles.itemDescription}>
            {personalInfo.summary}
          </Text>
        </View>
      )}

      {experience && experience.length > 0 && (
        <View style={classicStyles.section}>
          <View
            style={classicStyles.sectionTitleRow}
            minPresenceAhead={MIN_PRESENCE.experience}
          >
            <View style={classicStyles.sectionBar} />
            <Text style={classicStyles.sectionTitle}>
              Professional Experience
            </Text>
          </View>
          <View style={classicStyles.dividerWrap}>
            <View style={classicStyles.dividerColored} />
            <View style={classicStyles.dividerSlate} />
          </View>
          {groupExperience(experience).map((group, gi) => {
            const [firstEntry, ...restEntries] = group.entries;
            return (
              <View key={gi} style={{ marginBottom: 10 }}>
                {/* Company header + first role coupled to prevent orphan */}
                <View wrap={false}>
                  <View style={classicStyles.itemRow}>
                    <View style={classicStyles.itemLeft}>
                      <View style={classicStyles.experienceCompanyRow}>
                        <View style={classicStyles.experienceCompanyMarker} />
                        <Text style={classicStyles.experienceCompany}>
                          {group.company}
                        </Text>
                      </View>
                      {firstEntry ? (
                        <Text style={classicStyles.experiencePosition}>
                          {firstEntry.position}
                        </Text>
                      ) : null}
                    </View>
                    <View style={classicStyles.itemRight}>
                      <View style={classicStyles.experienceDateRow}>
                        <CalendarIcon size={8} color={colors.experience} />
                        <Text style={classicStyles.experienceDate}>
                          {group.startDate}{' '}
                          <Text style={classicStyles.experienceDateArrow}>
                            →
                          </Text>{' '}
                          {group.current ? 'Present' : group.endDate}
                        </Text>
                      </View>
                      {group.location ? (
                        <Text style={classicStyles.experienceLocation}>
                          {group.location}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                  {firstEntry && (
                    <View style={{ marginTop: 4 }}>
                      {firstEntry.description ? (
                        <Text style={classicStyles.positionDescription}>
                          {firstEntry.description}
                        </Text>
                      ) : null}
                      {firstEntry.highlights &&
                        firstEntry.highlights.length > 0 && (
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
                  <View key={ei} style={{ marginTop: 4 }}>
                    <Text style={classicStyles.experiencePosition}>
                      {exp.position}
                    </Text>
                    {exp.description ? (
                      <Text style={classicStyles.positionDescription}>
                        {exp.description}
                      </Text>
                    ) : null}
                    {exp.highlights && exp.highlights.length > 0 && (
                      <View style={{ marginTop: 4 }}>
                        {exp.highlights.map((h, i) => (
                          <View
                            key={i}
                            style={{ flexDirection: 'row', marginBottom: 2 }}
                            wrap={false}
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

      {education &&
        education.length > 0 &&
        (() => {
          const [firstEdu, ...restEdu] = education;
          return (
            <View style={classicStyles.section}>
              {/* Keep header/divider coupled with first item to prevent orphaned section title */}
              <View wrap={false}>
                <View
                  style={classicStyles.sectionTitleRow}
                  minPresenceAhead={MIN_PRESENCE.education}
                >
                  <View style={classicStyles.sectionBar} />
                  <Text style={classicStyles.sectionTitle}>Education</Text>
                </View>
                <View style={classicStyles.dividerWrap}>
                  <View style={classicStyles.dividerColored} />
                  <View style={classicStyles.dividerSlate} />
                </View>
                {firstEdu && (
                  <View style={{ marginBottom: 14 }}>
                    <View style={classicStyles.itemRow}>
                      <View style={classicStyles.itemLeft}>
                        <View style={classicStyles.experienceCompanyRow}>
                          <View style={classicStyles.experienceCompanyMarker} />
                          <Text style={classicStyles.experienceCompany}>
                            {firstEdu.degree} in {firstEdu.field}
                          </Text>
                        </View>
                      </View>
                      {firstEdu.gpa ? (
                        <Text style={classicStyles.educationGpaInline}>
                          GPA: {firstEdu.gpa}
                        </Text>
                      ) : null}
                    </View>
                    <View style={classicStyles.educationInstitutionRow}>
                      <Text style={classicStyles.educationInstitution}>
                        {firstEdu.institution}
                      </Text>
                      <View style={classicStyles.educationMetaRight}>
                        <View style={classicStyles.experienceDateRow}>
                          <CalendarIcon size={8} color={colors.experience} />
                          <Text style={classicStyles.experienceDate}>
                            {firstEdu.graduationDate}
                          </Text>
                        </View>
                        <Text style={classicStyles.experienceLocation}>
                          {firstEdu.location}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
              </View>
              {restEdu.map((edu, index) => (
                <View key={index} style={{ marginBottom: 14 }} wrap={false}>
                  <View style={classicStyles.itemRow}>
                    <View style={classicStyles.itemLeft}>
                      <View style={classicStyles.experienceCompanyRow}>
                        <View style={classicStyles.experienceCompanyMarker} />
                        <Text style={classicStyles.experienceCompany}>
                          {edu.degree} in {edu.field}
                        </Text>
                      </View>
                    </View>
                    {edu.gpa ? (
                      <Text style={classicStyles.educationGpaInline}>
                        GPA: {edu.gpa}
                      </Text>
                    ) : null}
                  </View>
                  <View style={classicStyles.educationInstitutionRow}>
                    <Text style={classicStyles.educationInstitution}>
                      {edu.institution}
                    </Text>
                    <View style={classicStyles.educationMetaRight}>
                      <View style={classicStyles.experienceDateRow}>
                        <CalendarIcon size={8} color={colors.experience} />
                        <Text style={classicStyles.experienceDate}>
                          {edu.graduationDate}
                        </Text>
                      </View>
                      <Text style={classicStyles.experienceLocation}>
                        {edu.location}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          );
        })()}

      {skillEntries.length > 0 && (
        <View style={classicStyles.section} wrap={false}>
          <View
            style={classicStyles.sectionTitleRow}
            minPresenceAhead={MIN_PRESENCE.skills}
          >
            <View style={classicStyles.sectionBar} />
            <Text style={classicStyles.sectionTitle}>Skills</Text>
          </View>
          <View style={classicStyles.dividerWrap}>
            <View style={classicStyles.dividerColored} />
            <View style={classicStyles.dividerSlate} />
          </View>
          <View>
            {skillEntries.map(([category, values]) => (
              <Text key={category} style={classicStyles.skillsText}>
                <Text style={classicStyles.skillCategory}>{category}</Text>:{' '}
                {values.join(', ')}
              </Text>
            ))}
          </View>
        </View>
      )}

      <View style={classicStyles.footer} fixed>
        <Text
          style={classicStyles.footerText}
          render={({ pageNumber, totalPages }) =>
            totalPages > 1 ? `Page ${pageNumber} of ${totalPages}` : ''
          }
        />
      </View>
    </Page>
  );
};
