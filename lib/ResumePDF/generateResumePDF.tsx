import ResumeDocument from '@/lib/ResumePDF/ResumeDocument';
import type { TCombinedResumeData } from '@/types';
import { pdf } from '@react-pdf/renderer';

export const generateResumePDF = async (
  data: TCombinedResumeData
): Promise<void> => {
  const doc = <ResumeDocument formData={data.formData} infoData={data.infoData} />;
  const instance = pdf(doc);
  const blob = await instance.toBlob();

  const fileName = data.formData.personalInfo?.fullName
    ? `${data.formData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`
    : 'Resume.pdf';

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
