const UNITS = 'abcdefghijklmnopqrstuvwxyz';

export function fmt(n: number): string {
  if (n < 1000) return Math.floor(n) + 'a';
  let idx = 0;
  let val = n;
  while (val >= 1000 && idx < UNITS.length - 1) {
    val /= 1000;
    idx++;
  }
  const dec = val >= 100 ? 0 : val >= 10 ? 1 : 2;
  return parseFloat(val.toFixed(dec)) + UNITS[idx];
}
