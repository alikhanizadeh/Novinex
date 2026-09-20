/**
 * Converts Western digits to Persian digits
 */
export function toPersianDigits(n: number | string): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return n
    .toString()
    .replace(/\d/g, (x) => persianDigits[parseInt(x, 10)]);
}

/**
 * Formats a price in Tomans with Persian comma separators
 * Example: 18500000 -> "۱۸,۵۰۰,۰۰۰"
 */
export function formatToman(amount: number): string {
  const formatted = amount.toLocaleString('en-US');
  return toPersianDigits(formatted);
}
