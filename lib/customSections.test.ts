import { describe, expect, it } from 'vitest';
import { formatCustomSectionUrlText } from './customSections';

describe('formatCustomSectionUrlText', () => {
  it('keeps the real URL visible for PDF text extraction', () => {
    expect(formatCustomSectionUrlText(' https://example.com/award ')).toBe(
      'URL: https://example.com/award'
    );
  });

  it('omits empty URLs', () => {
    expect(formatCustomSectionUrlText(' ')).toBe('');
  });
});
