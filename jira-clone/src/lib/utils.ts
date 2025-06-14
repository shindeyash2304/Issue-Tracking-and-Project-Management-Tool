import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageUrl(imageKey: string | null) {
  if (imageKey === null) return null;
  return `${process.env.NEXT_PUBLIC_API_URL}/image/${imageKey}`
}

export function snakeCaseToTitleCase(str: string) {
  return str.toLocaleLowerCase().replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
