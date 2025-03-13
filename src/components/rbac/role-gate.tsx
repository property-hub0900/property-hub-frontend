"use client"

import type { ReactNode } from "react"
import { useRBAC } from "@/lib/hooks/useRBAC"
import type { Permission, UserRole } from "@/types/rbac"

interface RoleGateProps {
    children: ReactNode
    allowedRoles?: UserRole[]
    requiredPermissions?: Permission[]
    fallback?: ReactNode
    requireAll?: boolean
}

/**
 * Component to conditionally render content based on user roles and permissions
 */
export const RoleGate = ({
    children,
    allowedRoles,
    requiredPermissions,
    fallback = null,
    requireAll = false,
}: RoleGateProps) => {
    const { hasAnyRole, hasAllRoles, hasPermission, isAuthenticated } = useRBAC()

    // Not authenticated, show fallback
    if (!isAuthenticated) {
        return <>{fallback}</>
    }

    // Check roles if specified
    if (allowedRoles && allowedRoles.length > 0) {
        const hasRoles = requireAll ? hasAllRoles(allowedRoles) : hasAnyRole(allowedRoles)

        if (!hasRoles) {
            return <>{fallback}</>
        }
    }

    // Check permissions if specified
    if (requiredPermissions && requiredPermissions.length > 0) {
        const hasPermissions = requireAll
            ? requiredPermissions.every((permission) => hasPermission(permission))
            : requiredPermissions.some((permission) => hasPermission(permission))

        if (!hasPermissions) {
            return <>{fallback}</>
        }
    }

    // User has the required roles/permissions, render children
    return <>{children}</>
}

