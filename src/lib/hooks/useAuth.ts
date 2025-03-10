"use client";

import { useAuthStore } from "@/store/auth-store";
import type { userAuthCustomerLoginResponse } from "@/types/auth";
import { useEffect, useState } from "react";

export const useAuth = () => {
  // Get state and actions from the Zustand store
  const {
    user: storeUser,
    isAuthenticated: storeIsAuthenticated,
    logout,
  } = useAuthStore();

  // Local state for type safety and backward compatibility
  const [user, setUser] = useState<userAuthCustomerLoginResponse | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Sync local state with store state
  useEffect(() => {
    console.log("Store state changed:", { storeUser, storeIsAuthenticated });

    // Update local state from Zustand store
    setIsAuthenticated(storeIsAuthenticated);

    // Cast the user to the expected type if needed
    if (storeUser) {
      setUser(storeUser as unknown as userAuthCustomerLoginResponse);
    } else {
      setUser(null);
    }

    setIsInitialized(true);
  }, [storeUser, storeIsAuthenticated]);

  // Initial load from localStorage for backward compatibility
  useEffect(() => {
    // Only run this once on component mount
    if (isInitialized) return;

    console.log("Initializing auth from localStorage");

    // Check if we already have state from the store
    if (storeIsAuthenticated && storeUser) {
      console.log("Already initialized from store");
      return; // Already initialized from the store
    }

    // Try to get from auth-storage first (new format)
    const authData = localStorage.getItem("auth-storage");
    console.log(
      "Auth data from localStorage:",
      authData ? "Found" : "Not found"
    );

    if (authData) {
      try {
        const parsedData = JSON.parse(authData);
        console.log("Parsed auth data:", parsedData);

        // Check if the data is in the expected format with state property
        if (parsedData.state) {
          // Directly update the Zustand store instead of local state
          if (parsedData.state.user && parsedData.state.isAuthenticated) {
            console.log("Logging in user from localStorage");
            useAuthStore.getState().login(parsedData.state.user);
          }
        }
      } catch (error) {
        console.error("Error parsing auth data:", error);
      }
    } else {
      // Try all possible legacy storage keys
      const legacyKeys = ["user-storage", "user"];

      for (const key of legacyKeys) {
        const legacyUser = localStorage.getItem(key);
        if (legacyUser) {
          try {
            const parsedUser = JSON.parse(legacyUser);
            console.log(`Found user in ${key}:`, parsedUser);

            // Migrate to new format
            useAuthStore.getState().login(parsedUser);

            // Break the loop once we find valid data
            break;
          } catch (error) {
            console.error(`Error parsing legacy user data from ${key}:`, error);
          }
        }
      }
    }
  }, [storeIsAuthenticated, storeUser, isInitialized]);

  // Custom logout function that maintains the same behavior
  const logOut = () => {
    console.log("Logging out");

    // Call the store's logout function
    logout();

    // Also clear local state
    setUser(null);
    setIsAuthenticated(false);

    // For backward compatibility, also clear all legacy storage
    localStorage.removeItem("user-storage");
    localStorage.removeItem("user");

    // Redirect to home page
    window.location.assign(`/`);
  };

  // For debugging
  useEffect(() => {
    console.log("useAuth hook state:", { user, isAuthenticated });
  }, [user, isAuthenticated]);

  return { user, isAuthenticated, logOut };
};
