import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Link,
  Svg,
  Circle,
  Rect,
  Path,
  Defs,
  LinearGradient,
  Stop
} from '@react-pdf/renderer';
import type { TResumeData } from '@/types';
import './fonts';
import { createStyles, COLORS } from './ResumeStyles';

interface IResumeDocumentProps {
  data: TResumeData;
}

const MailIcon = () => (
  <Svg width="12" height="12" viewBox="0 0 24 24">
    <Path
      d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
      stroke={COLORS.slate600}
      strokeWidth="2"
      fill="none"
    />
    <Path
      d="M22 6l-10 7L2 6"
      stroke={COLORS.slate600}
      strokeWidth="2"
      fill="none"
    />
  </Svg>
);

const PhoneIcon = () => (
  <Svg width="12" height="12" viewBox="0 0 24 24">
    <Path
      d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"
      stroke={COLORS.slate600}
      strokeWidth="2"
      fill="none"
    />
  </Svg>
);

const MapPinIcon = () => (
  <Svg width="12" height="12" viewBox="0 0 24 24">
    <Path
      d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
      stroke={COLORS.slate600}
      strokeWidth="2"
      fill="none"
    />
    <Circle
      cx="12"
      cy="10"
      r="3"
      stroke={COLORS.slate600}
      strokeWidth="2"
      fill="none"
    />
  </Svg>
);

const LinkedInIcon = () => (
  <Svg width="12" height="12" viewBox="0 0 24 24">
    <Path
      d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
      stroke={COLORS.slate600}
      strokeWidth="2"
      fill="none"
    />
    <Rect
      x="2"
      y="9"
      width="4"
      height="12"
      stroke={COLORS.slate600}
      strokeWidth="2"
      fill="none"
    />
    <Circle
      cx="4"
      cy="4"
      r="2"
      stroke={COLORS.slate600}
      strokeWidth="2"
      fill="none"
    />
  </Svg>
);

const GlobeIcon = () => (
  <Svg width="12" height="12" viewBox="0 0 24 24">
    <Circle
      cx="12"
      cy="12"
      r="10"
      stroke={COLORS.slate600}
      strokeWidth="2"
      fill="none"
    />
    <Path d="M2 12h20" stroke={COLORS.slate600} strokeWidth="2" fill="none" />
    <Path
      d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
      stroke={COLORS.slate600}
      strokeWidth="2"
      fill="none"
    />
  </Svg>
);

const BriefcaseIcon = () => (
  <Svg width="14" height="14" viewBox="0 0 24 24">
    <Rect
      x="2"
      y="7"
      width="20"
      height="14"
      rx="2"
      ry="2"
      stroke={COLORS.white}
      strokeWidth="2"
      fill="none"
    />
    <Path
      d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"
      stroke={COLORS.white}
      strokeWidth="2"
      fill="none"
    />
  </Svg>
);

const GraduationCapIcon = () => (
  <Svg width="14" height="14" viewBox="0 0 24 24">
    <Path
      d="M22 10v6M2 10l10-5 10 5-10 5z"
      stroke={COLORS.white}
      strokeWidth="2"
      fill="none"
    />
    <Path
      d="M6 12v5c3 3 9 3 12 0v-5"
      stroke={COLORS.white}
      strokeWidth="2"
      fill="none"
    />
  </Svg>
);

const SparklesIcon = () => (
  <Svg width="14" height="14" viewBox="0 0 24 24">
    <Path
      d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"
      stroke={COLORS.white}
      strokeWidth="2"
      fill="none"
    />
    <Path
      d="M19 13l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z"
      stroke={COLORS.white}
      strokeWidth="1.5"
      fill="none"
    />
  </Svg>
);

