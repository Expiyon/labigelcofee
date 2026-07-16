import { AxiosError } from 'axios';

/** Extracts a user-facing message from an API error, falling back to a default. */
export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || fallback;
  }
  if (error instanceof Error) {
    return error.message || fallback;
  }
  return fallback;
}

/** Formats a price in Turkish Lira, e.g. 125.5 -> "125,50 ₺". */
export function formatPrice(price: number): string {
  return `${price.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺`;
}
