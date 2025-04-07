import { USER_ROLES, PERMISSIONS, ROLE_PERMISSIONS, type UserRole, type Permission } from '@/constants/rbac';

// Define the user type for authentication
export interface AuthUser {
    userId?: number;
    username?: string;
    email?: string;
    role?: string;
    scope?: string[];
    token?: string;
    tokenExpiry?: number;
}

/**
 * Check if a user has a specific role
 */
export function hasRole(user: AuthUser | null, role: UserRole): boolean {
    if (!user || !user.scope || user.scope.length === 0) return false;
    return user.scope.map(r => r.toLowerCase()).includes(role.toLowerCase());
}

/**
 * Check if a user has any of the given roles
 */
export function hasAnyRole(user: AuthUser | null, roles: UserRole[]): boolean {
    if (!user || !user.scope || user.scope.length === 0) return false;
    const userRoles = user.scope.map(r => r.toLowerCase());
    return roles.some(role => userRoles.includes(role.toLowerCase()));
}

/**
 * Get all permissions for a user based on their role
 */
export function getUserPermissions(user: AuthUser | null): Permission[] {
    if (!user || !user.scope || user.scope.length === 0) return [];

    // Only use scope for permission determination
    const scopeRole = user.scope[0].toLowerCase();

    // Check if the scope role is defined in USER_ROLES or if it's "staff"
    for (const roleKey in USER_ROLES) {
        if (USER_ROLES[roleKey as keyof typeof USER_ROLES] === scopeRole || scopeRole === "staff") {
            return ROLE_PERMISSIONS[scopeRole as UserRole] || [];
        }
    }

    return [];
}

/**
 * Get all roles for a user (simplistic - users typically have one role in this system)
 */
export function getUserRoles(user: AuthUser | null): UserRole[] {
    if (!user || !user.scope || user.scope.length === 0) return [];

    // Only use scope for role determination
    const scopeRole = user.scope[0].toLowerCase();
    return [scopeRole as UserRole];
}

/**
 * Check if user has a specific permission
 */
export function hasPermission(user: AuthUser | null, permission: Permission): boolean {
    if (!user) return false;

    const permissions = getUserPermissions(user);
    return permissions.includes(permission);
}

// Use ROLE_PERMISSIONS from constants instead of duplicating 