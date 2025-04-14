"use client"

import { type ReactNode, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useRBAC } from "@/lib/hooks/useRBAC"
import type { Permission, UserRole } from "@/constants/rbac"
import { ROUTE_PERMISSIONS } from "@/constants/rbac"

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
    requiredPermissions: propPermissions,
    redirectTo = "/",
    requireAll = false,
    loadingComponent = null,
}: ProtectedRouteProps) => {
    const { hasAnyRole, hasAllRoles, hasPermission, isAuthenticated } = useRBAC()
    const router = useRouter()
    const pathname = usePathname()
    const [routePermissions, setRoutePermissions] = useState<Permission[]>([])

    // Use permissions from props if provided, otherwise try to find them from ROUTE_PERMISSIONS
    useEffect(() => {
        if (!propPermissions || propPermissions.length === 0) {
            // Find the most specific matching route pattern
            const matchingRoutes = Object.keys(ROUTE_PERMISSIONS)
                .filter(route => pathname.includes(route))
                .sort((a, b) => b.length - a.length) // Sort by length (most specific first)

            const matchedRoute = matchingRoutes[0]
            if (matchedRoute) {
                setRoutePermissions(ROUTE_PERMISSIONS[matchedRoute])
            } else {
                setRoutePermissions([])
            }
        } else {
            setRoutePermissions(propPermissions)
        }
    }, [pathname, propPermissions])

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
        if (routePermissions && routePermissions.length > 0) {
            const hasPermissions = requireAll
                ? routePermissions.every((permission) => hasPermission(permission))
                : routePermissions.some((permission) => hasPermission(permission))
            if (!hasPermissions) {
                router.push(redirectTo)
                return
            }
        }
    }, [
        isAuthenticated,
        allowedRoles,
        routePermissions,
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
    if (routePermissions && routePermissions.length > 0) {
        const hasPermissions = requireAll
            ? routePermissions.every((permission) => hasPermission(permission))
            : routePermissions.some((permission) => hasPermission(permission))

        if (!hasPermissions) {
            return <>{loadingComponent}</>
        }
    }

    // User has the required roles/permissions, render children
    return <>{children}</>
}

