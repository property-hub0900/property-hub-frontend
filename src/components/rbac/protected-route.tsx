"use client"

import { type ReactNode, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useRBAC } from "@/lib/hooks/useRBAC"
import type { Permission, UserRole } from "@/types/rbac"

interface ProtectedRouteProps {
    children: ReactNode
    allowedRoles?: UserRole[]
    requiredPermissions?: Permission[]
    redirectTo?: string
    requireAll?: boolean
    loadingComponent?: ReactNode
}

/**
 * Component to protect routes based on user roles and permissions
 */
export const ProtectedRoute = ({
    children,
    allowedRoles,
    requiredPermissions,
    redirectTo = "/",
    requireAll = false,
    loadingComponent = null,
}: ProtectedRouteProps) => {
    const { hasAnyRole, hasAllRoles, hasPermission, isAuthenticated } = useRBAC()
    const router = useRouter()

    useEffect(() => {
        // Check roles if specified
        if (allowedRoles && allowedRoles.length > 0) {
            const hasRoles = requireAll ? hasAllRoles(allowedRoles) : hasAnyRole(allowedRoles)
            if (!hasRoles) {
                router.push(redirectTo)
                return
            }
        }

        // Check permissions if specified
        if (requiredPermissions && requiredPermissions.length > 0) {
            const hasPermissions = requireAll
                ? requiredPermissions.every((permission) => hasPermission(permission))
                : requiredPermissions.some((permission) => hasPermission(permission))

            if (!hasPermissions) {
                router.push(redirectTo)
                return
            }
        }
    }, [
        isAuthenticated,
        allowedRoles,
        requiredPermissions,
        redirectTo,
        requireAll,
        hasAnyRole,
        hasAllRoles,
        hasPermission,
        router,
    ])

    // If not authenticated or doesn't have required roles/permissions, show loading component
    if (!isAuthenticated) {
        return <>{loadingComponent}</>
    }

    // Check roles if specified
    if (allowedRoles && allowedRoles.length > 0) {
        const hasRoles = requireAll ? hasAllRoles(allowedRoles) : hasAnyRole(allowedRoles)

        if (!hasRoles) {
            return <>{loadingComponent}</>
        }
    }

    // Check permissions if specified
    if (requiredPermissions && requiredPermissions.length > 0) {
        const hasPermissions = requireAll
            ? requiredPermissions.every((permission) => hasPermission(permission))
            : requiredPermissions.some((permission) => hasPermission(permission))

        if (!hasPermissions) {
            return <>{loadingComponent}</>
        }
    }

    // User has the required roles/permissions, render children
    return <>{children}</>
}

