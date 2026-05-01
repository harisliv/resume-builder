'use node';

import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';
import { createProviderRegistry } from 'ai';

type TRegisteredModelId =
  | `anthropic/${string}`
  | `google/${string}`
  | `openai/${string}`;

/** AI SDK provider registry used by string model IDs like "openai/gpt-5". */
const aiProviderRegistry = createProviderRegistry(
  {
    anthropic,
    google,
    openai
  },
  { separator: '/' }
);

/** Validates and narrows full provider/model IDs for the local registry. */
function toRegisteredModelId(modelId: string): TRegisteredModelId {
  const [provider, ...modelParts] = modelId.split('/');
  const model = modelParts.join('/');

  if (!model) {
    throw new Error(`AI model id "${modelId}" must be in provider/model format`);
  }

  switch (provider) {
    case 'anthropic':
      return `anthropic/${model}`;
    case 'google':
      return `google/${model}`;
    case 'openai':
      return `openai/${model}`;
    default:
      throw new Error(`AI_MODEL_PROVIDER "${provider}" is not supported`);
  }
}

/** Builds the configured AI SDK model ID from env vars. */
export function getAiModelId() {
  const provider = process.env.AI_MODEL_PROVIDER;
  const model = process.env.AI_MODEL;

  if (!model) throw new Error('AI_MODEL or AI_MODEL_ID env var not set');
  if (model.includes('/')) return model;
  if (!provider) throw new Error('AI_MODEL_PROVIDER env var not set');

  return `${provider}/${model}`;
}

/** Returns the configured provider-agnostic language model. */
export function getAiLanguageModel() {
  return aiProviderRegistry.languageModel(toRegisteredModelId(getAiModelId()));
}

/** Returns true when the configured model targets a specific provider. */
export function isAiProvider(provider: string) {
  return getAiModelId().startsWith(`${provider}/`);
}

/** Computes model call cost from token usage and env pricing. */
export function computeAiCost(usage: { inputTokens?: number; outputTokens?: number }) {
  const pricing = {
    input: Number(process.env.AI_MODEL_PRICING_INPUT ?? 0),
    output: Number(process.env.AI_MODEL_PRICING_OUTPUT ?? 0)
  };

  return (
    ((usage.inputTokens ?? 0) * pricing.input +
      (usage.outputTokens ?? 0) * pricing.output) /
    1_000_000
  );
}
