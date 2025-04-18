import { useAuthStore } from "@/store/auth-store"
import { type Permission, ROLE_PERMISSIONS, USER_ROLES, PERMISSIONS, ROUTE_PERMISSIONS, type UserRole } from "@/constants/rbac"
import { useMemo } from "react"

/**
 * Hook for role-based access control
 * Provides functions to check user roles and permissions
 */
export const useRBAC = () => {
    const { user, isAuthenticated } = useAuthStore()

    // Memoize roles to avoid recalculating on every render
    const roles: UserRole[] = useMemo(() => {
        return user?.scope?.filter((role): role is UserRole =>
            ["customer", "owner", "admin", "agent", "manager"].includes(role)) || []
    }, [user?.scope]);

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

    // Memoize the permission list to avoid recalculation
    const permissions = useMemo(() => {
        const permissionsSet = new Set<Permission>()

        // Add static permissions from constants
        roles.forEach((role) => {
            // Don't add owner permissions if isOwner is explicitly false
            if (role === USER_ROLES.OWNER && user?.isOwner === false) {
                return;
            }

            if (role in ROLE_PERMISSIONS) {
                ROLE_PERMISSIONS[role].forEach((permission) => {
                    permissionsSet.add(permission)
                })
            }
        })

        // Add dynamic permissions based on staffPermissions from API
        if (user?.staffPermissions && user.staffPermissions.length > 0) {
            const staffPermission = user.staffPermissions[0];

            // Map API permissions to our Permission type
            if (staffPermission.canAddProperty) {
                permissionsSet.add(PERMISSIONS.CREATE_PROPERTY);
            }

            if (staffPermission.canPublishProperty) {
                permissionsSet.add(PERMISSIONS.PUBLISH_PROPERTY);
            }

            if (staffPermission.canFeatureProperty) {
                // Add a corresponding permission if it exists
                permissionsSet.add(PERMISSIONS.FEATURE_PROPERTY);
            }
        }

        return Array.from(permissionsSet);
    }, [roles, user?.isOwner, user?.staffPermissions]);

    // Check if user has a specific permission
    const hasPermission = (permission: Permission): boolean => {
        if (!isAuthenticated) return false

        return permissions.includes(permission)
    }

    // Check if user has permission for a specific route
    const hasRoutePermission = (routePath: string): boolean => {
        // Normalize the route path (remove locale prefix)
        const normalizedPath = routePath.replace(/^\/[a-z]{2}\//, "/")

        // Get required permissions for the route
        const requiredPermissions = ROUTE_PERMISSIONS[normalizedPath]

        // If no permissions required, allow access
        if (!requiredPermissions || requiredPermissions.length === 0) return true

        // Check if user has any of the required permissions
        return requiredPermissions.some(permission => hasPermission(permission))
    }

    return {
        roles,
        permissions, // Expose permissions for debugging if needed
        isAuthenticated,
        hasRole,
        hasAnyRole,
        hasAllRoles,
        hasPermission,
        hasRoutePermission,
    }
}

