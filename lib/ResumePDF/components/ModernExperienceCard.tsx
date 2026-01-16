import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import type { createStyles } from '../ResumeStyles';
import { ArrowRightIcon } from '../icons';

interface IExperience {
  position?: string;
  company?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  description?: string;
}

interface IModernExperienceCardProps {
  exp: IExperience;
  styles: ReturnType<typeof createStyles>;
}

export const ModernExperienceCard = ({
  exp,
  styles
}: IModernExperienceCardProps) => (
  <View style={styles.experienceItem} wrap={false}>
    <View style={styles.timelineDot} />
    <View style={[styles.card, { flex: 1 }]}>
      <View style={styles.cardHeader}>
        <View style={styles.cardLeft}>
          <Text style={styles.position}>{exp.position || 'Position'}</Text>
          <Text style={styles.company}>{exp.company || 'Company'}</Text>
        </View>
        <View style={styles.cardRight}>
          <Text style={styles.location}>{exp.location || ''}</Text>
          <View style={styles.dateRangeContainer}>
            <Text style={styles.dateRange}>{exp.startDate || ''}</Text>
            <ArrowRightIcon />
            <Text style={styles.dateRange}>
              {exp.current ? 'Present' : exp.endDate || ''}
            </Text>
          </View>
        </View>
      </View>
      <Text style={styles.description}>{exp.description || ''}</Text>
    </View>
  </View>
);
