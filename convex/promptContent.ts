import improveApplyPromptFile from './prompts/ai_improve_apply.cjs';
import improveQuestionsPromptFile from './prompts/ai_improve_questions.cjs';
import keywordExtractPromptFile from './prompts/jd_keyword_extract.cjs';
import keywordPlacePromptFile from './prompts/jd_keyword_place.cjs';
import pdfParserPromptFile from './prompts/pdf_resume_parser.cjs';

type TPromptFile = {
  type: string;
  content: string;
};

const improveApplyPrompt: TPromptFile = improveApplyPromptFile;
const improveQuestionsPrompt: TPromptFile = improveQuestionsPromptFile;
const keywordExtractPrompt: TPromptFile = keywordExtractPromptFile;
const keywordPlacePrompt: TPromptFile = keywordPlacePromptFile;
const pdfParserPrompt: TPromptFile = pdfParserPromptFile;

/** Prompt text for AI resume edit application. */
export const AI_IMPROVE_APPLY_PROMPT = improveApplyPrompt.content;

/** Prompt text for AI resume question generation. */
export const AI_IMPROVE_QUESTIONS_PROMPT = improveQuestionsPrompt.content;

/** Prompt text for extracting missing job-description keywords. */
export const JD_KEYWORD_EXTRACT_PROMPT = keywordExtractPrompt.content;

/** Prompt text for placing one keyword into resume highlights. */
export const JD_KEYWORD_PLACE_PROMPT = keywordPlacePrompt.content;

/** Prompt text for parsing PDF resume text. */
export const PDF_RESUME_PARSER_PROMPT = pdfParserPrompt.content;
