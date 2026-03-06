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
import type * as aiSuggestions from "../aiSuggestions.js";
import type * as aiSuggestionsMultiModel from "../aiSuggestionsMultiModel.js";
import type * as auth from "../auth.js";
import type * as formatResumePrompt from "../formatResumePrompt.js";
import type * as resumes from "../resumes.js";
import type * as seedSystemPrompts from "../seedSystemPrompts.js";
import type * as systemPrompts from "../systemPrompts.js";
import type * as systemPropts from "../systemPropts.js";
import type * as validators from "../validators.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  aiAttempts: typeof aiAttempts;
  aiSuggestions: typeof aiSuggestions;
  aiSuggestionsMultiModel: typeof aiSuggestionsMultiModel;
  auth: typeof auth;
  formatResumePrompt: typeof formatResumePrompt;
  resumes: typeof resumes;
  seedSystemPrompts: typeof seedSystemPrompts;
  systemPrompts: typeof systemPrompts;
  systemPropts: typeof systemPropts;
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
