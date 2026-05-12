import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { FieldArrayWithId } from 'react-hook-form';
import { useFormContext, useWatch } from 'react-hook-form';
import PersonalInfo from './PersonalInfo';
import Experience from './Experience';
import Education from './Education';
import Skills from './Skills';
import CustomSectionPanel from './CustomSectionPanel';
import type { TResumeForm } from '@/types/schema';

type TResumeFormTabsProps = {
  activeTab: string;
  onActiveTabChange: (value: string) => void;
  customSectionFields: FieldArrayWithId<TResumeForm, 'customSections'>[];
  onRemoveCustomSection: (index: number) => void;
};

/** Resume form tabs, including one dynamic tab per custom section. */
export default function ResumeFormTabs({
  activeTab,
  onActiveTabChange,
  customSectionFields,
  onRemoveCustomSection
}: TResumeFormTabsProps) {
  const { control } = useFormContext<TResumeForm>();
  const customSections = useWatch({ control, name: 'customSections' }) ?? [];

  return (
    <Tabs
      value={activeTab}
      onValueChange={onActiveTabChange}
      className="@container flex h-full min-h-0 min-w-0 flex-col"
    >
      <TabsList className="flex h-auto! min-h-0 w-full min-w-0 shrink-0 gap-2 overflow-x-auto p-2 @xl:px-1.5 @xl:py-1 [&>button]:h-10 [&>button]:min-w-fit [&>button]:flex-1 [&>button]:shrink-0 [&>button]:justify-center">
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
        {customSectionFields.map((field, index) => (
          <TabsTrigger
            key={field.id}
            value={`custom-section-${index}`}
            className="truncate"
          >
            {customSections[index]?.sectionTitle?.trim() ||
              `Custom Section ${index + 1}`}
          </TabsTrigger>
        ))}
      </TabsList>
      <div className="min-h-0 min-w-0 flex-1 overflow-y-auto">
        <div className="px-2 pb-12">
          <TabsContent value="personal-info" className="mt-6">
            <PersonalInfo />
          </TabsContent>

          <TabsContent value="skills" className="mt-6">
            <Skills />
          </TabsContent>

          <TabsContent value="experience" className="mt-6">
            <Experience />
          </TabsContent>

          <TabsContent value="education" className="mt-6">
            <Education />
          </TabsContent>

          {customSectionFields.map((field, index) => (
            <TabsContent
              key={field.id}
              value={`custom-section-${index}`}
              className="mt-6"
            >
              <CustomSectionPanel
                sectionIndex={index}
                onDeleteSection={() => onRemoveCustomSection(index)}
              />
            </TabsContent>
          ))}
        </div>
      </div>
    </Tabs>
  );
}
