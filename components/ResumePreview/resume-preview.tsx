'use client';

import { Separator } from '@/components/ui/separator';
import type { TResumeData } from '@/types';
import { Linkedin02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

export default function ResumePreview({ data }: { data: TResumeData }) {
  const { personalInfo, experience, education, skills } = data;
  console.log('🚀 ~ ResumePreview ~ data:', data);

  return (
    <div className="bg-white text-black p-8 shadow-lg rounded-lg overflow-auto max-h-[800px]">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          {personalInfo?.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
          {personalInfo?.email && (
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {personalInfo.email}
            </span>
          )}
          {personalInfo?.phone && (
            <span className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              {personalInfo.phone}
            </span>
          )}
          {personalInfo?.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {personalInfo.location}
            </span>
          )}
          {personalInfo?.linkedIn && (
            <span className="flex items-center gap-1">
              <HugeiconsIcon icon={Linkedin02Icon} />
              LinkedIn
            </span>
          )}
          {personalInfo?.website && (
            <span className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              Website
            </span>
          )}
        </div>
      </div>

      {/* Summary */}
      {personalInfo?.summary && (
        <>
          <Separator className="my-4 bg-gray-300" />
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-2 text-gray-900">SUMMARY</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {personalInfo.summary}
            </p>
          </div>
        </>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <>
          <Separator className="my-4 bg-gray-300" />
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3 text-gray-900">EXPERIENCE</h2>
            <div className="space-y-4">
              {experience.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {exp.position}
                      </h3>
                      <p className="text-sm text-gray-700">{exp.company}</p>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <p>{exp.location}</p>
                      <p>
                        {exp.startDate} -{' '}
                        {exp.current ? 'Present' : exp.endDate}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed mt-2">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <>
          <Separator className="my-4 bg-gray-300" />
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3 text-gray-900">EDUCATION</h2>
            <div className="space-y-3">
              {education.map((edu, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {edu.degree} in {edu.field}
                      </h3>
                      <p className="text-sm text-gray-700">{edu.institution}</p>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <p>{edu.location}</p>
                      <p>{edu.graduationDate}</p>
                      {edu.gpa && <p>GPA: {edu.gpa}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <>
          <Separator className="my-4 bg-gray-300" />
          <div>
            <h2 className="text-lg font-bold mb-3 text-gray-900">SKILLS</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="text-sm bg-gray-200 text-gray-800 px-3 py-1 rounded"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </>
      )}

      {!personalInfo?.fullName &&
        experience?.length === 0 &&
        education?.length === 0 &&
        skills?.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p>Your resume preview will appear here</p>
            <p className="text-sm mt-2">
              Start filling out the form to see your resume
            </p>
          </div>
        )}
    </div>
  );
}
