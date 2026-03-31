import { afterEach, describe, expect, it, vi } from 'vitest';
import { isMockAiEnabled } from './aiMocks';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('isMockAiEnabled', () => {
  it('enables mock mode for explicit mock env', () => {
    vi.stubEnv('MOCK_AI', 'true');

    expect(isMockAiEnabled()).toBe(true);
  });

  it('enables mock mode for testing features env', () => {
    vi.stubEnv('NEXT_PUBLIC_TESTING_FEATURES', 'true');

    expect(isMockAiEnabled()).toBe(true);
  });
});
