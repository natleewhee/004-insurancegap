import { useEffect, useCallback } from "react";

const STORAGE_KEY = "iga_inputs_v1";
const PREV_SCORE_KEY = "iga_prev_score_v1";

/**
 * usePersistInputs
 * Saves user inputs to localStorage so the re-check flow can pre-fill the form.
 * Also tracks the previous score to show a delta on results page.
 */
export function usePersistInputs() {
  const save = useCallback((inputs) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs));
    } catch {
      // localStorage unavailable (private browsing, storage quota) — fail silently
    }
  }, []);

  const load = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const clear = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(PREV_SCORE_KEY);
    } catch {}
  }, []);

  const savePrevScore = useCallback((score) => {
    try {
      localStorage.setItem(PREV_SCORE_KEY, String(score));
    } catch {}
  }, []);

  const loadPrevScore = useCallback(() => {
    try {
      const raw = localStorage.getItem(PREV_SCORE_KEY);
      return raw !== null ? parseInt(raw, 10) : null;
    } catch {
      return null;
    }
  }, []);

  return { save, load, clear, savePrevScore, loadPrevScore };
}

/**
 * useScoreDelta
 * Returns the delta between current score and the previously saved score.
 * Used on results page to show "+8 pts since last check".
 *
 * @param {number} currentScore
 * @returns {{ delta: number|null, label: string|null }}
 */
export function useScoreDelta(currentScore) {
  const { loadPrevScore } = usePersistInputs();
  const prev = loadPrevScore();

  if (prev === null || prev === currentScore) {
    return { delta: null, label: null };
  }

  const delta = currentScore - prev;
  const label = delta > 0
    ? `+${delta} pts since last check`
    : `${delta} pts since last check`;

  return { delta, label };
}
