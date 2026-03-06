import { createDefaultSelection } from '@/types/aiSuggestions';
import type { TRawModelResult, TModelResult } from '@/types/aiSuggestions';

/** State for the multi-model comparison page. */
export type TMultiModelState =
  | { phase: 'idle'; jobDescription: string; systemPrompt: string; systemRule: string; error: string | null }
  | { phase: 'generating'; jobDescription: string; systemPrompt: string; systemRule: string }
  | {
      phase: 'results';
      jobDescription: string;
      systemPrompt: string;
      systemRule: string;
      results: TModelResult[];
      activeModelIdx: number;
    };

export type TMultiModelAction =
  | { type: 'SET_JOB_DESCRIPTION'; payload: string }
  | { type: 'SET_SYSTEM_PROMPT'; payload: string }
  | { type: 'SET_SYSTEM_RULE'; payload: string }
  | { type: 'GENERATE_START' }
  | { type: 'GENERATE_SUCCESS'; payload: { results: TRawModelResult[]; jobDescription: string } }
  | { type: 'GENERATE_ERROR'; payload: string }
  | { type: 'SET_ACTIVE_MODEL'; payload: number }
  | { type: 'RESET' }
  | { type: 'TOGGLE_SUMMARY' }
  | { type: 'TOGGLE_EXPERIENCE_FIELD'; expIdx: number; field: 'description' | 'highlight'; highlightIdx?: number }
  | { type: 'TOGGLE_SKILL'; categoryIdx: number; skillIdx: number }
  | { type: 'REMOVE_SKILL'; category: string; skillIdx: number };

export const initialMultiModelState: TMultiModelState = {
  phase: 'idle',
  jobDescription: '',
  systemPrompt: '',
  systemRule: '',
  error: null
};

/** Converts raw backend result into UI-ready TModelResult with default selection. */
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

/** Updates the active model's result immutably; returns new results array. */
function updateActiveResult(
  results: TModelResult[],
  idx: number,
  updater: (r: TModelResult) => TModelResult
): TModelResult[] {
  return results.map((r, i) => (i === idx ? updater(r) : r));
}

/** Reducer for multi-model AI comparison page state. */
export function multiModelReducer(state: TMultiModelState, action: TMultiModelAction): TMultiModelState {
  switch (action.type) {
    case 'SET_JOB_DESCRIPTION':
      if (state.phase !== 'idle') return state;
      return { ...state, jobDescription: action.payload };

    case 'SET_SYSTEM_PROMPT':
      if (state.phase !== 'idle') return state;
      return { ...state, systemPrompt: action.payload };

    case 'SET_SYSTEM_RULE':
      if (state.phase !== 'idle') return state;
      return { ...state, systemRule: action.payload };

    case 'GENERATE_START':
      if (state.phase !== 'idle') return state;
      return { phase: 'generating', jobDescription: state.jobDescription, systemPrompt: state.systemPrompt, systemRule: state.systemRule };

    case 'GENERATE_SUCCESS': {
      const firstSuccessIdx = action.payload.results.findIndex((r) => !r.error);
      return {
        phase: 'results',
        jobDescription: action.payload.jobDescription,
        systemPrompt: state.systemPrompt,
        systemRule: state.systemRule,
        results: action.payload.results.map(toModelResult),
        activeModelIdx: firstSuccessIdx >= 0 ? firstSuccessIdx : 0
      };
    }

    case 'GENERATE_ERROR':
      if (state.phase !== 'generating') return state;
      return { phase: 'idle', jobDescription: state.jobDescription, systemPrompt: state.systemPrompt, systemRule: state.systemRule, error: action.payload };

    case 'SET_ACTIVE_MODEL':
      if (state.phase !== 'results') return state;
      return { ...state, activeModelIdx: action.payload };

    case 'RESET':
      return initialMultiModelState;

    case 'TOGGLE_SUMMARY': {
      if (state.phase !== 'results') return state;
      const { results, activeModelIdx } = state;
      const r = results[activeModelIdx];
      if (!r.selection) return state;
      return {
        ...state,
        results: updateActiveResult(results, activeModelIdx, (m) => ({
          ...m,
          selection: { ...m.selection!, summary: !m.selection!.summary }
        }))
      };
    }

    case 'TOGGLE_EXPERIENCE_FIELD': {
      if (state.phase !== 'results') return state;
      const { results, activeModelIdx } = state;
      const r = results[activeModelIdx];
      if (!r.selection) return state;
      const { expIdx, field, highlightIdx } = action;
      const experience = [...r.selection.experience];
      const exp = { ...experience[expIdx] };
      if (field === 'description') {
        exp.description = !exp.description;
      } else if (highlightIdx !== undefined) {
        exp.highlights = [...exp.highlights];
        exp.highlights[highlightIdx] = !exp.highlights[highlightIdx];
      }
      experience[expIdx] = exp;
      return {
        ...state,
        results: updateActiveResult(results, activeModelIdx, (m) => ({
          ...m,
          selection: { ...m.selection!, experience }
        }))
      };
    }

    case 'TOGGLE_SKILL': {
      if (state.phase !== 'results') return state;
      const { results, activeModelIdx } = state;
      const r = results[activeModelIdx];
      if (!r.selection) return state;
      const { categoryIdx, skillIdx } = action;
      const skills = [...r.selection.skills];
      if (categoryIdx < 0 || categoryIdx >= skills.length) return state;
      const cat = { ...skills[categoryIdx] };
      const sel = [...cat.selected];
      if (skillIdx >= 0 && skillIdx < sel.length) sel[skillIdx] = !sel[skillIdx];
      cat.selected = sel;
      skills[categoryIdx] = cat;
      return {
        ...state,
        results: updateActiveResult(results, activeModelIdx, (m) => ({
          ...m,
          selection: { ...m.selection!, skills }
        }))
      };
    }

    case 'REMOVE_SKILL': {
      if (state.phase !== 'results') return state;
      const { results, activeModelIdx } = state;
      const r = results[activeModelIdx];
      if (!r.editedSuggestions?.skills || !r.selection) return state;
      const catIdx = r.selection.skills.findIndex((s) => s.name === action.category);
      if (catIdx === -1) return state;
      const nextSkills = r.editedSuggestions.skills.map((cat, i) =>
        i === catIdx
          ? { ...cat, values: cat.values.filter((_, si) => si !== action.skillIdx) }
          : cat
      );
      const nextSelSkills = r.selection.skills.map((cat, i) =>
        i === catIdx
          ? { ...cat, selected: cat.selected.filter((_, si) => si !== action.skillIdx) }
          : cat
      );
      return {
        ...state,
        results: updateActiveResult(results, activeModelIdx, (m) => ({
          ...m,
          editedSuggestions: { ...m.editedSuggestions!, skills: nextSkills },
          selection: { ...m.selection!, skills: nextSelSkills }
        }))
      };
    }

    default:
      return state;
  }
}
