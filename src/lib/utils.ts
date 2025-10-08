import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractGoogleResourceId(url: string | null): string {
  if (!url) return ''
  const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/)
  return match ? match[1] : ''
}

