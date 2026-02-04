import React from 'react';
import { Page, Text, View, Link, StyleSheet } from '@react-pdf/renderer';
import type { TResumeData } from '@/types';
import '../fonts';
import {
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  LinkedInIcon,
  GlobeIcon,
  GitHubIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  SparklesIcon,
  CalendarIcon,
  BuildingIcon,
  ArrowRightIcon
} from '../icons';

// Aesthetic color palette - soft, modern tones
const AESTHETIC_COLORS = {
  background: '#fafafa',
  surface: '#ffffff',
  primary: '#6366f1', // Indigo
  primaryLight: '#818cf8',
  secondary: '#ec4899', // Pink
  accent: '#14b8a6', // Teal
  textPrimary: '#1e293b',
  textSecondary: '#64748b',
  textMuted: '#94a3b8',
  border: '#e2e8f0',
  cardBg: '#f8fafc'
};

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: AESTHETIC_COLORS.background,
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 40,
    fontFamily: 'Inter'
  },
  // Decorative header with gradient accent
  headerContainer: {
    marginBottom: 24
  },
  headerAccent: {
    height: 4,
    backgroundColor: AESTHETIC_COLORS.primary,
    borderRadius: 2,
    marginBottom: 24
  },
  name: {
    fontSize: 32,
    fontWeight: 700,
    color: AESTHETIC_COLORS.textPrimary,
    marginBottom: 8,
    letterSpacing: -0.5
  },
  title: {
    fontSize: 14,
    color: AESTHETIC_COLORS.primary,
    marginBottom: 16,
    fontWeight: 500
  },
  // Contact row with improved icon boxes
  contactContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: AESTHETIC_COLORS.surface,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: AESTHETIC_COLORS.border
  },
  contactText: {
    fontSize: 9,
    color: AESTHETIC_COLORS.textSecondary
  },
  contactLink: {
    fontSize: 9,
    color: AESTHETIC_COLORS.primary,
    textDecoration: 'none'
  },
  // Summary section with left border accent
  summarySection: {
    marginVertical: 20,
    paddingLeft: 16,
    borderLeftWidth: 3,
    borderLeftColor: AESTHETIC_COLORS.primary,
    borderLeftStyle: 'solid'
  },
  summaryText: {
    fontSize: 10,
    color: AESTHETIC_COLORS.textSecondary,
    lineHeight: 1.7
  },
  // Section styling with icon badges
  section: {
    marginBottom: 20
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14
  },
  iconBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: AESTHETIC_COLORS.textPrimary,
    letterSpacing: 0.3
  },
  // Experience cards with subtle styling
  card: {
    backgroundColor: AESTHETIC_COLORS.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: AESTHETIC_COLORS.border
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  cardLeft: {
    flex: 1
  },
  cardRight: {
    alignItems: 'flex-end'
  },
  position: {
    fontSize: 12,
    fontWeight: 600,
    color: AESTHETIC_COLORS.textPrimary,
    marginBottom: 4
  },
  company: {
    fontSize: 10,
    fontWeight: 600,
    color: AESTHETIC_COLORS.primary
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  dateText: {
    fontSize: 8,
    color: AESTHETIC_COLORS.textMuted
  },
  description: {
    fontSize: 9,
    color: AESTHETIC_COLORS.textSecondary,
    lineHeight: 1.6,
    marginTop: 8
  },
  // Education cards
  educationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: AESTHETIC_COLORS.surface,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: AESTHETIC_COLORS.border
  },
  educationContent: {
    flex: 1
  },
  degree: {
    fontSize: 11,
    fontWeight: 600,
    color: AESTHETIC_COLORS.textPrimary,
    marginBottom: 2
  },
  institution: {
    fontSize: 10,
    color: AESTHETIC_COLORS.secondary,
    fontWeight: 500
  },
  educationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4
  },
  gpa: {
    fontSize: 8,
    color: AESTHETIC_COLORS.accent,
    backgroundColor: '#f0fdfa',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4
  },
  // Skills as pills
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6
  },
  skillPill: {
    fontSize: 9,
    color: AESTHETIC_COLORS.primary,
    backgroundColor: '#eef2ff',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e7ff'
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  footerText: {
    fontSize: 8,
    color: AESTHETIC_COLORS.textMuted
  }
});

interface IAestheticDocumentProps {
  data: TResumeData;
}

