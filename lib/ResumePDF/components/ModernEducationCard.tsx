import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import type { createStyles } from '../ResumeStyles';

interface IEducation {
  degree: string;
  field: string;
  institution: string;
  location: string;
  graduationDate: string;
  gpa?: string;
}

interface IModernEducationCardProps {
  edu: IEducation;
  styles: ReturnType<typeof createStyles>;
}

export const ModernEducationCard = ({ edu, styles }: IModernEducationCardProps) => (
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
