import { v } from 'convex/values';
import { internalQuery, mutation, query } from './_generated/server';

/** System prompt for the questions phase — identifies weak spots and asks targeted questions. */
export const SYSTEM_PROMPT_QUESTIONS = `
Role: You are a senior resume consultant and hiring manager.

Task: Read the resume and generate specific follow-up questions to surface missing metrics and achievements. Target the weakest bullets and gaps — one question per weak bullet or gap you identify.

Rules:
- Questions must be hyper-specific: "What % did X improve?" not "Tell me about your achievements."
- Each question should target a specific bullet or gap you identified.
- Generate 5-10 questions covering the most impactful areas.

Output ONLY a JSON block, no other text:
\`\`\`json
{
  "questions": [
    { "question": "specific question", "context": "exact resume line being questioned" }
  ],
  "isReadyToApply": false
}
\`\`\`
`;

/** System prompt for generating the improved resume from user answers. */
export const SYSTEM_PROMPT_APPLY = `
Role: You are a senior resume writer. You receive a resume and the user's answers to targeted questions. Generate an improved version.

Rules:
- No hallucinations: only use facts from the resume and user answers.
- No M-dashes. Direct, human-sounding language.
- Convert tasks into impact-focused achievements.
- At least 60% of bullets should include metrics. Use [X%] placeholder only if the user truly didn't provide the number.
- Keep the exact skill category names and order from the input.
- Fix any typos in the original resume.

Output ONLY a JSON block with the improved resume, no other text:
\`\`\`json
{
  "resumePatch": {
    "summary": "improved summary text",
    "experience": [
      {
        "description": "improved description or null to keep original",
        "highlights": ["improved bullet 1", "improved bullet 2"]
      }
    ],
    "skills": [
      { "name": "Category Name", "values": ["skill1", "skill2"] }
    ]
  },
  "isReadyToApply": true
}
\`\`\`
`;

const typeValidator = v.union(v.literal('prompt'), v.literal('rule'));

const rowValidator = v.object({
  _id: v.id('systemPrompts'),
  _creationTime: v.number(),
  name: v.string(),
  content: v.string(),
  type: typeValidator,
  isDefault: v.optional(v.boolean())
});

/** Lists system prompts/rules filtered by type. Rows without type default to 'prompt'. */
export const list = query({
  args: { type: v.optional(typeValidator) },
  returns: v.array(rowValidator),
  handler: async (ctx, args) => {
    const all = await ctx.db.query('systemPrompts').collect();
    const normalized = all.map((r) => ({ ...r, type: r.type ?? ('prompt' as const) }));
    if (!args.type) return normalized;
    return normalized.filter((r) => r.type === args.type);
  }
});

/** Creates a new prompt/rule from an admin edit. Never sets isDefault. */
export const createFromEdit = mutation({
  args: { name: v.string(), content: v.string(), type: typeValidator },
  returns: v.id('systemPrompts'),
  handler: async (ctx, args) => ctx.db.insert('systemPrompts', { ...args, isDefault: false })
});

/** Internal query for default prompt/rule (used by actions). */
export const getDefaultInternal = internalQuery({
  args: { type: typeValidator },
  returns: v.union(rowValidator, v.null()),
  handler: async (ctx, args) => {
    const all = await ctx.db.query('systemPrompts').collect();
    const normalized = all.map((r) => ({ ...r, type: r.type ?? ('prompt' as const) }));
    return normalized.find((r) => r.type === args.type && r.isDefault) ?? null;
  }
});
