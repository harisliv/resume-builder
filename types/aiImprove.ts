/** A single atomic edit produced by the improve flow. */
export type TImproveEdit =
  | { type: 'updateHighlight'; experienceId: string; highlightId: string; oldValue: string; newValue: string }
  | { type: 'updateDescription'; experienceId: string; oldValue: string; newValue: string }
  | { type: 'updateSummary'; oldValue: string; newValue: string };

/** A targeted question the AI asks about a weak bullet or gap. */
export type TImproveQuestion = {
  question: string;
  context: string;
  targetType: 'highlight' | 'description' | 'summary';
  experienceId?: string;
  highlightId?: string;
};

/** A question paired with the user's answer, ready for edit generation. */
export type TAnsweredQuestion = TImproveQuestion & { answer: string };
