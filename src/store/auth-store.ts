"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

// Define the user data structure
interface UserData {
  userId: number;
  username: string;
  email: string;
  role: string;
  token: string;
  tokenExpiry?: number;
  scope?: string[];
  loginMethod: string;
  imageUrl?: string;
}

// Define the auth store state
interface AuthState {
  user: UserData | null;
  isAuthenticated: boolean;

  // Actions
  login: (userData: any) => void;
  logout: () => void;
  checkAuth: () => boolean;
  getToken: () => string | null;
}

// Custom storage for Zustand that uses both cookies and localStorage
const customStorage = {
  getItem: (name: string) => {
    if (typeof window === "undefined") {
      return null;
    }

    // Try to get from cookie first
    const cookieValue = Cookies.get(name);
    if (cookieValue) {
      return cookieValue;
    }

    // Fallback to localStorage
    return localStorage.getItem(name);
  },
  setItem: (name: string, value: string) => {
    if (typeof window === "undefined") {
      return;
    }

    // Set in both cookie and localStorage
    // Set cookie with path=/ and secure options
    Cookies.set(name, value, {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: 7, // 7 days expiry
    });

    // Also set in localStorage
    localStorage.setItem(name, value);
  },
  removeItem: (name: string) => {
    if (typeof window === "undefined") {
      return;
    }

    // Remove from both cookie and localStorage
    Cookies.remove(name, { path: "/" });
    localStorage.removeItem(name);
  },
};

// Create the auth store with persistence
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      // Login action - sets user data and decodes token
      login: (userData) => {
        try {
          console.log("Login called with:", userData);

          // If we have a token, decode it to get expiration
          if (userData.token) {
            const decoded: any = jwtDecode(userData.token);
            const user: UserData = {
              userId: userData.userId,
              username: userData.username,
              email: userData.email,
              role: userData.role,
              token: userData.token,
              tokenExpiry: decoded.exp,
              scope: userData.scope || [],
              loginMethod: decoded.loginWith,
              imageUrl: userData.imageUrl,
            };

            // Set the state
            set({
              user,
              isAuthenticated: true,
            });

            // Also set a separate cookie flag for middleware to check
            Cookies.set("auth-check", "true", {
              path: "/",
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              expires: 7, // 7 days expiry
            });
          } else {
            console.error("No token provided in userData");
          }
        } catch (error) {
          console.error("Failed to decode token:", error);
          set({ user: null, isAuthenticated: false });
          Cookies.remove("auth-check", { path: "/" });
        }
      },

      // Logout action
      logout: () => {
        console.log("Logout called");
        set({ user: null, isAuthenticated: false });
        Cookies.remove("auth-check", { path: "/" });
      },

      // Check if user is authenticated and token is valid
      checkAuth: () => {
        const { user } = get();
        console.log("Checking auth:", user);

        // If no user or token expiry, not authenticated
        if (!user || !user.tokenExpiry) {
          console.log("No user or token expiry");
          return false;
        }

        // Check if token is expired
        const now = Math.floor(Date.now() / 1000); // Current time in seconds
        if (now >= user.tokenExpiry) {
          // Token expired, logout
          console.log("Token expired");
          get().logout();
          return false;
        }

        console.log("Auth check passed");
        return true;
      },

      // Get the token if valid
      getToken: () => {
        const isAuth = get().checkAuth();
        return isAuth && get().user ? get()?.user?.token : (null as any);
      },
    }),
    {
      name: "auth-storage", // Name for the persisted storage
      storage: createJSONStorage(() => customStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }), // Only persist these fields
      onRehydrateStorage: () => {
        // This function runs when the store is rehydrated from storage
        return (rehydratedState, error) => {
          if (error) {
            console.error("Error rehydrating auth store:", error);
          } else if (rehydratedState) {
          }
        };
      },
    }
  )
);

// Helper function to initialize auth from localStorage for backward compatibility
export const initializeAuthFromLocalStorage = () => {
  if (typeof window === "undefined") return;

  console.log("Initializing auth from localStorage");

  // Check if we already have state from the store
  if (useAuthStore.getState().isAuthenticated) {
    console.log("Auth already initialized");
    return; // Already initialized
  }

  // Try to get from auth-storage first (new format)
  const authData = localStorage.getItem("auth-storage");

  if (authData) {
    try {
      const parsedData = JSON.parse(authData);
      console.log("Found auth data in localStorage:", parsedData);

      // Check if the data is in the expected format with state property
      if (parsedData.state && parsedData.state.user) {
        console.log("Logging in user from localStorage");
        useAuthStore.getState().login(parsedData.state.user);
        return;
      }
    } catch (error) {
      console.error("Error parsing auth data:", error);
    }
  }

  // Try all possible legacy storage keys
  const legacyKeys = ["user-storage", "user"];

  for (const key of legacyKeys) {
    const userData = localStorage.getItem(key);
    if (userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        console.log(`Found user data in ${key}:`, parsedUserData);
        useAuthStore.getState().login(parsedUserData);
        console.log(`Migrated auth data from legacy storage: ${key}`);
        break; // Stop after finding valid data
      } catch (error) {
        console.error(`Failed to parse user data from ${key}:`, error);
      }
    }
  }
};

// Initialize the store immediately
if (typeof window !== "undefined") {
  // Run on the client side only
  console.log("Running auth store initialization");

  // Wait for the DOM to be fully loaded
  if (document.readyState === "complete") {
    initializeAuthFromLocalStorage();
  } else {
    window.addEventListener("load", initializeAuthFromLocalStorage);
  }
}
