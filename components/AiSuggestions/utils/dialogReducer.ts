import { createDefaultSelection } from '@/types/aiSuggestions';
import type { TRawModelResult, TModelResult } from '@/types/aiSuggestions';

/** Discriminated union representing each phase of the suggestions dialog. */
export type TDialogState =
  | { phase: 'idle'; jobDescription: string; error: string | null }
  | { phase: 'generating'; jobDescription: string }
  | {
      phase: 'results';
      jobDescription: string;
      results: TModelResult[];
      activeModelIdx: number;
      isRegenerating: boolean;
      regenerateError: string | null;
    };

export type TDialogAction =
  | { type: 'SET_JOB_DESCRIPTION'; payload: string }
  | { type: 'GENERATE_START' }
  | {
      type: 'GENERATE_SUCCESS';
      payload: { results: TRawModelResult[]; jobDescription: string };
    }
  | { type: 'GENERATE_ERROR'; payload: string }
  | { type: 'REGENERATE_START' }
  | { type: 'REGENERATE_ERROR'; payload: string }
  | { type: 'SET_ACTIVE_MODEL'; idx: number }
  | { type: 'BACK' }
  | { type: 'RESET' }
  | { type: 'TOGGLE_SUMMARY' }
  | { type: 'TOGGLE_EXPERIENCE_FIELD'; expIdx: number; field: 'description' | 'highlight'; highlightIdx?: number }
  | { type: 'REMOVE_SKILL'; category: string; skillIdx: number };

export const initialDialogState: TDialogState = {
  phase: 'idle',
  jobDescription: '',
  error: null
};

/** Converts a TRawModelResult into a TModelResult with default selection state. */
function toModelResult(raw: TRawModelResult): TModelResult {
  if (raw.error || !raw.suggestions) {
    return { modelId: raw.modelId, label: raw.label, error: raw.error ?? 'Unknown error' };
  }
  return {
    modelId: raw.modelId,
    label: raw.label,
    editedSuggestions: structuredClone(raw.suggestions),
    selection: createDefaultSelection(raw.suggestions)
  };
}

/**
 * Reducer for AiSuggestionsDialog. Enforces valid phase transitions
 * and colocates multi-model results in the results phase.
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
        results: action.payload.results.map(toModelResult),
        activeModelIdx: 0,
        isRegenerating: false,
        regenerateError: null
      };

    case 'GENERATE_ERROR':
      if (state.phase !== 'generating') return state;
      return { phase: 'idle', jobDescription: state.jobDescription, error: action.payload };

    case 'REGENERATE_START':
      if (state.phase !== 'results') return state;
      return { ...state, isRegenerating: true, regenerateError: null };

    case 'REGENERATE_ERROR':
      if (state.phase !== 'results') return state;
      return { ...state, isRegenerating: false, regenerateError: action.payload };

    case 'SET_ACTIVE_MODEL':
      if (state.phase !== 'results') return state;
      return { ...state, activeModelIdx: action.idx };

    case 'BACK':
      if (state.phase !== 'results') return state;
      return initialDialogState;

    case 'RESET':
      return initialDialogState;

    case 'TOGGLE_SUMMARY': {
      if (state.phase !== 'results') return state;
      const active = state.results[state.activeModelIdx];
      if (!active.selection) return state;
      const results = [...state.results];
      results[state.activeModelIdx] = { ...active, selection: { ...active.selection, summary: !active.selection.summary } };
      return { ...state, results };
    }

    case 'TOGGLE_EXPERIENCE_FIELD': {
      if (state.phase !== 'results') return state;
      const active = state.results[state.activeModelIdx];
      if (!active.selection) return state;
      const { expIdx, field, highlightIdx } = action;
      const experience = [...active.selection.experience];
      const exp = { ...experience[expIdx] };
      if (field === 'description') {
        exp.description = !exp.description;
      } else if (highlightIdx !== undefined) {
        exp.highlights = [...exp.highlights];
        exp.highlights[highlightIdx] = !exp.highlights[highlightIdx];
      }
      experience[expIdx] = exp;
      const results = [...state.results];
      results[state.activeModelIdx] = { ...active, selection: { ...active.selection, experience } };
      return { ...state, results };
    }

    case 'REMOVE_SKILL': {
      if (state.phase !== 'results') return state;
      const active = state.results[state.activeModelIdx];
      if (!active.editedSuggestions) return state;
      const nextSkills = { ...(active.editedSuggestions.skills ?? {}) };
      const currentCategory = nextSkills[action.category] ?? [];
      nextSkills[action.category] = currentCategory.filter(
        (_, i) => i !== action.skillIdx
      );
      if (nextSkills[action.category].length === 0) {
        delete nextSkills[action.category];
      }
      const results = [...state.results];
      results[state.activeModelIdx] = {
        ...active,
        editedSuggestions: {
          ...active.editedSuggestions,
          skills: Object.keys(nextSkills).length > 0 ? nextSkills : undefined
        }
      };
      return { ...state, results };
    }

    default:
      return state;
  }
}
