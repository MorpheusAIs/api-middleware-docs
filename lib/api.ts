import { getCookie } from 'cookies-next';
import { getSession } from 'next-auth/react';
import type { Session } from 'next-auth'; // Import Session type from next-auth

// Re-define or import the extended session type if not already available globally
// This should match the structure defined in your [...nextauth] options
interface SessionUser {
  id?: string;
  email?: string;
  name?: string | null;
  image?: string | null;
  accessToken?: string; // Make sure this matches your JWT callback
}

interface ExtendedSession extends Session {
  user?: SessionUser;
  accessToken?: string; // Also potentially add token directly to session object if done in callback
}

// Utility to get CSRF token from cookie
export function getCsrfToken(): string | null {
  return getCookie('csrf_token') as string | null;
}

// Define a generic error structure that might come from the backend
interface ApiError {
  message?: string; // Common property
  detail?: string | { msg: string; loc: (string | number)[] }[]; // FastAPI detail structure
  error?: any; // Other possible error shapes
}

// Helper to extract error message from various backend formats
async function extractErrorMessage(response: Response): Promise<string> {
  try {
    const errorData: ApiError = await response.json();
    console.log("API Error Response Body:", errorData);

    // FastAPI validation errors (HTTPValidationError)
    if (Array.isArray(errorData.detail)) {
      // Join multiple validation errors
      return errorData.detail
        .map((d) => `${d.loc.join(' -> ')}: ${d.msg}`)
        .join('; ');
    }
    // Other FastAPI or custom errors with a detail string
    if (typeof errorData.detail === 'string') {
      return errorData.detail;
    }
    // Errors with a message property
    if (errorData.message) {
      return errorData.message;
    }
    // Other errors with an error property
     if (errorData.error) {
      return JSON.stringify(errorData.error);
    }
    // Fallback if parsing succeeds but no known message format is found
    return `Request failed with status ${response.status}: ${response.statusText}`;

  } catch (e) {
    // If parsing the error body fails, return the status text
    console.error("Failed to parse error response body", e);
    return `Request failed with status ${response.status}: ${response.statusText}`;
  }
}

// Custom fetch wrapper that handles CSRF tokens and token refresh
export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    credentials: 'same-origin', // Include cookies for same-origin requests
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  // const url = `/api${path}`; // Remove automatic prepending
  const url = path; // Use the path directly as it should already include /api
  console.log(`Making API request to: ${url} with options:`, mergedOptions);

  const response = await fetch(url, mergedOptions);

  console.log(`API response status from ${url}: ${response.status}`);

  if (!response.ok) {
    const errorMessage = await extractErrorMessage(response);
    console.error(`API Request Failed (${url}): ${errorMessage}`);
    // Throw an error object that includes the status code for more context
    const error = new Error(errorMessage) as Error & { status?: number };
    error.status = response.status;
    throw error;
  }

  return response;
}

// Wrapper for fetches that require authentication
export async function authenticatedFetch(path: string, options: RequestInit = {}): Promise<Response> {
  // Cast the session to your extended type
  const session = await getSession() as ExtendedSession | null;
  
  // Access token might be directly on session or nested under user
  const token = session?.accessToken ?? session?.user?.accessToken;

  if (!token) {
    // This shouldn't ideally happen if pages guard correctly, but good failsafe
    console.error("Authenticated fetch called without token.");
    throw new Error('Authentication required. Please log in again.');
  }

  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  const mergedOptions = {
    ...options,
    headers: {
      ...options.headers,
      ...authHeaders,
    },
  };

  // Use apiFetch to benefit from its base URL and error handling
  return apiFetch(path, mergedOptions);
}

// Wrapper for authenticated fetches that expect JSON response
export async function authenticatedJsonFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await authenticatedFetch(path, options);
  // Check content-type before parsing
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
      return response.json() as Promise<T>;
  }
  // Handle cases where response is OK but not JSON (e.g., 204 No Content)
  if (response.ok && response.status === 204) {
      return Promise.resolve({} as T); // Or null, depending on expected T
  }
  // Throw if response is OK but not JSON and not handled above
  throw new Error(`Expected JSON response but received content type: ${contentType}`);
} 