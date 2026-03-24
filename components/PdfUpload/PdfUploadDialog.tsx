'use client';

import { useCallback, useRef, useState } from 'react';
import { Upload, FileText, Loader2, AlertTriangle } from 'lucide-react';
import { useAction, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import usePrivileges from '@/hooks/usePrivileges';
import { useGetUserResumeTitles } from '@/hooks/useGetUserResumeTitles';
import { extractTextFromPdf } from '@/lib/pdfParser';
import { normalizeParsedResume } from '@/types/pdfParse';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { TResumeForm } from '@/types/schema';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onParsed: (title: string, formData: TResumeForm) => void;
};

type TStatus = 'idle' | 'extracting' | 'parsing' | 'error';

/**
 * Dialog for uploading a PDF resume and parsing it into structured data.
 * Extracts text client-side, sends to AI for structuring.
 */
export function PdfUploadDialog({ open, onOpenChange, onParsed }: Props) {
  const [status, setStatus] = useState<TStatus>('idle');
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const parseAction = useAction(api.parseResumePdf.parseResumePdf);
  const { isAdmin, resumeLimit } = usePrivileges();
  const pdfAttempts = useQuery(api.aiAttempts.getRemainingAttempts, {
    type: 'pdf'
  });
  const { data: resumeTitles } = useGetUserResumeTitles();
  const pdfLimitReached = !isAdmin && pdfAttempts?.remaining === 0;
  const resumeLimitReached = (resumeTitles?.length ?? 0) >= resumeLimit;

  const reset = useCallback(() => {
    setStatus('idle');
    setError('');
    setFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.type !== 'application/pdf') {
        setError('Please select a PDF file.');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError('File must be under 10MB.');
        return;
      }

      setFileName(file.name);
      setError('');

      try {
        setStatus('extracting');
        const rawText = await extractTextFromPdf(file);

        if (!rawText.trim()) {
          setError('Could not extract text from PDF. It may be image-based.');
          setStatus('error');
          return;
        }

        setStatus('parsing');
        const parsed = await parseAction({ rawText });
        const normalized = normalizeParsedResume(parsed);

        const formData: TResumeForm = {
          personalInfo: normalized.personalInfo,
          experience: normalized.experience,
          education: normalized.education,
          skills: normalized.skills
        };

        onParsed(normalized.title, formData);
        onOpenChange(false);
        reset();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to parse PDF.');
        setStatus('error');
      }
    },
    [parseAction, onParsed, onOpenChange, reset]
  );

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) reset();
      onOpenChange(nextOpen);
    },
    [onOpenChange, reset]
  );

  const isProcessing = status === 'extracting' || status === 'parsing';

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import PDF Resume</DialogTitle>
          <DialogDescription>
            Upload a PDF resume to auto-fill your resume data.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
            disabled={isProcessing}
          />

          {pdfLimitReached || resumeLimitReached ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <AlertTriangle className="text-destructive size-10" />
              <p className="text-destructive text-sm font-medium">
                {resumeLimitReached
                  ? 'Resume limit reached. Upgrade to create more.'
                  : `PDF import limit reached (${pdfAttempts?.max}/month).`}
              </p>
              <p className="text-muted-foreground text-xs">
                {resumeLimitReached
                  ? 'Delete an existing resume or upgrade your plan.'
                  : 'Try again next month.'}
              </p>
            </div>
          ) : isProcessing ? (
            <div className="flex flex-col items-center gap-3 py-6">
              <Loader2 className="text-muted-foreground size-10 animate-spin" />
              <p className="text-muted-foreground text-sm">
                {status === 'extracting'
                  ? 'Extracting text from PDF...'
                  : 'AI is parsing your resume...'}
              </p>
              {fileName && (
                <div className="text-muted-foreground flex items-center gap-2 text-xs">
                  <FileText className="size-3" />
                  {fileName}
                </div>
              )}
            </div>
          ) : (
            <Button
              variant="outline"
              className="h-32 w-full border-dashed"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center gap-2">
                <Upload className="text-muted-foreground size-8" />
                <span className="text-muted-foreground text-sm">
                  {fileName || 'Click to select a PDF file'}
                </span>
              </div>
            </Button>
          )}

          {error && (
            <p className="text-destructive text-center text-sm">{error}</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
