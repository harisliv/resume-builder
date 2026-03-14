# AI Prompt Strategy

## Problem

LLM responses for resume suggestions are inconsistent across calls. The same resume + JD can produce structurally different outputs (fields present/absent, different levels of detail, varying tone).

## Root Causes

1. **Free-form JSON input** — resume is `JSON.stringify`'d, LLM interprets the structure differently each time
2. **No few-shot examples** — model has no reference for what "good" output looks like
3. **Nullable/optional output ambiguity** — LLM has 3 ways to say "no change" (null, undefined, omit)

## Solutions Implemented

### 1. Few-Shot Example in System Prompt

Added a concrete input/output example in `SYSTEM_SCHEMA_RULES` (`convex/systemPropts.ts`). This is the single highest-impact change for consistency — the model mimics the example's structure and style.

### 2. Labeled Input Formatter

Created `convex/formatResumePrompt.ts` — a utility that converts raw resume data into an explicit, labeled, indexed text format instead of raw JSON. Benefits:
- Explicit `[Experience #0]`, `[Experience #1]` labels for unambiguous index mapping
- Numbered highlights (`0. ...`, `1. ...`) so the model knows the exact highlight count
- `(none)` sentinel for empty fields instead of JSON null/undefined
- Skills as readable `Category: item1, item2` instead of nested objects

### 2.1 Resume Parse Edge Case

For raw PDF resume parsing, prompts need an explicit rule for nested experience blocks under one employer. If one company heading contains multiple dated projects/roles, the model should split them into separate `experience` items, use the nearest date range for each item, and fall back to `personalInfo.location` when an item has no explicit location.

The parser also needs to target the form's storage formats, not just human-readable text:
- Experience dates should be `MMM yyyy`
- Year-only experience dates should fall back to `Jan YYYY`
- Current roles should use `current: true` with `endDate: ""`
- Named platforms/programs/projects inside experience entries should map to `projectName`
- Education `graduationDate` should prefer year-only
- Phone numbers should be E.164 or blank

### 3. (Future) Tool-Call Pattern

ResumeLM (open-source competitor) uses per-section tool calls instead of a single JSON output. This enforces required fields per tool and eliminates nullable ambiguity. Bigger refactor — not implemented yet.

## Research Findings

### No "Before/After" Resume Dataset Exists

Searched Kaggle, HuggingFace, GitHub. No public dataset provides paired "original → optimized" resume examples. What exists:
- Classification datasets (resumes labeled by job category)
- Parsing datasets (resumes → structured JSON)
- Screening datasets (resumes scored against JDs)
- Synthetic datasets (HuggingFace `datasetmaster/resumes`)

### How Other Resume Builders Handle This

Projects like ResumeLM, resume-optimizer all rely on prompt engineering alone — no RAG, no external example databases. ResumeLM uses a chat + tool-calling pattern with 6 Zod-schema tools targeting specific sections.

### RAG is Overkill for This Problem

Per TDS article on "Prompt Engineering vs RAG for Editing Resumes": prompt engineering with one-shot examples outperforms RAG for resume rewriting because the task is about format consistency, not knowledge retrieval.

## References

- [ResumeLM (GitHub)](https://github.com/olyaiy/resume-lm) — chat + tool-call approach
- [Prompt Engineering vs RAG for Resumes (TDS)](https://towardsdatascience.com/prompting-engineering-vs-rag-for-editing-resumes/)
- [datasetmaster/resumes (HuggingFace)](https://huggingface.co/datasets/datasetmaster/resumes)
- [54k Resume Dataset (Kaggle)](https://www.kaggle.com/datasets/suriyaganesh/resume-dataset-structured)
