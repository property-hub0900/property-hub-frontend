import { useAuthStore } from "@/store/auth-store"
import { type Permission, ROLE_PERMISSIONS, type UserRole } from "@/types/rbac"

/**
 * Hook for role-based access control
 * Provides functions to check user roles and permissions
 */
export const useRBAC = () => {
    const { user, isAuthenticated } = useAuthStore()
    debugger;

    // Convert scope array to UserRole array
    const roles: UserRole[] =
        user?.scope?.filter((role): role is UserRole => ["customer", "owner", "admin", "agent"].includes(role)) || []

    // Check if user has a specific role
    const hasRole = (role: UserRole): boolean => {
        return roles.includes(role)
    }

    // Check if user has any of the specified roles
    const hasAnyRole = (requiredRoles: UserRole[]): boolean => {
        return requiredRoles.some((role) => hasRole(role))
    }

    // Check if user has all of the specified roles
    const hasAllRoles = (requiredRoles: UserRole[]): boolean => {
        return requiredRoles.every((role) => hasRole(role))
    }

    // Get all permissions for the user based on their roles
    const getAllPermissions = (): Permission[] => {
        const permissions = new Set<Permission>()

        roles.forEach((role) => {
            ROLE_PERMISSIONS[role].forEach((permission) => {
                permissions.add(permission)
            })
        })

        return Array.from(permissions)
    }

    // Check if user has a specific permission
    const hasPermission = (permission: Permission): boolean => {
        if (!isAuthenticated) return false
        return getAllPermissions().includes(permission)
    }

    return {
        roles,
        isAuthenticated,
        hasRole,
        hasAnyRole,
        hasAllRoles,
        hasPermission,
    }
}

