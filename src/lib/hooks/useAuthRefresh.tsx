import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/auth-store";

// Time between refreshes (5 minutes)
const REFRESH_INTERVAL = (1 * 60 * 1000) / 2;

/**
 * Hook to periodically refresh user data
 */
export function useAuthRefresh() {
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Function to refresh user data
    const refreshUserData = async () => {
      const store = useAuthStore.getState();

      // Only refresh if authenticated
      if (!store.isAuthenticated || !store.user) return;

      //console.log('Refreshing user data...');
      await store.syncUserData();
      //console.log('User data refreshed successfully');
    };

    // Initial refresh
    refreshUserData();

    // Set up interval for periodic refresh
    refreshTimerRef.current = setInterval(refreshUserData, REFRESH_INTERVAL);

    // Cleanup on unmount
    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
    };
  }, []);
}
