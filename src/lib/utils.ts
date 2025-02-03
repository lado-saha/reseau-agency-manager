import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
// src/utils/password.ts

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Number of items per page
 */
export const PAGE_OFFSET = 10;

export function concatUrl(path: string): string {

  const url = `${process.env.NEXT_PUBLIC_API_URL}${path}`;
  console.log(url)
  return url
}
