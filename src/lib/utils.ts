/**
 * Simple utility to conditionally join class names together
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes
    .filter(Boolean)
    .join(' ')
    .trim();
} 