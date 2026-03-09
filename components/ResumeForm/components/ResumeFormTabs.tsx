import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import PersonalInfo from './PersonalInfo';
import Experience from './Experience';
import Education from './Education';
import Skills from './Skills';

export default function ResumeFormTabs() {
  const [activeTab, setActiveTab] = useState('personal-info');

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="@container flex h-full min-h-0 min-w-0 flex-col"
    >
      <TabsList className="grid h-auto! min-h-24 w-full min-w-0 shrink-0 grid-cols-2 gap-2 p-2 @xl:h-12! @xl:min-h-0 @xl:grid-cols-4 @xl:px-1.5 @xl:py-1 [&>button]:flex [&>button]:h-full [&>button]:min-w-0 [&>button]:items-center [&>button]:justify-center">
        <TabsTrigger value="personal-info" className="truncate">
          Personal Information
        </TabsTrigger>
        <TabsTrigger value="skills" className="truncate">
          Skills
        </TabsTrigger>
        <TabsTrigger value="experience" className="truncate">
          Experience
        </TabsTrigger>
        <TabsTrigger value="education" className="truncate">
          Education
        </TabsTrigger>
      </TabsList>
      <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
        <TabsContent value="personal-info" className="mt-6 px-1">
          <PersonalInfo />
        </TabsContent>

        <TabsContent value="skills" className="mt-6 px-1">
          <Skills />
        </TabsContent>

        <TabsContent value="experience" className="mt-6 px-1">
          <Experience />
        </TabsContent>

        <TabsContent value="education" className="mt-6 px-1">
          <Education />
        </TabsContent>
      </div>
    </Tabs>
  );
}
