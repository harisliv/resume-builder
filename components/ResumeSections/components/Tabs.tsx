import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import PersonalInfo from './PersonalInfo';
import Experience from './Experience';
import Education from './Education';

export default function ResumeSectionsTabs() {
  const [activeTab, setActiveTab] = useState('form');

  return (
    <form noValidate>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="form">Form</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
        </TabsList>

        <TabsContent value="form" className="mt-6">
          <PersonalInfo />
        </TabsContent>

        <TabsContent value="experience" className="mt-6">
          <Experience />
        </TabsContent>

        <TabsContent value="education" className="mt-6">
          <Education />
        </TabsContent>

        <TabsContent value="skills" className="mt-6">
          <div>Skills</div>
        </TabsContent>
      </Tabs>
    </form>
  );
}
