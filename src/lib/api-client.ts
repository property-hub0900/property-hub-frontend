import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/auth-store";

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

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    // For client-side requests only
    if (isClient()) {
      const token = getAuthToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    console.log("Request error:", error);
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

      // Handle authentication errors (401 Unauthorized, 403 Forbidden)
      if (status === 401 || status === 403) {
        if (process.env.NODE_ENV === "development") {
          console.log(`Authentication error (${status}):`, error.message);
        }

        // Check if the current request is for an auth endpoint
        const isAuthApiEndpoint = isAuthRelated(requestUrl);

        // Check if the current page is an auth page
        const onAuthPage = isAuthPage();

        // For 401 (Unauthorized), clear tokens and redirect to login
        if (status === 401 && !isAuthApiEndpoint && !onAuthPage) {
          if (process.env.NODE_ENV === "development") {
            console.log(`Authentication error (${status}):`, error.message);
          }

          // Clear tokens before redirecting
          clearAuthAndLogout();

          // Redirect to home/login
          redirectToHome();
        }

        // For 403 (Forbidden), we don't redirect but we log it
        // This allows the component to handle the error appropriately
        if (status === 403) {
          console.log(
            "Forbidden access detected. User doesn't have permission."
          );
        }
      } else if (error.code === "ECONNABORTED") {
        // Handle timeout errors
        console.log("Request timeout:", error.message);
      } else if (!error.response) {
        // Handle network errors (no response from server)
        console.log("Network error:", error.message);
      } else {
        // Handle other errors
        console.log(`API error (${status}):`, error.message);
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
