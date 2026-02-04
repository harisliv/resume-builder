import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import PersonalInfo from './PersonalInfo';
import Experience from './Experience';
import Education from './Education';

export default function ResumeFormTabs() {
  const [activeTab, setActiveTab] = useState('form');

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="h-full flex flex-col min-h-0"
    >
      <TabsList className="grid w-full grid-cols-4 shrink-0">
        <TabsTrigger value="form">Form</TabsTrigger>
        <TabsTrigger value="experience">Experience</TabsTrigger>
        <TabsTrigger value="education">Education</TabsTrigger>
        <TabsTrigger value="skills">Skills</TabsTrigger>
      </TabsList>
      <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
        <TabsContent value="form" className="mt-6 px-1">
          <PersonalInfo />
        </TabsContent>

        <TabsContent value="experience" className="mt-6 px-1">
          <Experience />
        </TabsContent>

        <TabsContent value="education" className="mt-6 px-1">
          <Education />
        </TabsContent>

        <TabsContent value="skills" className="mt-6 px-1">
          <div>Skills</div>
        </TabsContent>
      </div>
    </Tabs>
  );
}
