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
