import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
// src/utils/password.ts

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface SearchItemProps<T> {
  item: T;
  isSelected: boolean;
  onCheckedChange: (checked: boolean) => void;
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

export function concatPublic(path: string): string {
  const url = `${path}`;
  console.log(url)
  return url
}

export const API_URL =`${process.env.NEXT_PUBLIC_API_URL}`

export async function getBlobURL(filePath: string) {
  // Fetch the file from the server (public folder) and create a Blob URL
  return fetch(filePath)
    .then((response) => response.blob()) // Get the file as a blob
    .then((blob) => {
      return URL.createObjectURL(blob);
      // Now you can use the blob URL to open or preview the PDF
    })
    .catch((err) => {
      console.error('Error loading the file:', err);
      return null;
    });
}
export const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

// Compares 2 arrays are exact in valu
export const areArraysEqual = (arr1: any[], arr2: any[]) =>
  arr1.length === arr2.length && !arr1.some((val, index) => val !== arr2[index]);
