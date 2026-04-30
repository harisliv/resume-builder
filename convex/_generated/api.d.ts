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
import type * as aiImproveSector from "../aiImproveSector.js";
import type * as aiKeywords from "../aiKeywords.js";
import type * as aiMocks from "../aiMocks.js";
import type * as auth from "../auth.js";
import type * as formatResumePrompt from "../formatResumePrompt.js";
import type * as parseResumePdf from "../parseResumePdf.js";
import type * as promptContent from "../promptContent.js";
import type * as promptfoo_prompts_improve_apply from "../promptfoo/prompts/improve_apply.js";
import type * as promptfoo_prompts_improve_questions from "../promptfoo/prompts/improve_questions.js";
import type * as promptfoo_prompts_jd_keyword_extract from "../promptfoo/prompts/jd_keyword_extract.js";
import type * as promptfoo_prompts_jd_keyword_place from "../promptfoo/prompts/jd_keyword_place.js";
import type * as prompts_ai_improve_apply from "../prompts/ai_improve_apply.js";
import type * as prompts_ai_improve_questions from "../prompts/ai_improve_questions.js";
import type * as prompts_jd_keyword_extract from "../prompts/jd_keyword_extract.js";
import type * as prompts_jd_keyword_place from "../prompts/jd_keyword_place.js";
import type * as prompts_pdf_resume_parser from "../prompts/pdf_resume_parser.js";
import type * as resumes from "../resumes.js";
import type * as seeds_resume from "../seeds/resume.js";
import type * as seeds_seedResume from "../seeds/seedResume.js";
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
  aiImproveSector: typeof aiImproveSector;
  aiKeywords: typeof aiKeywords;
  aiMocks: typeof aiMocks;
  auth: typeof auth;
  formatResumePrompt: typeof formatResumePrompt;
  parseResumePdf: typeof parseResumePdf;
  promptContent: typeof promptContent;
  "promptfoo/prompts/improve_apply": typeof promptfoo_prompts_improve_apply;
  "promptfoo/prompts/improve_questions": typeof promptfoo_prompts_improve_questions;
  "promptfoo/prompts/jd_keyword_extract": typeof promptfoo_prompts_jd_keyword_extract;
  "promptfoo/prompts/jd_keyword_place": typeof promptfoo_prompts_jd_keyword_place;
  "prompts/ai_improve_apply": typeof prompts_ai_improve_apply;
  "prompts/ai_improve_questions": typeof prompts_ai_improve_questions;
  "prompts/jd_keyword_extract": typeof prompts_jd_keyword_extract;
  "prompts/jd_keyword_place": typeof prompts_jd_keyword_place;
  "prompts/pdf_resume_parser": typeof prompts_pdf_resume_parser;
  resumes: typeof resumes;
  "seeds/resume": typeof seeds_resume;
  "seeds/seedResume": typeof seeds_seedResume;
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
