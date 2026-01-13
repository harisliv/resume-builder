import React from 'react';
import { Page, Text, View, Link } from '@react-pdf/renderer';
import type { TResumeData } from '@/types';
import type { createStyles, getColors } from '../ResumeStyles';
import {
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  LinkedInIcon,
  GlobeIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  SparklesIcon
} from '../icons';
import {
  GradientIconBox,
  ModernExperienceCard,
  ModernEducationCard
} from '../components';

interface IModernDocumentProps {
  data: TResumeData;
  styles: ReturnType<typeof createStyles>;
  colors: ReturnType<typeof getColors>;
}

export const ModernDocument = ({ data, styles, colors }: IModernDocumentProps) => {
  const { personalInfo, experience, education, skills } = data;

  return (
    <Page size="A4" style={styles.page} wrap>
      <View style={styles.header}>
        <Text style={styles.name}>{personalInfo?.fullName || 'Your Name'}</Text>
        <View style={styles.contactRow}>
          {personalInfo?.email && (
            <View style={styles.contactItem}>
              <View style={styles.contactIconBox}>
                <MailIcon />
              </View>
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
              <View style={styles.contactIconBox}>
                <PhoneIcon />
              </View>
              <Text style={styles.contactText}>{personalInfo.phone}</Text>
            </View>
          )}
          {personalInfo?.location && (
            <View style={styles.contactItem}>
              <View style={styles.contactIconBox}>
                <MapPinIcon />
              </View>
              <Text style={styles.contactText}>{personalInfo.location}</Text>
            </View>
          )}
          {personalInfo?.linkedIn && (
            <View style={styles.contactItem}>
              <View style={styles.contactIconBox}>
                <LinkedInIcon />
              </View>
              <Link src={personalInfo.linkedIn} style={styles.contactLink}>
                LinkedIn
              </Link>
            </View>
          )}
          {personalInfo?.website && (
            <View style={styles.contactItem}>
              <View style={styles.contactIconBox}>
                <GlobeIcon />
              </View>
              <Link src={personalInfo.website} style={styles.contactLink}>
                Portfolio
              </Link>
            </View>
          )}
        </View>
      </View>

      {personalInfo?.summary && (
        <View style={styles.summarySection} wrap={false}>
          <Text style={styles.summaryText}>{personalInfo.summary}</Text>
        </View>
      )}

      {experience && experience.length > 0 && (
        <>
          <View style={styles.sectionHeader} wrap={false}>
            <GradientIconBox
              gradientId="experienceGradient"
              colorStart={colors.experience}
              colorEnd={colors.experience}
            >
              <BriefcaseIcon />
            </GradientIconBox>
            <Text style={styles.sectionTitle}>Experience</Text>
          </View>
          {experience.map((exp, index) => (
            <ModernExperienceCard key={index} exp={exp} styles={styles} />
          ))}
        </>
      )}

      {education && education.length > 0 && (
        <>
          <View style={styles.sectionHeader} wrap={false}>
            <GradientIconBox
              gradientId="educationGradient"
              colorStart={colors.education}
              colorEnd={colors.education}
            >
              <GraduationCapIcon />
            </GradientIconBox>
            <Text style={styles.sectionTitle}>Education</Text>
          </View>
          {education.map((edu, index) => (
            <ModernEducationCard key={index} edu={edu} styles={styles} />
          ))}
        </>
      )}

      {skills && skills.length > 0 && (
        <>
          <View style={styles.sectionHeader} wrap={false}>
            <GradientIconBox
              gradientId="skillsGradient"
              colorStart={colors.skills}
              colorEnd={colors.skills}
            >
              <SparklesIcon />
            </GradientIconBox>
            <Text style={styles.sectionTitle}>Skills</Text>
          </View>
          <View style={styles.skillsContainer}>
            {skills.map((skill, index) => (
              <Text key={index} style={styles.skillTag}>
                {skill}
              </Text>
            ))}
          </View>
        </>
      )}

      <Text
        style={styles.pageNumber}
        render={({ pageNumber, totalPages }) =>
          totalPages > 1 ? `${pageNumber} / ${totalPages}` : ''
        }
        fixed
      />
    </Page>
  );
};