const ArrowRightIcon = () => (
  <Svg width="5" height="5" viewBox="0 0 10 10" style={{ marginHorizontal: 1 }}>
    <Path
      d="M1 5h7M6 2.5l2.5 2.5L6 7.5"
      stroke={COLORS.textDark}
      strokeWidth="0.8"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const GradientIconBox = ({
  gradientId,
  colorStart,
  colorEnd,
  children
}: {
  gradientId: string;
  colorStart: string;
  colorEnd: string;
  children: React.ReactNode;
}) => (
  <View style={{ width: 26, height: 26, position: 'relative' }}>
    <Svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      style={{ position: 'absolute', top: 0, left: 0 }}
    >
      <Defs>
        <LinearGradient id={gradientId}>
          <Stop offset="5%" stopColor={colorStart} />
          <Stop offset="95%" stopColor={colorEnd} />
        </LinearGradient>
      </Defs>
      <Path
        d="M 9 0 H 17 Q 26 0 26 9 V 17 Q 26 26 17 26 H 9 Q 0 26 0 17 V 9 Q 0 0 9 0 Z"
        fill={`url('#${gradientId}')`}
      />
    </Svg>
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: 26,
        height: 26,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {children}
    </View>
  </View>
);

const ExperienceCard = ({
  exp,
  styles
}: {
  exp: {
    position: string;
    company: string;
    location: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
    description: string;
  };
  styles: ReturnType<typeof createStyles>;
}) => (
  <View style={styles.experienceItem} wrap={false}>
    <View style={styles.timelineDot} />
    <View style={[styles.card, { flex: 1 }]}>
      <View style={styles.cardHeader}>
        <View style={styles.cardLeft}>
          <Text style={styles.position}>{exp.position}</Text>
          <Text style={styles.company}>{exp.company}</Text>
        </View>
        <View style={styles.cardRight}>
          <Text style={styles.location}>{exp.location}</Text>
          <View style={styles.dateRangeContainer}>
            <Text style={styles.dateRange}>{exp.startDate}</Text>
            <ArrowRightIcon />
            <Text style={styles.dateRange}>
              {exp.current ? 'Present' : exp.endDate}
            </Text>
          </View>
        </View>
      </View>
      <Text style={styles.description}>{exp.description}</Text>
    </View>
  </View>
);

const EducationCard = ({
  edu,
  styles
}: {
  edu: {
    degree: string;
    field: string;
    institution: string;
    location: string;
    graduationDate: string;
    gpa?: string;
  };
  styles: ReturnType<typeof createStyles>;
}) => (
  <View style={styles.educationItem} wrap={false}>
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardLeft}>
          <Text style={styles.degree}>
            {edu.degree} in {edu.field}
          </Text>
          <Text style={styles.institution}>{edu.institution}</Text>
        </View>
        <View style={styles.cardRight}>
          <Text style={styles.location}>{edu.location}</Text>
          <Text style={styles.dateRange}>{edu.graduationDate}</Text>
          {edu.gpa && <Text style={styles.gpa}>GPA: {edu.gpa}</Text>}
        </View>
      </View>
    </View>
  </View>
);

const ResumeDocument: React.FC<IResumeDocumentProps> = ({ data }) => {
  const styles = createStyles();
  const { personalInfo, experience, education, skills } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.header}>
          <Text style={styles.name}>
            {personalInfo?.fullName || 'Your Name'}
          </Text>
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
                gradientId="cyanGradient"
                colorStart={COLORS.cyan}
                colorEnd={COLORS.cyan600}
              >
                <BriefcaseIcon />
              </GradientIconBox>
              <Text style={styles.sectionTitle}>Experience</Text>
            </View>
            {experience.map((exp, index) => (
              <ExperienceCard key={index} exp={exp} styles={styles} />
            ))}
          </>
        )}

        {education && education.length > 0 && (
          <>
            <View style={styles.sectionHeader} wrap={false}>
              <GradientIconBox
                gradientId="violetGradient"
                colorStart={COLORS.violet}
                colorEnd={COLORS.violet600}
              >
                <GraduationCapIcon />
              </GradientIconBox>
              <Text style={styles.sectionTitle}>Education</Text>
            </View>
            {education.map((edu, index) => (
              <EducationCard key={index} edu={edu} styles={styles} />
            ))}
          </>
        )}

        {skills && skills.length > 0 && (
          <>
            <View style={styles.sectionHeader} wrap={false}>
              <GradientIconBox
                gradientId="fuchsiaGradient"
                colorStart={COLORS.fuchsia}
                colorEnd={COLORS.fuchsia600}
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
    </Document>
  );
};

export default ResumeDocument;
