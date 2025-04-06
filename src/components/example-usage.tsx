"use client"

import { useState } from "react"
import { USER_ROLES, ROLE_PERMISSIONS, PERMISSIONS } from "@/constants/rbac"
import { ChevronRight, Lock, Shield, User, Users, Edit, Trash, Plus, Eye, Settings, BarChart3 } from "lucide-react"

export function RBACExample() {
    const [selectedRole, setSelectedRole] = useState<string>(USER_ROLES.OWNER)

    // Group permissions by category for better visualization
    const groupPermissionsByCategory = (permissions: string[]) => {
        const categories = {
            properties: permissions.filter((p) => p.includes("property")),
            users: permissions.filter((p) => p.includes("user")),
            company: permissions.filter((p) => p.includes("company")),
            dashboard: permissions.filter((p) => p.includes("dashboard")),
            analytics: permissions.filter((p) => p.includes("analytics")),
            settings: permissions.filter((p) => p.includes("settings")),
            inquiries: permissions.filter((p) => p.includes("inquiries")),
            favorites: permissions.filter((p) => p.includes("favorites") || p.includes("saved")),
        }

        return categories
    }

    // Get permissions for the selected role
    const rolePermissions = ROLE_PERMISSIONS[selectedRole as keyof typeof ROLE_PERMISSIONS]
    const groupedPermissions = groupPermissionsByCategory(rolePermissions)

    // Check if the selected role has a specific permission
    const hasPermission = (permission: any) => {
        return rolePermissions.includes(permission)
    }

    // Get accessible routes for the selected role
    const getAccessibleRoutes = (role: string) => {
        const routes = []

        if (role === USER_ROLES.CUSTOMER || role === USER_ROLES.OWNER) {
            // routes.push("/customer/dashboard")
        }

        if (role === USER_ROLES.AGENT || role === USER_ROLES.ADMIN || role === USER_ROLES.OWNER) {
            // routes.push("/company/dashboard")
        }

        if (role === USER_ROLES.ADMIN || role === USER_ROLES.OWNER) {
            // routes.push("/admin", "/analytics", "/user/management", "/company/settings")
        }

        return routes
    }

    return (
        <div className="w-full max-w-5xl mx-auto p-4 rounded-lg">
            <h1 className="text-xl font-bold mb-4 text-center">RBAC Visualization</h1>

            {/* Role selector */}
            <div className="mb-6">
                <div className="flex flex-wrap gap-2 justify-center">
                    {Object.values(USER_ROLES).map((role) => (
                        <button
                            key={role}
                            onClick={() => setSelectedRole(role)}
                            className={`px-3 py-1.5 rounded-md transition-colors ${selectedRole === role ? "bg-emerald-600 text-white" : "bg-gray-100 hover:bg-gray-200"
                                }`}
                        >
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Example UI that changes based on permissions */}
            <div className="mb-8 border-2 border-gray-200 rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-3 text-center">Example UI for {selectedRole.toUpperCase()}</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Properties section */}
                    <div className="border rounded-md p-3">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-medium">Properties</h3>
                            {hasPermission(PERMISSIONS.CREATE_PROPERTY) && (
                                <button className="bg-emerald-100 text-emerald-700 p-1 rounded-md flex items-center text-xs">
                                    <Plus className="h-3 w-3 mr-1" /> Add Property
                                </button>
                            )}
                        </div>

                        <div className="border rounded-md p-2 mb-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Ocean View Villa</span>
                                <div className="flex gap-1">
                                    <button className="bg-gray-100 p-1 rounded-md">
                                        <Eye className="h-3 w-3 text-gray-600" />
                                    </button>

                                    {hasPermission(PERMISSIONS.EDIT_PROPERTY) && (
                                        <button className="bg-blue-100 p-1 rounded-md">
                                            <Edit className="h-3 w-3 text-blue-600" />
                                        </button>
                                    )}

                                    {hasPermission(PERMISSIONS.DELETE_PROPERTY) && (
                                        <button className="bg-red-100 p-1 rounded-md">
                                            <Trash className="h-3 w-3 text-red-600" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="text-xs text-gray-500 italic">
                            {!hasPermission(PERMISSIONS.EDIT_PROPERTY) && (
                                <div className="text-amber-600 flex items-center">
                                    <Lock className="h-3 w-3 mr-1" /> Edit button hidden (no permission)
                                </div>
                            )}
                            {!hasPermission(PERMISSIONS.DELETE_PROPERTY) && (
                                <div className="text-amber-600 flex items-center">
                                    <Lock className="h-3 w-3 mr-1" /> Delete button hidden (no permission)
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Dashboard access */}
                    <div className="border rounded-md p-3">
                        <h3 className="font-medium mb-3">Dashboard Access</h3>

                        <div className="space-y-2">
                            <button
                                className={`w-full text-left px-2 py-1.5 rounded-md text-sm flex items-center ${hasPermission(PERMISSIONS.ACCESS_CUSTOMER_DASHBOARD) ? "bg-gray-100" : "bg-gray-100 opacity-50 cursor-not-allowed"}`}
                                disabled={!hasPermission(PERMISSIONS.ACCESS_CUSTOMER_DASHBOARD)}
                            >
                                <User className="h-3.5 w-3.5 mr-2" /> Customer Dashboard
                                {!hasPermission(PERMISSIONS.ACCESS_CUSTOMER_DASHBOARD) && (
                                    <Lock className="h-3 w-3 ml-auto text-amber-600" />
                                )}
                            </button>

                            <button
                                className={`w-full text-left px-2 py-1.5 rounded-md text-sm flex items-center ${hasPermission(PERMISSIONS.ACCESS_COMPANY_DASHBOARD) ? "bg-gray-100" : "bg-gray-100 opacity-50 cursor-not-allowed"}`}
                                disabled={!hasPermission(PERMISSIONS.ACCESS_COMPANY_DASHBOARD)}
                            >
                                <Users className="h-3.5 w-3.5 mr-2" /> Company Dashboard
                                {!hasPermission(PERMISSIONS.ACCESS_COMPANY_DASHBOARD) && (
                                    <Lock className="h-3 w-3 ml-auto text-amber-600" />
                                )}
                            </button>

                            <button
                                className={`w-full text-left px-2 py-1.5 rounded-md text-sm flex items-center ${hasPermission(PERMISSIONS.ACCESS_ADMIN_DASHBOARD) ? "bg-gray-100" : "bg-gray-100 opacity-50 cursor-not-allowed"}`}
                                disabled={!hasPermission(PERMISSIONS.ACCESS_ADMIN_DASHBOARD)}
                            >
                                <Settings className="h-3.5 w-3.5 mr-2" /> Admin Dashboard
                                {!hasPermission(PERMISSIONS.ACCESS_ADMIN_DASHBOARD) && (
                                    <Lock className="h-3 w-3 ml-auto text-amber-600" />
                                )}
                            </button>

                            <button
                                className={`w-full text-left px-2 py-1.5 rounded-md text-sm flex items-center ${hasPermission(PERMISSIONS.VIEW_ANALYTICS) ? "bg-gray-100" : "bg-gray-100 opacity-50 cursor-not-allowed"}`}
                                disabled={!hasPermission(PERMISSIONS.VIEW_ANALYTICS)}
                            >
                                <BarChart3 className="h-3.5 w-3.5 mr-2" /> Analytics
                                {!hasPermission(PERMISSIONS.VIEW_ANALYTICS) && <Lock className="h-3 w-3 ml-auto text-amber-600" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* RBAC Diagram */}
            <div className="relative">
                <div className="p-2">
                    {/* User */}
                    <div className="flex justify-center mb-6">
                        <div className="w-40 h-16 border-2 border-emerald-500 rounded-lg flex items-center justify-center bg-emerald-50">
                            <div className="flex flex-col items-center">
                                <User className="h-5 w-5 text-emerald-600 mb-1" />
                                <span className="font-medium">User</span>
                            </div>
                        </div>
                    </div>

                    {/* Arrow down */}
                    <div className="flex justify-center mb-2">
                        <div className="flex flex-col items-center">
                            <div className="h-6 w-0.5 bg-gray-400"></div>
                            <ChevronRight className="h-4 w-4 text-gray-500 rotate-90" />
                        </div>
                    </div>

                    {/* Role */}
                    <div className="flex justify-center mb-6">
                        <div className="w-56 h-20 border-2 border-blue-500 rounded-lg flex items-center justify-center bg-blue-50 relative">
                            <div className="flex flex-col items-center">
                                <Shield className="h-5 w-5 text-blue-600 mb-1" />
                                <span className="font-medium">Role: {selectedRole.toUpperCase()}</span>
                            </div>

                            {/* Dotted border around the role */}
                            <div className="absolute -inset-2 border-2 border-dashed border-blue-400 rounded-xl"></div>
                        </div>
                    </div>

                    {/* Arrow down */}
                    <div className="flex justify-center mb-2">
                        <div className="flex flex-col items-center">
                            <div className="h-6 w-0.5 bg-gray-400"></div>
                            <ChevronRight className="h-4 w-4 text-gray-500 rotate-90" />
                        </div>
                    </div>

                    {/* Permissions */}
                    <div className="flex justify-center mb-6">
                        <div className="w-full max-w-3xl border-2 border-purple-500 rounded-lg p-3 bg-purple-50">
                            <div className="flex items-center justify-center mb-2">
                                <Lock className="h-5 w-5 text-purple-600 mr-2" />
                                <span className="font-medium">Permissions ({rolePermissions.length})</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {Object.entries(groupedPermissions).map(
                                    ([category, perms]) =>
                                        perms.length > 0 && (
                                            <div key={category} className="border border-purple-200 rounded-md p-2 bg-white">
                                                <h3 className="font-medium text-purple-700 mb-1 capitalize">{category}</h3>
                                                <ul className="text-xs space-y-1">
                                                    {perms.map((perm) => (
                                                        <li key={perm} className="flex items-center">
                                                            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-1.5"></div>
                                                            <span className="truncate">{perm}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ),
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Arrow down */}
                    <div className="flex justify-center mb-2">
                        <div className="flex flex-col items-center">
                            <div className="h-6 w-0.5 bg-gray-400"></div>
                            <ChevronRight className="h-4 w-4 text-gray-500 rotate-90" />
                        </div>
                    </div>

                    {/* Accessible Routes */}
                    <div className="flex justify-center">
                        <div className="w-full max-w-3xl border-2 border-amber-500 rounded-lg p-3 bg-amber-50">
                            <div className="flex items-center justify-center mb-2">
                                <Users className="h-5 w-5 text-amber-600 mr-2" />
                                <span className="font-medium">Accessible Routes</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                {getAccessibleRoutes(selectedRole).map((route) => (
                                    <div key={route} className="border border-amber-200 rounded-md p-2 bg-white flex items-center">
                                        <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                                        <span className="text-sm">{route}</span>
                                    </div>
                                ))}
                                {getAccessibleRoutes(selectedRole).length === 0 && (
                                    <div className="col-span-full text-center text-sm text-gray-500 italic p-2">
                                        No specific routes defined for this role
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

