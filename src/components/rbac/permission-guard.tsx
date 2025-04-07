"use client"

import { type ReactNode } from "react"
import { usePermissions } from "@/hooks/usePermissions"
import type { Permission } from "@/constants/rbac"

interface PermissionGuardProps {
    children: ReactNode
    permission: Permission
    fallback?: ReactNode
}

/**
 * Component to conditionally render content based on specific permission
 * Simplified version of RoleGate for when you only need to check a single permission
 */
export const PermissionGuard = ({
    children,
    permission,
    fallback = null,
}: PermissionGuardProps) => {
    const { hasPermission, isAuthenticated } = usePermissions()

    // Not authenticated or doesn't have permission, show fallback
    if (!isAuthenticated || !hasPermission(permission)) {
        return <>{fallback}</>
    }

    // User has required permission, render children
    return <>{children}</>
} 