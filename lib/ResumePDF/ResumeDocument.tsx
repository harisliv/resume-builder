import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import type { TResumeData } from '@/types';
import { createStyles } from './ResumeStyles';

interface IResumeDocumentProps {
  data: TResumeData;
}

const ResumeDocument: React.FC<IResumeDocumentProps> = ({ data }) => {
  const styles = createStyles();
  const { personalInfo, experience, education, skills } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>
            {personalInfo?.fullName || 'Your Name'}
          </Text>
          <View style={styles.contactRow}>
            {personalInfo?.email && (
              <Text style={styles.contactItem}>{personalInfo.email}</Text>
            )}
            {personalInfo?.phone && (
              <Text style={styles.contactItem}>{personalInfo.phone}</Text>
            )}
            {personalInfo?.location && (
              <Text style={styles.contactItem}>{personalInfo.location}</Text>
            )}
            {personalInfo?.linkedIn && (
              <Text style={styles.contactItem}>LinkedIn</Text>
            )}
            {personalInfo?.website && (
              <Text style={styles.contactItem}>Website</Text>
            )}
          </View>
        </View>

        {personalInfo?.summary && (
          <>
            <View style={styles.separator} />
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>SUMMARY</Text>
              <Text style={styles.summary}>{personalInfo.summary}</Text>
            </View>
          </>
        )}

        {experience && experience.length > 0 && (
          <>
            <View style={styles.separator} />
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>EXPERIENCE</Text>
              {experience.map((exp, index) => (
                <View key={index} style={styles.experienceItem}>
                  <View style={styles.experienceHeader}>
                    <View style={styles.experienceLeft}>
                      <Text style={styles.position}>{exp.position}</Text>
                      <Text style={styles.company}>{exp.company}</Text>
                    </View>
                    <View style={styles.experienceRight}>
                      <Text style={styles.location}>{exp.location}</Text>
                      <Text style={styles.dateRange}>
                        {exp.startDate} -{' '}
                        {exp.current ? 'Present' : exp.endDate}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.description}>{exp.description}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {education && education.length > 0 && (
          <>
            <View style={styles.separator} />
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>EDUCATION</Text>
              {education.map((edu, index) => (
                <View key={index} style={styles.educationItem}>
                  <View style={styles.educationHeader}>
                    <View style={styles.educationLeft}>
                      <Text style={styles.degree}>
                        {edu.degree} in {edu.field}
                      </Text>
                      <Text style={styles.institution}>{edu.institution}</Text>
                    </View>
                    <View style={styles.educationRight}>
                      <Text style={styles.location}>{edu.location}</Text>
                      <Text style={styles.dateRange}>{edu.graduationDate}</Text>
                      {edu.gpa && (
                        <Text style={styles.gpa}>GPA: {edu.gpa}</Text>
                      )}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {skills && skills.length > 0 && (
          <>
            <View style={styles.separator} />
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>SKILLS</Text>
              <View style={styles.skillsContainer}>
                {skills.map((skill, index) => (
                  <Text key={index} style={styles.skillTag}>
                    {skill}
                  </Text>
                ))}
              </View>
            </View>
          </>
        )}
      </Page>
    </Document>
  );
};

export default ResumeDocument;
