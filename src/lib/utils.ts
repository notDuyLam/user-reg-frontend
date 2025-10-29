import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Parse backend error (Axios) into user-friendly messages and field-level errors
 */
export function parseApiError(error: unknown): {
  userMessage: string;
  fieldErrors: Partial<Record<'email' | 'password', string>>;
} {
  const defaultMessage = 'Something went wrong. Please try again.';
  const result = { userMessage: defaultMessage, fieldErrors: {} as Partial<Record<'email' | 'password', string>> };

  // Attempt to inspect Axios-like error shape
  const maybeAxios: any = error as any;
  const status: number | undefined = maybeAxios?.response?.status;
  const payload = maybeAxios?.response?.data;
  const message = payload?.message;

  if (status === 401) {
    result.userMessage = 'Invalid credentials. Please try again.';
    return result;
  }

  if (Array.isArray(message)) {
    const messages: string[] = message.filter((m) => typeof m === 'string');
    for (const m of messages) {
      const lower = m.toLowerCase();
      if (lower.includes('email')) {
        result.fieldErrors.email = m;
      } else if (lower.includes('password')) {
        result.fieldErrors.password = m;
      }
    }
    result.userMessage = messages.join('\n') || defaultMessage;
    return result;
  }

  if (typeof message === 'string' && message.trim().length > 0) {
    result.userMessage = message;
    return result;
  }

  return result;
}

