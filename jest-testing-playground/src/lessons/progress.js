// Tiny localStorage-backed progress tracker for completed lessons.
const KEY = "jest-academy-progress";

export function getCompleted() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

export function isCompleted(slug) {
  return !!getCompleted()[slug];
}

export function markCompleted(slug) {
  const data = getCompleted();
  if (data[slug]) return;
  data[slug] = true;
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
    window.dispatchEvent(new Event("jest-academy-progress"));
  } catch {
    /* ignore */
  }
}

/* --------------------------- daily streak --------------------------- */

const STREAK_KEY = "jest-carnival-streak";
const DAY_MS = 24 * 60 * 60 * 1000;

export function getStreak() {
  try {
    return JSON.parse(localStorage.getItem(STREAK_KEY)) || { current: 0, best: 0, last: null };
  } catch {
    return { current: 0, best: 0, last: null };
  }
}

// Call once per session. Bumps the streak if visited on a consecutive day.
export function recordVisit() {
  const data = getStreak();
  const today = new Date().toDateString();
  if (data.last === today) return data;

  const yesterday = new Date(Date.now() - DAY_MS).toDateString();
  data.current = data.last === yesterday ? (data.current || 0) + 1 : 1;
  data.best = Math.max(data.best || 0, data.current);
  data.last = today;
  try {
    localStorage.setItem(STREAK_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
  return data;
}
