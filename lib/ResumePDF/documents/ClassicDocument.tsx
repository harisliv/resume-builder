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

  const classicStyles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#ffffff',
      fontFamily: fontFamily,
      paddingTop: 44,
      paddingBottom: 40,
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
      color: '#cbd5e1'
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
    itemRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 2
    },
    itemTitle: {
      fontSize: 11,
      fontWeight: 700,
      color: colors.education
    },
    itemSubtitle: {
      fontSize: 10,
      color: '#475569'
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
        <View style={classicStyles.section}>
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
          <View style={classicStyles.sectionTitleRow}>
            <View style={classicStyles.sectionBar} />
            <Text style={classicStyles.sectionTitle}>
              Professional Experience
            </Text>
          </View>
          <View style={classicStyles.dividerWrap}>
            <View style={classicStyles.dividerColored} />
            <View style={classicStyles.dividerSlate} />
          </View>
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
              <Text style={classicStyles.itemDescription}>
                {exp.description}
              </Text>
              {exp.highlights && exp.highlights.length > 0 && (
                <View style={{ marginTop: 4 }}>
                  {exp.highlights.map((h, i) => (
                    <View
                      key={i}
                      style={{ flexDirection: 'row', marginBottom: 2 }}
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
      )}

      {education && education.length > 0 && (
        <View style={classicStyles.section}>
          <View style={classicStyles.sectionTitleRow}>
            <View style={classicStyles.sectionBar} />
            <Text style={classicStyles.sectionTitle}>Education</Text>
          </View>
          <View style={classicStyles.dividerWrap}>
            <View style={classicStyles.dividerColored} />
            <View style={classicStyles.dividerSlate} />
          </View>
          {education.map((edu, index) => (
            <View key={index} style={{ marginBottom: 8 }} wrap={false}>
              <View style={classicStyles.itemRow}>
                <Text style={classicStyles.itemTitle}>
                  {edu.degree} in {edu.field}
                </Text>
                <Text style={classicStyles.itemDate}>{edu.graduationDate}</Text>
              </View>
              <View style={classicStyles.itemRow}>
                <Text style={classicStyles.itemSubtitle}>
                  {edu.institution}
                </Text>
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
          <View style={classicStyles.sectionTitleRow}>
            <View style={classicStyles.sectionBar} />
            <Text style={classicStyles.sectionTitle}>Skills</Text>
          </View>
          <View style={classicStyles.dividerWrap}>
            <View style={classicStyles.dividerColored} />
            <View style={classicStyles.dividerSlate} />
          </View>
          <Text style={classicStyles.skillsText}>{skills.join('  |  ')}</Text>
        </View>
      )}
    </Page>
  );
};
