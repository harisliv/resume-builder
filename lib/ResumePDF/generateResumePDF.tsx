import ResumeDocument from '@/lib/ResumePDF/ResumeDocument';
import type { TCombinedResumeData } from '@/types/schema';
import { pdf } from '@react-pdf/renderer';

/**
 * Fallback: downloads via anchor (no Save As prompt). Used when showSaveFilePicker is unsupported.
 */
function downloadViaAnchor(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    if (document.body.contains(link)) document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}

/**
 * Generates and downloads the resume as PDF. Uses showSaveFilePicker when available (Chrome/Edge)
 * to prompt user for save location; falls back to direct download in Firefox/Safari.
 * Filename: {title}_{month}_{year}.pdf
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
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const fileName = `${title}_${month}_${year}.pdf`;

  if ('showSaveFilePicker' in window) {
    try {
      const handle = await (window as Window & { showSaveFilePicker: (o: object) => Promise<FileSystemFileHandle> }).showSaveFilePicker({
        suggestedName: fileName,
        types: [{ description: 'PDF', accept: { 'application/pdf': ['.pdf'] } }]
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
    } catch (err) {
      if ((err as Error).name === 'AbortError') return; // user cancelled
      downloadViaAnchor(blob, fileName);
    }
  } else {
    downloadViaAnchor(blob, fileName);
  }
};
