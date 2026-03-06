import { createDefaultSelection } from '@/types/aiSuggestions';
import type { TRawModelResult, TModelResult } from '@/types/aiSuggestions';

/** Discriminated union representing each phase of the suggestions dialog. */
export type TDialogState =
  | { phase: 'idle'; jobDescription: string }
  | { phase: 'generating'; jobDescription: string }
  | {
      phase: 'results';
      jobDescription: string;
      result: TModelResult;
      isRegenerating: boolean;
      regenerateError: string | null;
    };

export type TDialogAction =
  | { type: 'SET_JOB_DESCRIPTION'; payload: string }
  | { type: 'GENERATE_START' }
  | {
      type: 'GENERATE_SUCCESS';
      payload: { result: TRawModelResult; jobDescription: string };
    }
  | { type: 'GENERATE_ERROR' }
  | { type: 'REGENERATE_START' }
  | { type: 'REGENERATE_ERROR'; payload: string }
  | { type: 'BACK' }
  | { type: 'RESET' }
  | { type: 'TOGGLE_SUMMARY' }
  | { type: 'TOGGLE_EXPERIENCE_FIELD'; expIdx: number; field: 'description' | 'highlight'; highlightIdx?: number }
  | { type: 'TOGGLE_SKILL'; categoryIdx: number; skillIdx: number };

export const initialDialogState: TDialogState = {
  phase: 'idle',
  jobDescription: ''
};

/** Converts a TRawModelResult into a TModelResult with default selection state. */
function toModelResult(raw: TRawModelResult): TModelResult {
  if (raw.error || !raw.suggestions) {
    return { modelId: raw.modelId, label: raw.label, error: raw.error ?? 'Unknown error', cost: raw.cost, durationMs: raw.durationMs };
  }
  return {
    modelId: raw.modelId,
    label: raw.label,
    editedSuggestions: structuredClone(raw.suggestions),
    selection: createDefaultSelection(raw.suggestions),
    cost: raw.cost,
    durationMs: raw.durationMs,
    jdKeywords: raw.jdKeywords ?? raw.suggestions.jdKeywords
  };
}

/**
 * Reducer for AiSuggestionsDialog. Enforces valid phase transitions
 * and manages single-model result state.
 */
export function dialogReducer(state: TDialogState, action: TDialogAction): TDialogState {
  switch (action.type) {
    case 'SET_JOB_DESCRIPTION':
      if (state.phase !== 'idle') return state;
      return { ...state, jobDescription: action.payload };

    case 'GENERATE_START':
      if (state.phase !== 'idle') return state;
      return { phase: 'generating', jobDescription: state.jobDescription };

    case 'GENERATE_SUCCESS':
      return {
        phase: 'results',
        jobDescription: action.payload.jobDescription,
        result: toModelResult(action.payload.result),
        isRegenerating: false,
        regenerateError: null
      };

    case 'GENERATE_ERROR':
      if (state.phase !== 'generating') return state;
      return { phase: 'idle', jobDescription: state.jobDescription };

    case 'REGENERATE_START':
      if (state.phase !== 'results') return state;
      return { ...state, isRegenerating: true, regenerateError: null };

    case 'REGENERATE_ERROR':
      if (state.phase !== 'results') return state;
      return { ...state, isRegenerating: false, regenerateError: action.payload };

    case 'BACK':
      if (state.phase !== 'results') return state;
      return initialDialogState;

    case 'RESET':
      return initialDialogState;

    case 'TOGGLE_SUMMARY': {
      if (state.phase !== 'results') return state;
      const { result } = state;
      if (!result.selection) return state;
      return { ...state, result: { ...result, selection: { ...result.selection, summary: !result.selection.summary } } };
    }

    case 'TOGGLE_EXPERIENCE_FIELD': {
      if (state.phase !== 'results') return state;
      const { result } = state;
      if (!result.selection) return state;
      const { expIdx, field, highlightIdx } = action;
      const experience = [...result.selection.experience];
      const exp = { ...experience[expIdx] };
      if (field === 'description') {
        exp.description = !exp.description;
      } else if (highlightIdx !== undefined) {
        exp.highlights = [...exp.highlights];
        exp.highlights[highlightIdx] = !exp.highlights[highlightIdx];
      }
      experience[expIdx] = exp;
      return { ...state, result: { ...result, selection: { ...result.selection, experience } } };
    }

    case 'TOGGLE_SKILL': {
      if (state.phase !== 'results') return state;
      const { result } = state;
      if (!result.selection) return state;
      const nextSkills = [...result.selection.skills];
      const category = nextSkills[action.categoryIdx];
      if (!category || category.selected[action.skillIdx] === undefined) return state;
      const nextCategory = { ...category, selected: [...category.selected] };
      nextCategory.selected[action.skillIdx] = !nextCategory.selected[action.skillIdx];
      nextSkills[action.categoryIdx] = nextCategory;
      return {
        ...state,
        result: { ...result, selection: { ...result.selection, skills: nextSkills } }
      };
    }

    default:
      return state;
  }
}
