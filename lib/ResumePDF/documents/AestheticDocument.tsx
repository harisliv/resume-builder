import React from 'react';
import { Page, Text, View, Link, StyleSheet } from '@react-pdf/renderer';
import type { TResumeData } from '@/types/schema';
import '../fonts';
import { MailIcon } from '../icons/MailIcon';
import { PhoneIcon } from '../icons/PhoneIcon';
import { MapPinIcon } from '../icons/MapPinIcon';
import { LinkedInIcon } from '../icons/LinkedInIcon';
import { GlobeIcon } from '../icons/GlobeIcon';
import { BriefcaseIcon } from '../icons/BriefcaseIcon';
import { GraduationCapIcon } from '../icons/GraduationCapIcon';
import { SparklesIcon } from '../icons/SparklesIcon';
import { CalendarIcon } from '../icons/CalendarIcon';

const AESTHETIC_NEUTRALS = {
  background: '#fafafa',
  surface: '#ffffff',
  textPrimary: '#1e293b',
  textSecondary: '#64748b',
  textMuted: '#94a3b8',
  border: '#e2e8f0',
  cardBg: '#f8fafc'
} as const;

// Aesthetic color palette - soft, modern tones
const AESTHETIC_COLORS = {
  ...AESTHETIC_NEUTRALS,
  primary: '#6366f1', // Indigo
  primaryLight: '#818cf8',
  secondary: '#ec4899', // Pink
  accent: '#14b8a6' // Teal
};

