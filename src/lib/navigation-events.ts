// Simple event system for navigation events
type Listener = () => void

class NavigationEvents {
    private listeners: Map<string, Set<Listener>> = new Map()

    // Subscribe to an event
    subscribe(event: string, callback: Listener): () => void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set())
        }

        this.listeners.get(event)!.add(callback)

        // Return unsubscribe function
        return () => {
            const eventListeners = this.listeners.get(event)
            if (eventListeners) {
                eventListeners.delete(callback)
            }
        }
    }

    // Emit an event
    emit(event: string): void {
        const eventListeners = this.listeners.get(event)
        if (eventListeners) {
            eventListeners.forEach((listener) => listener())
        }
    }
}

// Create a singleton instance
export const navigationEvents = new NavigationEvents()

// Specific events
export const NAVIGATION_EVENTS = {
    RESET_ACCESS_MANAGEMENT: "reset_access_management",
    RESET_SUBSCRIPTION_PAGE: "reset_subscription_page",
    RESET_TOP_UP_PAGE: "reset_top_up_page",

}
