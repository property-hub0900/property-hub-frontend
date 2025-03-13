/**
 * Role-based access control types
 */

// Define available roles in the system
export type UserRole = "customer" | "owner" | "admin" | "agent";

// Define available permissions in the system
export type Permission =
  // Customer permissions
  | "view:properties"
  | "save:properties"
  | "contact:agents"

  // Owner permissions
  | "create:property"
  | "edit:property"
  | "delete:property"

  // Admin permissions
  | "manage:users"
  | "manage:properties"
  | "manage:system"

  // Agent permissions
  | "list:properties"
  | "manage:listings"
  | "contact:customers";

// Role to permissions mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  customer: ["view:properties", "save:properties", "contact:agents"],
  owner: [
    "view:properties",
    "save:properties",
    "contact:agents",
    "create:property",
    "edit:property",
    "delete:property",
  ],
  admin: [
    "view:properties",
    "save:properties",
    "contact:agents",
    "create:property",
    "edit:property",
    "delete:property",
    "manage:users",
    "manage:properties",
    "manage:system",
  ],
  agent: [
    "view:properties",
    "save:properties",
    "contact:agents",
    "list:properties",
    "manage:listings",
    "contact:customers",
  ],
};

// Define the shape of the auth context
export interface AuthContextType {
  roles: UserRole[];
  isAuthenticated: boolean;
  hasPermission: (permission: Permission) => boolean;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  hasAllRoles: (roles: UserRole[]) => boolean;
}
