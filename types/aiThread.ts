/** Structured payload from an AI improvement assistant turn. */
export type TAssistantPayload = {
  roastItems?: string[];
  questions?: string[];
  resumePatch?: string;
  isReadyToApply?: boolean;
};

/** A message in an AI improvement thread. */
export type TThreadMessage = {
  _id: string;
  _creationTime: number;
  threadId: string;
  role: 'user' | 'assistant';
  content: string;
  structuredPayload?: TAssistantPayload;
};
