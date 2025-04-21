import { type NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { jwtDecode } from "jwt-decode";
import { UserRole } from "./constants/rbac";

// Define types for better type safety
interface UserData {
  userId: number;
  username: string;
  email: string;
  role: string;
  token: string;
  tokenExpiry: number;
  scope: string[];
}

interface AuthState {
  state: {
    user: UserData | null;
    isAuthenticated: boolean;
  };
  version: number;
}

// Define available roles in the system

// Define protected routes and their required roles
interface ProtectedRouteConfig {
  path: string;
  roles: UserRole[];
}

// Configuration for protected routes
const protectedRoutes: ProtectedRouteConfig[] = [
  {
    path: "/customer/dashboard",
    roles: ["customer", "owner", "admin"],
  },
  {
    path: "/company/dashboard",
    roles: ["owner", "admin", "agent", "manager"],
  },
  {
    path: "/admin",
    roles: ["admin"],
  },
  {
    path: "/properties/create",
    roles: ["owner", "admin", "agent"],
  },
  {
    path: "/properties/edit",
    roles: ["owner", "admin", "agent"],
  },
  {
    path: "/user/management",
    roles: ["admin"],
  },
];

const intlMiddleware = createIntlMiddleware({
  locales: ["en", "ar"],
  defaultLocale: "en",
});

export default async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const segments = pathname.split("/").filter(Boolean);
  const locale =
    segments.length > 0 && ["en", "ar"].includes(segments[0])
      ? segments[0]
      : "en";

  // Continue with the intl middleware
  return intlMiddleware(request);
}

/**
 * Check authentication status and get user roles from cookies
 */
function checkAuthFromCookies(request: NextRequest): {
  isAuthenticated: boolean;
  userRoles: string[];
} {
  try {
    // Default return value
    const defaultReturn = { isAuthenticated: false, userRoles: [] };

    // Quick check for auth-check cookie
    const authCheckCookie = request.cookies.get("auth-check")?.value;
    if (authCheckCookie === "true") {
      // We need to still try to get the roles from the auth cookie
      const authCookie = request.cookies.get("auth-storage")?.value;
      if (!authCookie) {
        return { isAuthenticated: true, userRoles: [] };
      }

      try {
        const authState = JSON.parse(
          decodeURIComponent(authCookie)
        ) as AuthState;
        if (authState?.state?.user?.token) {
          // Try to extract roles from token
          try {
            const decoded: any = jwtDecode(authState.state.user.token);
            return {
              isAuthenticated: true,
              userRoles: decoded.scope || authState.state.user.scope || [],
            };
          } catch (error) {
            console.error("Error decoding token:", error);
            return {
              isAuthenticated: true,
              userRoles: authState.state.user.scope || [],
            };
          }
        }
        return { isAuthenticated: true, userRoles: [] };
      } catch (error) {
        console.error("Error parsing auth cookie with auth-check:", error);
        return { isAuthenticated: true, userRoles: [] };
      }
    }

    // Full auth cookie check
    const authCookie = request.cookies.get("auth-storage")?.value;
    if (!authCookie) {
      return defaultReturn;
    }

    try {
      const authState = JSON.parse(decodeURIComponent(authCookie)) as AuthState;

      if (
        !authState?.state?.isAuthenticated ||
        !authState?.state?.user?.token ||
        !isTokenValid(authState.state.user.tokenExpiry)
      ) {
        return defaultReturn;
      }

      // Try to extract roles from token
      try {
        const decoded: any = jwtDecode(authState.state.user.token);
        return {
          isAuthenticated: true,
          userRoles: decoded.scope || authState.state.user.scope || [],
        };
      } catch (error) {
        console.error("Error decoding token:", error);
        return {
          isAuthenticated: true,
          userRoles: authState.state.user.scope || [],
        };
      }
    } catch (error) {
      console.error("Error parsing auth cookie:", error);
      return defaultReturn;
    }
  } catch (error) {
    console.error("Error checking authentication state:", error);
    return { isAuthenticated: false, userRoles: [] };
  }
}

/**
 * Check if a token is still valid based on expiry time
 * @param expiryTime The token expiry timestamp in seconds
 * @returns Whether the token is still valid
 */
function isTokenValid(expiryTime?: number): boolean {
  if (!expiryTime) return false;

  // Current time in seconds
  const now = Math.floor(Date.now() / 1000);

  // Token is valid if current time is before expiry
  return now < expiryTime;
}

/**
 * Find if the current path matches a protected route
 * @param pathname The current pathname
 * @returns The matched protected route or undefined
 */
function findProtectedRoute(
  pathname: string
): ProtectedRouteConfig | undefined {
  return protectedRoutes.find((route) => pathname.includes(route.path));
}

/**
 * Redirect to the appropriate login page
 */
function redirectToLogin(
  request: NextRequest,
  locale: string,
  pathname: string,
  search: string
): NextResponse {
  const loginPath = pathname.includes("/company")
    ? `/${locale}/company/login`
    : `/${locale}/customer/login`;

  // Add the original URL as a redirect parameter
  const redirectParam = encodeURIComponent(`${pathname}${search}`);
  const redirectUrl = `${loginPath}?redirect=${redirectParam}`;

  return NextResponse.redirect(new URL(redirectUrl, request.url));
}

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
