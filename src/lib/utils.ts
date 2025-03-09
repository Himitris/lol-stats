import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const regions = [
  { id: 'euw1', name: 'Europe West' },
  { id: 'eun1', name: 'Europe Nordic & East' },
  { id: 'na1', name: 'North America' },
  { id: 'kr', name: 'Korea' },
  { id: 'br1', name: 'Brazil' },
] as const;