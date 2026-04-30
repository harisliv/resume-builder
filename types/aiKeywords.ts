/** A keyword extracted from a JD that's missing from the resume. */
export type TExtractedKeyword = {
  /** Raw phrase as it appears in the JD. */
  keyword: string;
  /** Normalized, industry-standard form of the keyword. */
  canonicalName: string;
  /** The JD sentence/requirement where this keyword appears. */
  context: string;
};

/** Result of keyword extraction — flat keyword list. */
export type TKeywordExtractionResult = {
  /** Derived title from JD, e.g. "Frontend Engineer at Acme Corp". */
  title: string;
  keywords: TExtractedKeyword[];
  cost?: number;
};

/** A single placement target the user picked for a keyword. */
export type TPlacementTarget =
  | {
      type: 'skill';
      categoryId: string;
      categoryName: string;
      isNewCategory?: boolean;
    }
  | { type: 'highlight'; experienceId: string; highlightId: string; currentText: string };

/** Result of placing a single keyword — the updated lines. */
export type TPlacementResult = {
  /** Updated highlights with new text. */
  updatedHighlights: { experienceId: string; highlightId: string; newText: string; oldText: string }[];
  /** Skills added. */
  addedSkills: { categoryId: string; categoryName: string; value: string }[];
  cost?: number;
};

/** Client-side accumulated review item for a rewritten highlight. */
export type TAccumulatedHighlightEdit = {
  reviewId: string;
  experienceId: string;
  highlightId: string;
  newText: string;
  oldText: string;
};

/** Client-side accumulated review item for an added skill. */
export type TAccumulatedSkillAddition = {
  reviewId: string;
  categoryId: string;
  categoryName: string;
  value: string;
};

/** Tracks accumulated edits across all keyword iterations. */
export type TAccumulatedEdits = {
  highlightEdits: TAccumulatedHighlightEdit[];
  skillAdditions: TAccumulatedSkillAddition[];
};
