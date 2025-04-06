import { type ReactNode } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { type Permission, type UserRole } from '@/constants/rbac';

interface PermissionGuardProps {
    children: ReactNode;
    permission?: Permission;
    permissions?: Permission[];
    role?: UserRole;
    roles?: UserRole[];
    fallback?: ReactNode;
}

/**
 * A component that conditionally renders its children based on user permissions or roles
 * Use this to protect UI elements that should only be visible to users with specific permissions
 * 
 * @example
 * // Show a button only to admins
 * <PermissionGuard role="admin">
 *   <Button>Admin Only Action</Button>
 * </PermissionGuard>
 * 
 * @example
 * // Show content based on a specific permission
 * <PermissionGuard permission="edit:property">
 *   <EditButton />
 * </PermissionGuard>
 */
export function PermissionGuard({
    children,
    permission,
    permissions,
    role,
    roles,
    fallback = null,
}: PermissionGuardProps) {
    const {
        hasPermission,
        hasRole,
        hasAnyRole
    } = usePermissions();


    // Check single permission
    if (permission && !hasPermission(permission)) {
        return <>{fallback}</>;
    }

    // Check multiple permissions (any of them)
    if (permissions && permissions.length > 0) {
        const hasAnyOfPermissions = permissions.some(p => hasPermission(p));
        if (!hasAnyOfPermissions) {
            return <>{fallback}</>;
        }
    }

    // Check single role
    if (role && !hasRole(role)) {
        return <>{fallback}</>;
    }

    // Check multiple roles (any of them)
    if (roles && roles.length > 0 && !hasAnyRole(roles)) {
        return <>{fallback}</>;
    }

    // If all checks pass, render the children
    return <>{children}</>;
} 