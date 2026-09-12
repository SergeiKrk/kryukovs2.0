export function resolveMotionEnabled(savedPreference, prefersReducedMotion) {
  if (prefersReducedMotion) return false;
  return savedPreference !== "off";
}

export function getHorizontalTravel(scrollWidth, clientWidth) {
  return Math.max(0, scrollWidth - clientWidth);
}

export function getVideoTime(duration, progress) {
  const safeEnd = Math.max(0, duration - 0.04);
  const boundedProgress = Math.min(1, Math.max(0, progress));
  return safeEnd * boundedProgress;
}

export function readMotionEvent(detail, fallback) {
  if (detail && typeof detail === "object" && typeof detail.enabled === "boolean") {
    return detail.enabled;
  }
  return fallback;
}
