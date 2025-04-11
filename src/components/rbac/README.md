# RBAC (Role-Based Access Control) System

This document describes the RBAC system implemented in the project and how to use its various components.

## Overview

The RBAC system provides a comprehensive approach to managing permissions based on:

1. **User roles** - The scope array in the user's auth token
2. **Fine-grained permissions** - Individual permissions derived from roles
3. **Route-based access control** - Permissions required to access specific routes
4. **API-based dynamic permissions** - Special permissions from API like canAddProperty

## Components

### 1. Server-Side Protection with Middleware

The middleware provides the first layer of protection by checking permissions before the client-side code runs:

```typescript
// src/middleware.ts
// Automatically checks routes against ROUTE_PERMISSIONS and redirects unauthorized users
```

### 2. Client-Side Route Protection

#### ProtectedRoute Component

Use to protect entire routes/pages:

```tsx
// Protect a page by role
<ProtectedRoute 
  allowedRoles={['admin', 'owner']} 
  redirectTo="/dashboard"
>
  <AdminPage />
</ProtectedRoute>

// Protect a page by permission
<ProtectedRoute 
  requiredPermissions={[PERMISSIONS.CREATE_PROPERTY]} 
  redirectTo="/dashboard"
>
  <CreatePropertyPage />
</ProtectedRoute>

// Protect a page by route permission mapping
<ProtectedRoute 
  path="/company/dashboard/properties/add-new-property" 
  redirectTo="/dashboard"
>
  <AddPropertyPage />
</ProtectedRoute>
```

### 3. UI Element Protection

#### RoutePermissionGuard Component

Use to conditionally show UI elements that lead to protected routes:

```tsx
<RoutePermissionGuard route="/company/dashboard/properties/add-new-property">
  <Link href="/company/dashboard/properties/add-new-property">
    <Button>Add New Property</Button>
  </Link>
</RoutePermissionGuard>
```

#### RoleGate Component

Use to conditionally show content based on user roles:

```tsx
<RoleGate allowedRoles={['admin', 'owner']}>
  <AdminOnlyContent />
</RoleGate>
```

### 4. Sidebar Menu Protection

The sidebar uses `hasRoutePermission` to filter menu items:

```tsx
// Filter navigation items based on route permissions
const filteredNavItems = navItems.filter(item => {
  return hasRoutePermission(item.href);
})
```

## Using the useRBAC Hook

The `useRBAC` hook provides utility functions for permission checks:

```tsx
const { 
  hasRole,             // Check if user has a specific role
  hasAnyRole,          // Check if user has any of the specified roles
  hasPermission,       // Check if user has a specific permission
  hasRoutePermission,  // Check if user has permission to access a route
  roles                // Array of user roles
} = useRBAC();

// Examples
if (hasRole('admin')) {
  // Do admin things
}

if (hasPermission(PERMISSIONS.CREATE_PROPERTY)) {
  // Show property creation UI
}

if (hasRoutePermission('/company/dashboard/properties/add-new-property')) {
  // Allow access to add property page
}
```

## Permission Configuration

Permissions are configured in `src/constants/rbac.ts`:

1. `USER_ROLES` - Defines available roles
2. `PERMISSIONS` - Defines all permissions in the system
3. `ROLE_PERMISSIONS` - Maps roles to permissions
4. `ROUTE_PERMISSIONS` - Maps routes to required permissions

## Best Practices

1. Always use the middleware for server-side protection
2. Use ProtectedRoute for client-side route protection
3. Use RoutePermissionGuard for UI elements that link to protected routes
4. Use RoleGate for role-based UI rendering
5. Update ROUTE_PERMISSIONS when adding new protected routes 