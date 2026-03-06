import type { TModelConfig } from '@/types/aiSuggestions';

/**
 * Model definitions with pricing ($/1M tokens).
 * @see https://ai.google.dev/gemini-api/docs/pricing
 * @see https://docs.anthropic.com/en/docs/about-claude/pricing
 * @see https://openai.com/api/pricing/
 */
export const MULTI_MODEL_CONFIGS: readonly TModelConfig[] = [
  {
    provider: 'google',
    id: 'gemini-pro-latest',
    label: 'Gemini Pro Latest',
    pricing: { input: 1.25, output: 10.0 }
  },
  {
    provider: 'anthropic',
    id: 'claude-sonnet-4-6',
    label: 'Claude Sonnet 4.6',
    pricing: { input: 3.0, output: 15.0 }
  },
  {
    provider: 'anthropic',
    id: 'claude-opus-4-6',
    label: 'Claude Opus 4.6',
    pricing: { input: 5.0, output: 25.0 }
  },
  {
    provider: 'openai',
    id: 'gpt-5.4',
    label: 'GPT 5.4',
    pricing: { input: 2.5, output: 15.0 }
  }
] as const;

/** Default model used in single-model dialog. */
export const DEFAULT_MODEL_CONFIG: TModelConfig = MULTI_MODEL_CONFIGS[1];
