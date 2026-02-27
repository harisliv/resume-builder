import ResumeDocument from '@/lib/ResumePDF/ResumeDocument';
import type { TCombinedResumeData } from '@/types/schema';
import { pdf } from '@react-pdf/renderer';

/**
 * Generates and downloads the resume as PDF. Filename: {title}_{day}_{month}_{year}.pdf
 */
export const generateResumePDF = async (
  data: TCombinedResumeData
): Promise<void> => {
  const doc = (
    <ResumeDocument formData={data.formData} infoData={data.infoData} />
  );
  const instance = pdf(doc);
  const blob = await instance.toBlob();

  const title = data.infoData.title?.trim().replace(/\s+/g, '_') || 'Resume';
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const fileName = `${title}_${day}_${month}_${year}.pdf`;

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.style.display = 'none';

  document.body.appendChild(link);

  setTimeout(() => {
    link.click();

    setTimeout(() => {
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
      URL.revokeObjectURL(url);
    }, 100);
  }, 0);
};
