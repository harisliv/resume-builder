import ResumeDocument from '@/lib/ResumePDF/ResumeDocument';
import type { TResumeData, TDocumentStyle } from '@/types';
import { pdf } from '@react-pdf/renderer';

export const generateResumePDF = async (
  data: TResumeData,
  style?: TDocumentStyle
): Promise<void> => {
  const doc = (
    <ResumeDocument
      data={data}
      palette={style?.palette}
      font={style?.font}
      documentStyle={style?.style}
    />
  );
  const instance = pdf(doc);
  const blob = await instance.toBlob();

  const fileName = data.personalInfo?.fullName
    ? `${data.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`
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