/** Converts hex to rgba with alpha for subtle fills. */
const hexToRgba = (hex: string, alpha: number) => {
  const normalized = hex.replace('#', '');
  const value =
    normalized.length === 3
      ? normalized
          .split('')
          .map((c) => c + c)
          .join('')
      : normalized;
  const int = Number.parseInt(value, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
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
  positionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4
  },
  positionMarker: {
    width: 1,
    height: 10,
    backgroundColor: AESTHETIC_COLORS.primary
  },
  position: {
    fontSize: 12,
    fontWeight: 600,
    color: AESTHETIC_COLORS.textPrimary
  },
  company: {
    fontSize: 10,
    fontWeight: 600,
    color: AESTHETIC_COLORS.secondary
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  experienceDateText: {
    fontSize: 8,
    color: AESTHETIC_COLORS.accent,
    fontWeight: 700
  },
  dateArrow: {
    color: AESTHETIC_COLORS.secondary
  },
  locationText: {
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
    fontWeight: 600
  },
  educationMetaDateText: {
    fontSize: 8,
    color: AESTHETIC_COLORS.accent,
    fontWeight: 700
  },
  gpa: {
    fontSize: 8,
    color: AESTHETIC_COLORS.accent,
    backgroundColor: '#f0fdfa',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginTop: 4,
    alignSelf: 'flex-start'
  },
  // Skills as pills
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6
  },
  skillPill: {
    fontSize: 9,
    color: '#eef2ff',
    backgroundColor: AESTHETIC_COLORS.primaryLight,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 16
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
  colors?: {
    summary: string;
    experience: string;
    education: string;
    skills: string;
  };
}

/**
 * Minimum vertical space (pt) that should remain after each section header
 * to keep the title visually coupled with at least the first section item.
 */
const SECTION_MIN_PRESENCE_AHEAD = {
  experience: 110,
  education: 90,
  skills: 45
} as const;

/**
 * Aesthetic PDF template with pagination guards to avoid orphan section titles.
 */
export const AestheticDocument = ({ data, colors }: IAestheticDocumentProps) => {
  const { personalInfo, experience, education, skills } = data;
  const [firstExperience, ...remainingExperience] = experience ?? [];
  const [firstEducation, ...remainingEducation] = education ?? [];
  const AESTHETIC_COLORS = {
    ...AESTHETIC_NEUTRALS,
    primary: colors?.summary ?? '#6366f1',
    primaryLight: colors?.skills ?? '#818cf8',
    secondary: colors?.experience ?? '#ec4899',
    accent: colors?.education ?? '#14b8a6',
    primaryTint: hexToRgba(colors?.summary ?? '#6366f1', 0.12),
    accentTint: hexToRgba(colors?.education ?? '#14b8a6', 0.12)
  };

  return (
    <Page
      size="A4"
      style={[styles.page, { backgroundColor: AESTHETIC_COLORS.background }]}
      wrap
    >
      {/* Header with accent line */}
      <View style={styles.headerContainer}>
        <View
          style={[styles.headerAccent, { backgroundColor: AESTHETIC_COLORS.primary }]}
        />
        <Text style={styles.name}>{personalInfo?.fullName || 'Your Name'}</Text>
        <Text style={[styles.title, { color: AESTHETIC_COLORS.primary }]}>
          Senior Software Engineer
        </Text>

        {/* Contact info with icons */}
        <View style={styles.contactContainer}>
          {personalInfo?.email && (
            <View style={styles.contactItem}>
              <MailIcon size={10} color={AESTHETIC_COLORS.primary} />
              <Link
                src={`mailto:${personalInfo.email}`}
                style={[styles.contactLink, { color: AESTHETIC_COLORS.primary }]}
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
              <Link
                src={personalInfo.linkedIn}
                style={[styles.contactLink, { color: AESTHETIC_COLORS.primary }]}
              >
                LinkedIn
              </Link>
            </View>
          )}
          {personalInfo?.website && (
            <View style={styles.contactItem}>
              <GlobeIcon size={10} color={AESTHETIC_COLORS.primary} />
              <Link
                src={personalInfo.website}
                style={[styles.contactLink, { color: AESTHETIC_COLORS.primary }]}
              >
                Portfolio
              </Link>
            </View>
          )}
        </View>
      </View>

      {/* Summary with accent border */}
      {personalInfo?.summary && (
        <View
          style={[styles.summarySection, { borderLeftColor: AESTHETIC_COLORS.primary }]}
          wrap={false}
        >
          <Text style={styles.summaryText}>{personalInfo.summary}</Text>
        </View>
      )}

      {/* Experience Section with new icons */}
      {experience && experience.length > 0 && (
        <View style={styles.section}>
          {/* Keep header with first card to avoid orphan section titles */}
          <View wrap={false}>
            <View
              style={styles.sectionHeader}
              minPresenceAhead={SECTION_MIN_PRESENCE_AHEAD.experience}
            >
              <View
                style={[styles.iconBadge, { backgroundColor: AESTHETIC_COLORS.primaryTint }]}
              >
                <BriefcaseIcon size={14} color={AESTHETIC_COLORS.primary} />
              </View>
              <Text style={styles.sectionTitle}>Experience</Text>
            </View>

            {firstExperience && (
              <View style={styles.card} wrap={false}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardLeft}>
                    <View style={styles.positionRow}>
                      <View
                        style={[
                          styles.positionMarker,
                          { backgroundColor: AESTHETIC_COLORS.primary }
                        ]}
                      />
                      <Text style={styles.position}>{firstExperience.position}</Text>
                    </View>
                    <Text
                      style={[styles.company, { color: AESTHETIC_COLORS.secondary }]}
                    >
                      {firstExperience.company}
                    </Text>
                  </View>
                  <View style={styles.cardRight}>
                    <View style={styles.dateRow}>
                      <CalendarIcon
                        size={8}
                        color={AESTHETIC_COLORS.secondary}
                      />
                      <Text
                        style={[
                          styles.experienceDateText,
                          { color: AESTHETIC_COLORS.accent }
                        ]}
                      >
                        {firstExperience.startDate}{' '}
                        <Text
                          style={[styles.dateArrow, { color: AESTHETIC_COLORS.secondary }]}
                        >
                          →
                        </Text>{' '}
                        {firstExperience.current
                          ? 'Present'
                          : firstExperience.endDate}
                      </Text>
                    </View>
                    <Text style={styles.locationText}>
                      {firstExperience.location}
                    </Text>
                  </View>
                </View>
                {firstExperience.description && (
                  <Text style={styles.description}>
                    {firstExperience.description}
                  </Text>
                )}
                {firstExperience.highlights &&
                  firstExperience.highlights.length > 0 && (
                    <View style={{ marginTop: 4 }}>
                      {firstExperience.highlights.map((h, i) => (
                        <View
                          key={i}
                          style={{ flexDirection: 'row', marginBottom: 2 }}
                        >
                          <Text
                            style={{
                              fontSize: 9,
                              color: AESTHETIC_COLORS.textSecondary,
                              marginRight: 6
                            }}
                          >
                            •
                          </Text>
                          <Text
                            style={{
                              fontSize: 9,
                              color: AESTHETIC_COLORS.textSecondary,
                              flex: 1,
                              lineHeight: 1.6
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

          {remainingExperience.map((exp, index) => (
            <View
              key={`${exp.company}-${index}`}
              style={styles.card}
              wrap={false}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardLeft}>
                  <View style={styles.positionRow}>
                    <View
                      style={[
                        styles.positionMarker,
                        { backgroundColor: AESTHETIC_COLORS.primary }
                      ]}
                    />
                    <Text style={styles.position}>{exp.position}</Text>
                  </View>
                  <Text style={[styles.company, { color: AESTHETIC_COLORS.secondary }]}>
                    {exp.company}
                  </Text>
                </View>
                <View style={styles.cardRight}>
                  <View style={styles.dateRow}>
                    <CalendarIcon size={8} color={AESTHETIC_COLORS.secondary} />
                    <Text
                      style={[styles.experienceDateText, { color: AESTHETIC_COLORS.accent }]}
                    >
                      {exp.startDate}{' '}
                      <Text
                        style={[styles.dateArrow, { color: AESTHETIC_COLORS.secondary }]}
                      >
                        →
                      </Text>{' '}
                      {exp.current ? 'Present' : exp.endDate}
                    </Text>
                  </View>
                  <Text style={styles.locationText}>{exp.location}</Text>
                </View>
              </View>
              {exp.description && (
                <Text style={styles.description}>{exp.description}</Text>
              )}
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
                          color: AESTHETIC_COLORS.textSecondary,
                          marginRight: 6
                        }}
                      >
                        •
                      </Text>
                      <Text
                        style={{
                          fontSize: 9,
                          color: AESTHETIC_COLORS.textSecondary,
                          flex: 1,
                          lineHeight: 1.6
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

      {/* Education Section */}
      {education && education.length > 0 && (
        <View style={styles.section}>
          {/* Keep header with first card to avoid orphan section titles */}
          <View wrap={false}>
            <View
              style={styles.sectionHeader}
              minPresenceAhead={SECTION_MIN_PRESENCE_AHEAD.education}
            >
              <View
                style={[styles.iconBadge, { backgroundColor: AESTHETIC_COLORS.primaryTint }]}
              >
                <GraduationCapIcon size={14} color={AESTHETIC_COLORS.primary} />
              </View>
              <Text style={styles.sectionTitle}>Education</Text>
            </View>

            {firstEducation && (
              <View style={styles.educationCard} wrap={false}>
                <View style={styles.cardHeader}>
                  <View style={styles.educationContent}>
                    <Text style={styles.degree}>
                      {firstEducation.degree} in {firstEducation.field}
                    </Text>
                    <Text
                      style={[styles.institution, { color: AESTHETIC_COLORS.secondary }]}
                    >
                      {firstEducation.institution}
                    </Text>
                    {firstEducation.gpa && (
                      <Text
                        style={[
                          styles.gpa,
                          {
                            color: AESTHETIC_COLORS.accent,
                            backgroundColor: AESTHETIC_COLORS.accentTint
                          }
                        ]}
                      >
                        GPA: {firstEducation.gpa}
                      </Text>
                    )}
                  </View>
                  <View style={styles.cardRight}>
                    <View style={styles.dateRow}>
                      <CalendarIcon size={8} color={AESTHETIC_COLORS.secondary} />
                      <Text
                        style={[
                          styles.educationMetaDateText,
                          { color: AESTHETIC_COLORS.accent }
                        ]}
                      >
                        {firstEducation.graduationDate}
                      </Text>
                    </View>
                    <Text style={styles.locationText}>
                      {firstEducation.location}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>

          {remainingEducation.map((edu, index) => (
            <View
              key={`${edu.institution}-${index}`}
              style={styles.educationCard}
              wrap={false}
            >
              <View style={styles.cardHeader}>
                <View style={styles.educationContent}>
                  <Text style={styles.degree}>
                    {edu.degree} in {edu.field}
                  </Text>
                  <Text style={[styles.institution, { color: AESTHETIC_COLORS.secondary }]}>
                    {edu.institution}
                  </Text>
                  {edu.gpa && (
                    <Text
                      style={[
                        styles.gpa,
                        {
                          color: AESTHETIC_COLORS.accent,
                          backgroundColor: AESTHETIC_COLORS.accentTint
                        }
                      ]}
                    >
                      GPA: {edu.gpa}
                    </Text>
                  )}
                </View>
                <View style={styles.cardRight}>
                  <View style={styles.dateRow}>
                    <CalendarIcon size={8} color={AESTHETIC_COLORS.secondary} />
                    <Text
                      style={[
                        styles.educationMetaDateText,
                        { color: AESTHETIC_COLORS.accent }
                      ]}
                    >
                      {edu.graduationDate}
                    </Text>
                  </View>
                  <Text style={styles.locationText}>{edu.location}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Skills Section */}
      {skills && skills.length > 0 && (
        <View style={styles.section}>
          {/* Keep header with first row of skills to avoid orphan section titles */}
          <View wrap={false}>
            <View
              style={styles.sectionHeader}
              minPresenceAhead={SECTION_MIN_PRESENCE_AHEAD.skills}
            >
              <View
                style={[styles.iconBadge, { backgroundColor: AESTHETIC_COLORS.primaryTint }]}
              >
                <SparklesIcon size={14} color={AESTHETIC_COLORS.primary} />
              </View>
              <Text style={styles.sectionTitle}>Skills</Text>
            </View>

            <View style={styles.skillsContainer}>
              {skills.map((skill, index) => (
                <Text
                  key={`${skill}-${index}`}
                  style={[
                    styles.skillPill,
                    {
                      backgroundColor: AESTHETIC_COLORS.primaryLight,
                      color: AESTHETIC_COLORS.cardBg
                    }
                  ]}
                >
                  {skill}
                </Text>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer} fixed>
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
