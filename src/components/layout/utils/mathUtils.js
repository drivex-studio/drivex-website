export function clamp(val) {
  return Math.max(0, Math.min(1, val));
}

export function sineEase(val) {
  return Math.sin((val * Math.PI) / 2);
}
