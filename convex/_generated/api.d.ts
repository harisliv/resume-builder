/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as aiAttempts from "../aiAttempts.js";
import type * as aiImprove from "../aiImprove.js";
import type * as aiImproveActions from "../aiImproveActions.js";
import type * as aiKeywords from "../aiKeywords.js";
import type * as aiMocks from "../aiMocks.js";
import type * as aiSuggestions from "../aiSuggestions.js";
import type * as auth from "../auth.js";
import type * as formatResumePrompt from "../formatResumePrompt.js";
import type * as parseResumePdf from "../parseResumePdf.js";
import type * as resumes from "../resumes.js";
import type * as seeds_prompts from "../seeds/prompts.js";
import type * as seeds_promptsV2 from "../seeds/promptsV2.js";
import type * as seeds_resume from "../seeds/resume.js";
import type * as seeds_seedAll from "../seeds/seedAll.js";
import type * as seeds_seedPrompts from "../seeds/seedPrompts.js";
import type * as seeds_seedPromptsV2 from "../seeds/seedPromptsV2.js";
import type * as seeds_seedResume from "../seeds/seedResume.js";
import type * as systemPrompts from "../systemPrompts.js";
import type * as validators from "../validators.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  aiAttempts: typeof aiAttempts;
  aiImprove: typeof aiImprove;
  aiImproveActions: typeof aiImproveActions;
  aiKeywords: typeof aiKeywords;
  aiMocks: typeof aiMocks;
  aiSuggestions: typeof aiSuggestions;
  auth: typeof auth;
  formatResumePrompt: typeof formatResumePrompt;
  parseResumePdf: typeof parseResumePdf;
  resumes: typeof resumes;
  "seeds/prompts": typeof seeds_prompts;
  "seeds/promptsV2": typeof seeds_promptsV2;
  "seeds/resume": typeof seeds_resume;
  "seeds/seedAll": typeof seeds_seedAll;
  "seeds/seedPrompts": typeof seeds_seedPrompts;
  "seeds/seedPromptsV2": typeof seeds_seedPromptsV2;
  "seeds/seedResume": typeof seeds_seedResume;
  systemPrompts: typeof systemPrompts;
  validators: typeof validators;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
