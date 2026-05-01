import { describe, expect, it } from 'vitest';
import { hasUnresolvedPlaceholder, sanitizeImproveRewrite } from './aiImproveSanitize';

describe('hasUnresolvedPlaceholder', () => {
  it('flags bracketed metric placeholders from AI rewrites', () => {
    expect(hasUnresolvedPlaceholder('Improved load time by [X%]')).toBe(true);
    expect(hasUnresolvedPlaceholder('Supported [number] users')).toBe(true);
  });

  it('allows normal bracketed product text', () => {
    expect(hasUnresolvedPlaceholder('Maintained internal UI [React] docs')).toBe(false);
  });
});

describe('sanitizeImproveRewrite', () => {
  it('rejects blank and unresolved-placeholder rewrites', () => {
    expect(sanitizeImproveRewrite('   ')).toBeNull();
    expect(sanitizeImproveRewrite('Built dashboards for [X] applications')).toBeNull();
  });

  it('trims usable rewrite text', () => {
    expect(sanitizeImproveRewrite(' Built dashboards for reporting apps ')).toBe(
      'Built dashboards for reporting apps'
    );
  });
});
