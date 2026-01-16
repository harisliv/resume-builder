'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useResumeFormContext } from '@/components/providers/ResumeFormProvider';

export function ResumeSelector() {
  const {
    selectedResumeId,
    handleResumeSelect,
    resumeTitles,
    isLoadingTitles
  } = useResumeFormContext();

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">My Resumes</span>
      <Select
        value={selectedResumeId}
        onValueChange={handleResumeSelect}
        disabled={isLoadingTitles}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue
            placeholder={isLoadingTitles ? 'Loading...' : 'Select a resume'}
          />
        </SelectTrigger>
        <SelectContent>
          {resumeTitles?.map((resume: { id: string; title: string }) => (
            <SelectItem key={resume.id} value={resume.id}>
              {resume.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
