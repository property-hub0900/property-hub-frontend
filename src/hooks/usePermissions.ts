import { useAuthStore } from '@/store/auth-store';
import { useMemo } from 'react';
import {
    hasRole,
    hasAnyRole,
    hasPermission,
    getUserPermissions,
    getUserRoles,
    type AuthUser
} from '@/utils/rbac';
import { type Permission, type UserRole } from '@/constants/rbac';

/**
 * Custom hook for checking permissions in components
 * Use this to conditionally render UI elements based on user role and permissions
 */
export function usePermissions() {
    const { user, isAuthenticated } = useAuthStore();

    // Convert store user to auth user for RBAC functions
    const authUser = useMemo<AuthUser | null>(() => {

        if (!user) return null;

        return {
            userId: user.userId,
            username: user.username,
            email: user.email,
            role: user.role,
            scope: user.scope,
            token: user.token,
            tokenExpiry: user.tokenExpiry,
        };
    }, [user]);

    // Get user permissions
    const permissions = useMemo(() => {
        return getUserPermissions(authUser);
    }, [authUser]);

    // Get user roles
    const roles = useMemo(() => {
        return getUserRoles(authUser);
    }, [authUser]);

    return {
        isAuthenticated,
        permissions,
        roles,
        // Role-based checks
        hasRole: (role: UserRole) => hasRole(authUser, role),
        hasAnyRole: (roles: UserRole[]) => hasAnyRole(authUser, roles),
        // Permission-based checks
        hasPermission: (permission: Permission) => hasPermission(authUser, permission),
    };
} 