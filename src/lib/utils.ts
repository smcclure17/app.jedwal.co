import {  clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type {ClassValue} from 'clsx';

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs))
}

export function extractGoogleResourceId(url: string | null): string {
  if (!url) return ''
  const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/)
  return match ? match[1] : ''
}