export const AestheticDocument = ({ data }: IAestheticDocumentProps) => {
  const { personalInfo, experience, education, skills } = data;

  return (
    <Page size="A4" style={styles.page} wrap>
      {/* Header with accent line */}
      <View style={styles.headerContainer}>
        <View style={styles.headerAccent} />
        <Text style={styles.name}>{personalInfo?.fullName || 'Your Name'}</Text>
        <Text style={styles.title}>Senior Software Engineer</Text>

        {/* Contact info with icons */}
        <View style={styles.contactContainer}>
          {personalInfo?.email && (
            <View style={styles.contactItem}>
              <MailIcon size={10} color={AESTHETIC_COLORS.primary} />
              <Link
                src={`mailto:${personalInfo.email}`}
                style={styles.contactLink}
              >
                {personalInfo.email}
              </Link>
            </View>
          )}
          {personalInfo?.phone && (
            <View style={styles.contactItem}>
              <PhoneIcon size={10} color={AESTHETIC_COLORS.primary} />
              <Text style={styles.contactText}>{personalInfo.phone}</Text>
            </View>
          )}
          {personalInfo?.location && (
            <View style={styles.contactItem}>
              <MapPinIcon size={10} color={AESTHETIC_COLORS.primary} />
              <Text style={styles.contactText}>{personalInfo.location}</Text>
            </View>
          )}
          {personalInfo?.linkedIn && (
            <View style={styles.contactItem}>
              <LinkedInIcon size={10} color={AESTHETIC_COLORS.primary} />
              <Link src={personalInfo.linkedIn} style={styles.contactLink}>
                LinkedIn
              </Link>
            </View>
          )}
          {personalInfo?.website && (
            <View style={styles.contactItem}>
              <GlobeIcon size={10} color={AESTHETIC_COLORS.primary} />
              <Link src={personalInfo.website} style={styles.contactLink}>
                Portfolio
              </Link>
            </View>
          )}
        </View>
      </View>

      {/* Summary with accent border */}
      {personalInfo?.summary && (
        <View style={styles.summarySection} wrap={false}>
          <Text style={styles.summaryText}>{personalInfo.summary}</Text>
        </View>
      )}

      {/* Experience Section with new icons */}
      {experience && experience.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconBadge, { backgroundColor: '#eef2ff' }]}>
              <BriefcaseIcon size={14} color={AESTHETIC_COLORS.primary} />
            </View>
            <Text style={styles.sectionTitle}>Experience</Text>
          </View>

          {experience.map((exp, index) => (
            <View key={index} style={styles.card} wrap={false}>
              <View style={styles.cardHeader}>
                <View style={styles.cardLeft}>
                  <Text style={styles.position}>{exp.position}</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    <BuildingIcon size={9} color={AESTHETIC_COLORS.primary} />
                    <Text style={styles.company}>{exp.company}</Text>
                  </View>
                </View>
                <View style={styles.cardRight}>
                  <View style={styles.dateRow}>
                    <CalendarIcon size={8} color={AESTHETIC_COLORS.textMuted} />
                    <Text style={styles.dateText}>
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </Text>
                  </View>
                  <Text style={styles.dateText}>{exp.location}</Text>
                </View>
              </View>
              {exp.description && (
                <Text style={styles.description}>{exp.description}</Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Education Section */}
      {education && education.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconBadge, { backgroundColor: '#fce7f3' }]}>
              <GraduationCapIcon size={14} color={AESTHETIC_COLORS.secondary} />
            </View>
            <Text style={styles.sectionTitle}>Education</Text>
          </View>

          {education.map((edu, index) => (
            <View key={index} style={styles.educationCard} wrap={false}>
              <View
                style={[
                  styles.iconBadge,
                  { backgroundColor: '#fce7f3', width: 24, height: 24 }
                ]}
              >
                <GraduationCapIcon
                  size={12}
                  color={AESTHETIC_COLORS.secondary}
                />
              </View>
              <View style={styles.educationContent}>
                <Text style={styles.degree}>
                  {edu.degree} in {edu.field}
                </Text>
                <Text style={styles.institution}>{edu.institution}</Text>
                <View style={styles.educationMeta}>
                  <CalendarIcon size={8} color={AESTHETIC_COLORS.textMuted} />
                  <Text style={styles.dateText}>{edu.graduationDate}</Text>
                  <Text style={styles.dateText}>•</Text>
                  <Text style={styles.dateText}>{edu.location}</Text>
                  {edu.gpa && (
                    <>
                      <Text style={styles.dateText}>•</Text>
                      <Text style={styles.gpa}>GPA: {edu.gpa}</Text>
                    </>
                  )}
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Skills Section */}
      {skills && skills.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconBadge, { backgroundColor: '#f0fdfa' }]}>
              <SparklesIcon size={14} color={AESTHETIC_COLORS.accent} />
            </View>
            <Text style={styles.sectionTitle}>Skills</Text>
          </View>

          <View style={styles.skillsContainer}>
            {skills.map((skill, index) => (
              <Text key={index} style={styles.skillPill}>
                {skill}
              </Text>
            ))}
          </View>
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer} fixed>
        <Text style={styles.footerText}>Generated with Resume Builder</Text>
        <Text
          style={styles.footerText}
          render={({ pageNumber, totalPages }) =>
            totalPages > 1 ? `Page ${pageNumber} of ${totalPages}` : ''
          }
        />
      </View>
    </Page>
  );
};
