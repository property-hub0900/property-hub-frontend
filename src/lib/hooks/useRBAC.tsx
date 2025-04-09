import { useAuthStore } from "@/store/auth-store"
import { type Permission, ROLE_PERMISSIONS, USER_ROLES, PERMISSIONS, ROUTE_PERMISSIONS, type UserRole } from "@/constants/rbac"

/**
 * Hook for role-based access control
 * Provides functions to check user roles and permissions
 */
export const useRBAC = () => {
    const { user, isAuthenticated } = useAuthStore()

    // Get basic roles
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

    // Get all permissions for the user based on their roles and API data
    const getAllPermissions = (): Permission[] => {
        const permissions = new Set<Permission>()

        // Add static permissions from constants
        roles.forEach((role) => {
            // Don't add owner permissions if isOwner is explicitly false
            if (role === USER_ROLES.OWNER && user?.isOwner === false) {
                return;
            }

            if (role in ROLE_PERMISSIONS) {
                ROLE_PERMISSIONS[role].forEach((permission) => {
                    permissions.add(permission)
                })
            }
        })

        // Add dynamic permissions based on staffPermissions from API
        if (user?.staffPermissions && user.staffPermissions.length > 0) {
            const staffPermission = user.staffPermissions[0];

            // Map API permissions to our Permission type
            if (staffPermission.canAddProperty) {
                permissions.add(PERMISSIONS.CREATE_PROPERTY);
            }

            if (staffPermission.canPublishProperty) {

                permissions.add(PERMISSIONS.PUBLISH_PROPERTY);
            }
            if (staffPermission.canFeatureProperty) {
                // Add a corresponding permission if it exists
                permissions.add("feature:property" as Permission);
            }
        }

        return Array.from(permissions)
    }

    // Check if user has a specific permission
    const hasPermission = (permission: Permission): boolean => {
        if (!isAuthenticated) return false
        return getAllPermissions().includes(permission)
    }

    // Check if user has permission for a specific route
    const hasRoutePermission = (routePath: string): boolean => {

        // if (!isAuthenticated) return false

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
        isAuthenticated,
        hasRole,
        hasAnyRole,
        hasAllRoles,
        hasPermission,
        hasRoutePermission,
    }
}

