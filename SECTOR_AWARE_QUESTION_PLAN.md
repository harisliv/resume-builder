# Sector-Aware Question Generation Plan

## Why change the current approach

Right now, the `improve-questions` prompt has to guess what "good evidence" looks like for every profession.

That creates two problems:

- the prompt becomes hard-coded and brittle
- the model can confuse "specific" with "numeric", even in fields where that is inappropriate

Example:

- for engineering, asking about `% improvement`, latency, or scale can make sense
- for psychology, child protection, or social services, better questions are often about population served, methods used, responsibilities, collaboration, care approach, and observable outcomes

## Core idea

Do not make the prompt memorize every sector.

Instead, give it sector or occupation context at runtime.

High-level flow:

1. Infer the candidate's occupation or sector from the resume
2. Look up structured occupation data from a source like `O*NET` or `ESCO`
3. Append a small "sector guidance" block to the prompt
4. Ask the model to generate targeted questions using that guidance

## What this improves

- fewer inappropriate KPI-style questions in care-centered roles
- less prompt hard-coding
- better behavior across many industries
- easier maintenance over time

Instead of writing many prompt rules like:

- "if psychology, avoid percentages"
- "if social services, do not ask for incident rates"

we give the model a grounded description of what evidence usually matters in that occupation.

## Example

### Current approach

Resume says:

`Shelter Case Coordinator`

Prompt only says:

`Be hyper-specific`

Possible bad output:

- "What incident rate did you track?"
- "What percentage of identified concerns were escalated?"

### Sector-aware approach

Resume says:

`Shelter Case Coordinator`

Runtime adds context like:

```txt
Detected occupation: Shelter Case Coordinator
Sector: Social services / child protection
Typical evidence for this field:
- population served
- intake and assessment responsibilities
- safeguarding practices
- interdisciplinary coordination
- care approach
- observable client outcomes
Avoid unless explicitly present in resume:
- revenue metrics
- percent improvements
- KPI dashboards
- incident-rate reporting
```

Likely better output:

- "What kinds of situations were you responsible for handling during intake?"
- "How did you coordinate with social workers, legal advocates, or healthcare providers?"
- "What approaches did you use to support children experiencing displacement or family separation?"

## Recommended data sources

### Option 1: `O*NET`

Good fit if we want occupation-specific tasks, work activities, and skills.

Useful because it can tell us what typically matters for a role:

- tasks
- work context
- required skills
- common responsibilities

### Option 2: `ESCO`

Good fit if we want a European occupation-and-skills taxonomy.

Useful because it links:

- occupations
- skills
- knowledge
- relationships between them

## How this could work in this repo

This would likely affect the improve flow rather than just the seed prompt.

Possible implementation shape:

1. In the improve-question generation path, infer the likely occupation from the resume summary, title, and experience entries.
2. Call a small mapping layer:
   - exact match when possible
   - fallback to best-effort occupation family
3. Retrieve a compact sector profile:
   - occupation name
   - sector
   - typical evidence types
   - things to avoid unless explicitly present
4. Append that profile to the system prompt before `generateQuestions`
5. Keep the prompt focused on:
   - use the resume
   - use the sector profile
   - ask hyper-specific questions
   - preserve IDs

## Smallest practical version

We do not need a full external integration on day one.

We could start with:

1. Create a small local mapping from common resume titles to occupation families
2. Define a normalized "evidence types" object per family
3. Inject that object into the prompt at runtime
4. Keep `promptfoo` tests for:
   - schema correctness
   - ID correctness
   - sector-appropriate questioning

This would already be better than encoding everything directly in the prompt text.

## More scalable version

If we want to invest more:

1. Add a retrieval layer using `O*NET` or `ESCO`
2. Cache occupation lookups
3. Store a normalized profile used by the improve flow
4. Reuse the same sector profile for:
   - question generation
   - edit generation
   - future JD matching features

## Tradeoff

This approach is better grounded, but it is more engineering work than prompt-only tuning.

So the choice is:

- short-term: keep improving the prompt and tests
- medium-term: move sector awareness into runtime context

## Suggested next step

If we decide to pursue this, the next concrete step should be:

1. inspect the Convex `generateQuestions` path
2. design the shape of a `sectorProfile`
3. inject that profile into the system prompt
4. add promptfoo fixtures for:
   - engineering
   - social services / child protection
   - education or healthcare

That gives us a realistic first version without overbuilding.
