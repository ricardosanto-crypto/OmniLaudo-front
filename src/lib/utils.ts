import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
import { Page } from "../types/api";

// Interface temporária para lidar com o payload do Spring Data
interface SpringPageDTO<T> {
  content: T[];
  page?: { size: number; number: number; totalElements: number; totalPages: number };
  // Fallbacks caso o backend retorne o formato antigo do Spring
  number?: number;
  totalPages?: number;
  totalElements?: number;
  size?: number;
}

/**
 * Normaliza qualquer resposta paginada do Spring Boot para a interface Page<T> do Frontend
 */
export function mapSpringPage<T>(raw: SpringPageDTO<T> | undefined | null, defaultSize = 10): Page<T> {
  if (!raw) {
    return { content: [], number: 0, totalPages: 0, totalElements: 0, size: defaultSize };
  }
  
  return {
    content: raw.content || [],
    number: raw.page?.number ?? raw.number ?? 0,
    totalPages: raw.page?.totalPages ?? raw.totalPages ?? 0,
    totalElements: raw.page?.totalElements ?? raw.totalElements ?? 0,
    size: raw.page?.size ?? raw.size ?? defaultSize,
  };
}
