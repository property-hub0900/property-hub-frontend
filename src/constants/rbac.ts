// Role definitions
export const USER_ROLES = {
    OWNER: "owner",
    ADMIN: "admin",
    AGENT: "agent",
    CUSTOMER: "customer",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

// Permission definitions
export const PERMISSIONS = {
    // Property permissions
    VIEW_PROPERTIES: "view:properties",
    CREATE_PROPERTY: "create:property",
    EDIT_PROPERTY: "edit:property",
    DELETE_PROPERTY: "delete:property",
    PUBLISH_PROPERTY: "publish:property",

    // User management
    VIEW_USERS: "view:users",
    CREATE_USER: "create:user",
    EDIT_USER: "edit:user",
    DELETE_USER: "delete:user",

    // Company management
    VIEW_COMPANY: "view:company",
    EDIT_COMPANY: "edit:company",

    // Dashboard access
    ACCESS_CUSTOMER_DASHBOARD: "access:customer:dashboard",
    ACCESS_COMPANY_DASHBOARD: "access:company:dashboard",
    ACCESS_ADMIN_DASHBOARD: "access:admin:dashboard",

    // Analytics
    VIEW_ANALYTICS: "view:analytics",

    // Settings
    MANAGE_SETTINGS: "manage:settings",

    // Inquiries
    VIEW_INQUIRIES: "view:inquiries",
    RESPOND_INQUIRIES: "respond:inquiries",

    // Favorites and saved searches (customer)
    MANAGE_FAVORITES: "manage:favorites",
    MANAGE_SAVED_SEARCHES: "manage:saved:searches",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// Role-based permission mappings
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
    [USER_ROLES.OWNER]: [
        // Full system access
        PERMISSIONS.VIEW_PROPERTIES,
        PERMISSIONS.CREATE_PROPERTY,
        PERMISSIONS.EDIT_PROPERTY,
        PERMISSIONS.DELETE_PROPERTY,
        PERMISSIONS.PUBLISH_PROPERTY,
        PERMISSIONS.VIEW_USERS,
        PERMISSIONS.CREATE_USER,
        PERMISSIONS.EDIT_USER,
        PERMISSIONS.DELETE_USER,
        PERMISSIONS.VIEW_COMPANY,
        PERMISSIONS.EDIT_COMPANY,
        PERMISSIONS.ACCESS_CUSTOMER_DASHBOARD,
        PERMISSIONS.ACCESS_COMPANY_DASHBOARD,
        PERMISSIONS.VIEW_ANALYTICS,
        PERMISSIONS.MANAGE_SETTINGS,
        PERMISSIONS.VIEW_INQUIRIES,
        PERMISSIONS.RESPOND_INQUIRIES,
        PERMISSIONS.MANAGE_FAVORITES,
        PERMISSIONS.MANAGE_SAVED_SEARCHES,
    ],

    [USER_ROLES.ADMIN]: [
        // Administrative access
        PERMISSIONS.VIEW_PROPERTIES,
        PERMISSIONS.CREATE_PROPERTY,
        PERMISSIONS.EDIT_PROPERTY,
        PERMISSIONS.DELETE_PROPERTY,
        PERMISSIONS.PUBLISH_PROPERTY,
        PERMISSIONS.VIEW_USERS,
        PERMISSIONS.CREATE_USER,
        PERMISSIONS.EDIT_USER,
        PERMISSIONS.DELETE_USER,
        PERMISSIONS.VIEW_COMPANY,
        PERMISSIONS.ACCESS_ADMIN_DASHBOARD,
        PERMISSIONS.ACCESS_COMPANY_DASHBOARD,
        PERMISSIONS.VIEW_ANALYTICS,
        PERMISSIONS.MANAGE_SETTINGS,
        PERMISSIONS.VIEW_INQUIRIES,
        PERMISSIONS.RESPOND_INQUIRIES,
    ],

    [USER_ROLES.AGENT]: [
        // Property management
        PERMISSIONS.VIEW_PROPERTIES,
        PERMISSIONS.CREATE_PROPERTY,
        PERMISSIONS.EDIT_PROPERTY,
        PERMISSIONS.ACCESS_COMPANY_DASHBOARD,
        PERMISSIONS.VIEW_INQUIRIES,
        PERMISSIONS.RESPOND_INQUIRIES,
    ],

    [USER_ROLES.CUSTOMER]: [
        // Customer permissions - Ensure ACCESS_CUSTOMER_DASHBOARD is included
        PERMISSIONS.VIEW_PROPERTIES,
        PERMISSIONS.ACCESS_CUSTOMER_DASHBOARD, // Crucial permission for customer dashboard
        PERMISSIONS.MANAGE_FAVORITES,
        PERMISSIONS.MANAGE_SAVED_SEARCHES,
    ],
};

// Route permission mappings - which permissions are required for specific routes
export const ROUTE_PERMISSIONS: Record<string, Permission[]> = {
    // Dashboard routes
    "/customer/dashboard": [PERMISSIONS.ACCESS_CUSTOMER_DASHBOARD],
    "/company/dashboard": [PERMISSIONS.ACCESS_COMPANY_DASHBOARD],
    "/admin": [PERMISSIONS.ACCESS_ADMIN_DASHBOARD],

    // Property routes
    "/properties/create": [PERMISSIONS.CREATE_PROPERTY],
    "/properties/edit": [PERMISSIONS.EDIT_PROPERTY],
    "/properties/delete": [PERMISSIONS.DELETE_PROPERTY],

    // User management
    "/user/management": [PERMISSIONS.VIEW_USERS],

    // Company settings
    "/company/settings": [PERMISSIONS.EDIT_COMPANY],

    // Analytics
    "/analytics": [PERMISSIONS.VIEW_ANALYTICS],
}; 