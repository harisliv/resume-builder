import { describe, expect, it } from 'vitest';
import { PARSE_SYSTEM_PROMPT } from './parseResumePdfPrompt';

describe('PARSE_SYSTEM_PROMPT', () => {
  it('instructs the model to split dated sub-roles under one company', () => {
    expect(PARSE_SYSTEM_PROMPT).toContain('same company');
    expect(PARSE_SYSTEM_PROMPT).toContain('separate experience item');
    expect(PARSE_SYSTEM_PROMPT).toContain('distinct date range');
  });

  it('instructs the model to preserve per-item dates and fallback location', () => {
    expect(PARSE_SYSTEM_PROMPT).toContain('nearest date range');
    expect(PARSE_SYSTEM_PROMPT).toContain('personalInfo.location');
  });

  it('includes a few-shot example for nested roles under one company', () => {
    expect(PARSE_SYSTEM_PROMPT).toContain('Example input');
    expect(PARSE_SYSTEM_PROMPT).toContain('NTT DATA Europe & Latam');
    expect(PARSE_SYSTEM_PROMPT).toContain('"experience"');
    expect(PARSE_SYSTEM_PROMPT).toContain('"startDate": "Jul 2025"');
    expect(PARSE_SYSTEM_PROMPT).toContain('"location": "Madrid, Spain"');
    expect(PARSE_SYSTEM_PROMPT).toContain('"projectName": "UNFCCC Initiative Self-Service platform"');
  });

  it('documents the form-friendly date and phone formats', () => {
    expect(PARSE_SYSTEM_PROMPT).toContain('E.164');
    expect(PARSE_SYSTEM_PROMPT).toContain('Jan 2023');
    expect(PARSE_SYSTEM_PROMPT).toContain('endDate as an empty string');
    expect(PARSE_SYSTEM_PROMPT).toContain('graduationDate');
  });
});
