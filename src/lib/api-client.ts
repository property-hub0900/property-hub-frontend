/* eslint-disable no-unused-vars */
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/auth-store";
import moment from "moment";

// Create an axios instance with default config
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // 15 seconds timeout
});

// List of auth-related API endpoints that should not trigger redirect on auth errors
const authApiEndpoints = [
  "/userAuth/customer/login",
  "/userAuth/customer/register",
  "/userAuth/verify-otp",
  "/userAuth/resend-otp",
  "/userAuth/forgot-password",
  "/userAuth/reset-password",
  // Add any other auth-related endpoints here
];

// List of auth-related page routes that should not trigger redirect on auth errors
const authPageRoutes = [
  "/login",
  "/register",
  "/verify-otp",
  "/resend-otp",
  "/forgot-password",
  "/reset-password",
  "/customer/login",
  "/customer/register",
  "/company/login",
  "/company/register",
  // Add any other auth-related page routes here
];

// Helper function to check if we're on the client side
const isClient = () => typeof window !== "undefined";

// Helper function to get the auth token
const getAuthToken = (): string | null => {
  if (!isClient()) return null;

  // Try to get token from Zustand store first
  let token: string | null = null;

  // Get from auth store if available
  if (useAuthStore?.getState) {
    token = useAuthStore.getState().getToken();
  }

  // Fallback to localStorage/sessionStorage if needed
  if (!token) {
    token =
      localStorage.getItem("token") || sessionStorage.getItem("token") || null;
  }

  return token;
};

// Helper function to clear auth tokens and logout
const clearAuthAndLogout = () => {
  if (!isClient()) return;

  // Clear tokens
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
  localStorage.removeItem("auth-storage");
  localStorage.removeItem("user-storage");
  localStorage.removeItem("user");

  // Clear cookies
  if (typeof document !== "undefined") {
    document.cookie = "auth-check=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "auth-storage=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }

  // Also clear auth store if available
  if (useAuthStore?.getState) {
    useAuthStore.getState().logout();
  }
};

// Helper function to check if the current request/page is auth-related
const isAuthRelated = (url: string): boolean => {
  return authApiEndpoints.some(
    (endpoint) => url.includes(endpoint) || url.includes("/auth/")
  );
};

// Helper function to check if the current page is an auth page
const isAuthPage = (): boolean => {
  if (!isClient()) return false;

  const currentPath = window.location.pathname;

  return authPageRoutes.some(
    (route) =>
      currentPath.includes(route) ||
      // Check for locale prefixed routes (e.g., /en/login, /ar/login)
      (/^\/[a-z]{2}\/(.+)$/.test(currentPath) &&
        authPageRoutes.some((r) => currentPath.substring(3).includes(r)))
  );
};

// Helper function to redirect to home or login page
const redirectToHome = () => {
  if (!isClient()) return;

  // Get the current locale from the URL if available
  const currentPath = window.location.pathname;
  const localeMatch = currentPath.match(/^\/([a-z]{2})\//);
  const locale = localeMatch ? localeMatch[1] : "";

  // Redirect to home page with locale if available
  window.location.href = locale ? `/${locale}` : "/";
};

// Helper function to get the device IP address
const getAnonymousId = () => {
  if (typeof window === "undefined") return null; // Server-side, return null

  let anonymousId = localStorage.getItem("ip-address");
  if (!anonymousId) {
    const randomBytes = new Uint8Array(8);
    crypto.getRandomValues(randomBytes);
    // Convert Uint8Array to 16-digit hexadecimal string
    anonymousId = Array.from(randomBytes, byte => byte.toString(16).padStart(2, '0')).join('');
    localStorage.setItem("ip-address", anonymousId);
  }
  return anonymousId;
};

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    // For client-side requests only
    if (isClient()) {
      const token = getAuthToken();
      const anonymousId = getAnonymousId();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      if (anonymousId) {
        config.headers["ip-address"] = anonymousId;
        config.headers['x-user-timezone'] = Intl.DateTimeFormat().resolvedOptions().timeZone;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError | any) => {
    // Only proceed with redirect logic if we're in the browser
    if (isClient()) {
      // Get the request URL path
      const requestUrl = error.config?.url || "";
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message || "An error occurred";
      if (message === "Invalid credentials") {
        return Promise.reject({
          data: null,
          message: "Invalid credentials",
          success: false,
          status: 401,
        });
      }

      // Handle authentication errors (401 Unauthorized, 403 Forbidden)
      if (status === 401) {
        if (process.env.NODE_ENV === "development") {
          console.log("401 or 403 error");

        }

        // Check if the current request is for an auth endpoint
        const isAuthApiEndpoint = isAuthRelated(requestUrl);

        // Check if the current page is an auth page
        const onAuthPage = isAuthPage();

        // For 401 (Unauthorized), clear tokens and redirect to login
        if (status === 401 && !isAuthApiEndpoint && !onAuthPage) {
          if (process.env.NODE_ENV === "development") {
          }

          // Clear tokens before redirecting
          clearAuthAndLogout();

          // Redirect to home/login
          redirectToHome();
        }

        // For 403 (Forbidden), we don't redirect but we log it
        // This allows the component to handle the error appropriately
        if (status === 401) {
          console.log(
            "Forbidden access detected. User doesn't have permission."
          );
          // Clear auth data and wait to ensure it completes before redirecting
          clearAuthAndLogout();
          // Add a small delay before redirecting to ensure auth state is cleared
          setTimeout(() => {
            window.location.href = "/";
          }, 100);
          return Promise.reject({
            data: null,
            message: "Forbidden access. User doesn't have permission.",
            success: false,
            status: 403,
          });
        }
      } else if (error.code === "ECONNABORTED") {
        // Handle timeout errors
      } else if (!error.response) {
        // Handle network errors (no response from server)
      } else {
        // Handle other errors
      }
    }

    // Instead of rejecting the promise, return a standardized error response
    // This prevents the red screen by not throwing an exception
    // For API errors (400, 500, etc.), we should still reject the promise
    // so that catch blocks can handle them properly
    if (error.response) {
      // If the error has a response, format it in a standardized way before rejecting
      return Promise.reject({
        data: error.response.data?.data || null,
        message:
          error.response.data?.message || error.message || "An error occurred",
        success: false,
        status: error.response.status,
        originalError: error,
      });
    } else {
      // For network errors, timeouts, etc.
      return Promise.reject({
        data: null,
        message: error.message || "Network error occurred",
        success: false,
        originalError: error,
      });
    }
  }
);

// Add a method to check if a token exists (useful for protected routes)
export const hasAuthToken = (): boolean => {
  return getAuthToken() !== null;
};

// Add a method to make authenticated requests with automatic error handling
export const makeAuthRequest = async <T>(
  config: AxiosRequestConfig,
  errorHandler?: (error: AxiosError) => void
): Promise<T | null> => {
  try {
    return (await apiClient(config)) as T;
  } catch (error) {
    if (errorHandler && error instanceof AxiosError) {
      errorHandler(error);
    }
    return null;
  }
};

export default apiClient;
