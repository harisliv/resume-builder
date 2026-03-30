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
import type * as auth from "../auth.js";
import type * as formatResumePrompt from "../formatResumePrompt.js";
import type * as parseResumePdf from "../parseResumePdf.js";
import type * as resumes from "../resumes.js";
import type * as seeds_content_prompts_ai_improve_apply from "../seeds/content/prompts/ai_improve_apply.js";
import type * as seeds_content_prompts_ai_improve_questions from "../seeds/content/prompts/ai_improve_questions.js";
import type * as seeds_content_prompts_jd_keyword_extract from "../seeds/content/prompts/jd_keyword_extract.js";
import type * as seeds_content_prompts_jd_keyword_place from "../seeds/content/prompts/jd_keyword_place.js";
import type * as seeds_content_prompts_old_improve_cv from "../seeds/content/prompts/old/improve_cv.js";
import type * as seeds_content_prompts_old_jd_match from "../seeds/content/prompts/old/jd_match.js";
import type * as seeds_content_prompts_pdf_resume_parser from "../seeds/content/prompts/pdf_resume_parser.js";
import type * as seeds_resume from "../seeds/resume.js";
import type * as seeds_seedAll from "../seeds/seedAll.js";
import type * as seeds_seedPrompts from "../seeds/seedPrompts.js";
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
  auth: typeof auth;
  formatResumePrompt: typeof formatResumePrompt;
  parseResumePdf: typeof parseResumePdf;
  resumes: typeof resumes;
  "seeds/content/prompts/ai_improve_apply": typeof seeds_content_prompts_ai_improve_apply;
  "seeds/content/prompts/ai_improve_questions": typeof seeds_content_prompts_ai_improve_questions;
  "seeds/content/prompts/jd_keyword_extract": typeof seeds_content_prompts_jd_keyword_extract;
  "seeds/content/prompts/jd_keyword_place": typeof seeds_content_prompts_jd_keyword_place;
  "seeds/content/prompts/old/improve_cv": typeof seeds_content_prompts_old_improve_cv;
  "seeds/content/prompts/old/jd_match": typeof seeds_content_prompts_old_jd_match;
  "seeds/content/prompts/pdf_resume_parser": typeof seeds_content_prompts_pdf_resume_parser;
  "seeds/resume": typeof seeds_resume;
  "seeds/seedAll": typeof seeds_seedAll;
  "seeds/seedPrompts": typeof seeds_seedPrompts;
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
