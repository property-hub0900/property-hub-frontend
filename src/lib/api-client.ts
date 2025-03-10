import axios from "axios";
import { useAuthStore } from "@/store/auth-store";

// Create an axios instance with default config
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// List of auth-related API endpoints that should not trigger redirect on 401
const authApiEndpoints = [
  "/userAuth/customer/login",
  "/userAuth/customer/register",
  "/userAuth/verify-otp",
  "/userAuth/resend-otp",
  "/userAuth/forgot-password",
  "/userAuth/reset-password",
  // Add any other auth-related endpoints here
];

// List of auth-related page routes that should not trigger redirect on 401
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

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    // For client-side requests only
    if (typeof window !== "undefined") {
      // Try to get token from Zustand store first
      let token: any = null;

      // Get from auth store if available
      if (useAuthStore?.getState) {
        token = useAuthStore.getState().getToken();
      }

      // Fallback to localStorage/sessionStorage if needed
      if (!token) {
        token =
          localStorage.getItem("token") || sessionStorage.getItem("token");
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Only proceed with redirect logic if we're in the browser
    if (typeof window !== "undefined" && error.response?.status === 401) {
      // Get the request URL path
      const requestUrl = error.config?.url || "";

      // Check if the current request is for an auth endpoint
      const isAuthApiEndpoint = authApiEndpoints.some(
        (endpoint) =>
          requestUrl.includes(endpoint) || requestUrl.includes("/auth/")
      );

      // Check if the current page is an auth page
      const currentPath = window.location.pathname;
      const isAuthPage = authPageRoutes.some(
        (route) =>
          currentPath.includes(route) ||
          // Check for locale prefixed routes (e.g., /en/login, /ar/login)
          (/^\/[a-z]{2}\/(.+)$/.test(currentPath) &&
            authPageRoutes.some((r) => currentPath.substring(3).includes(r)))
      );

      // Only redirect if not on an auth page and not calling an auth endpoint
      if (!isAuthApiEndpoint && !isAuthPage) {
        console.log("Unauthorized access detected. Redirecting to home page.");

        // Clear tokens before redirecting
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");

        // Also clear auth store if available
        if (useAuthStore?.getState) {
          useAuthStore.getState().logout();
        }

        // Get the current locale from the URL if available
        const localeMatch = currentPath.match(/^\/([a-z]{2})\//);
        const locale = localeMatch ? localeMatch[1] : "";

        // Redirect to home page with locale if available
        window.location.href = locale ? `/${locale}` : "/";
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
