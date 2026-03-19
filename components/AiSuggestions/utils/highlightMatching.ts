/**
 * Scores rough word overlap similarity between two highlight strings.
 * Returns 0..1, where 1 means identical word set.
 */
export function getWordOverlapScore(a: string, b: string): number {
  const tokenize = (value: string) =>
    value
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(Boolean);

  const wordsA = tokenize(a);
  const wordsB = tokenize(b);
  if (!wordsA.length && !wordsB.length) return 1;
  if (!wordsA.length || !wordsB.length) return 0;

  const setA = new Set(wordsA);
  const setB = new Set(wordsB);
  let intersection = 0;
  setA.forEach((word) => {
    if (setB.has(word)) intersection += 1;
  });

  const denominator = Math.max(setA.size, setB.size);
  return denominator === 0 ? 0 : intersection / denominator;
}

/**
 * Builds one-to-one match maps between current and suggested highlights.
 * Prevents one current bullet from being diffed against many suggested bullets.
 */
export function buildHighlightMatchMaps(current: string[], suggested: string[]) {
  const suggestedToCurrent = new Array<number>(suggested.length).fill(-1);
  const currentToSuggested = new Array<number>(current.length).fill(-1);
  const usedCurrent = new Set<number>();

  suggested.forEach((suggestedHighlight, suggestedIdx) => {
    let bestCurrentIdx = -1;
    let bestScore = 0;

    current.forEach((currentHighlight, currentIdx) => {
      if (usedCurrent.has(currentIdx)) return;
      const score = getWordOverlapScore(currentHighlight, suggestedHighlight);
      if (score > bestScore) {
        bestScore = score;
        bestCurrentIdx = currentIdx;
      }
    });

    if (bestCurrentIdx >= 0 && bestScore > 0) {
      suggestedToCurrent[suggestedIdx] = bestCurrentIdx;
      currentToSuggested[bestCurrentIdx] = suggestedIdx;
      usedCurrent.add(bestCurrentIdx);
    }
  });

  return { suggestedToCurrent, currentToSuggested };
}
