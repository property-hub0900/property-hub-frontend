import { type NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";

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

const intlMiddleware = createIntlMiddleware({
  locales: ["en", "ar"],
  defaultLocale: "en",
});

export default async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const segments = pathname.split("/").filter(Boolean);
  const locale = segments.length > 0 ? segments[0] : "en";

  const isAuthPage =
    pathname.includes("/login") || pathname.includes("/register");

  const isAuthenticated = checkAuthFromCookies(request);

  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL(`/${locale}/`, request.url));
  }

  if (pathname.includes("/dashboard") && !isAuthenticated) {
    const loginPath = pathname.includes("/company")
      ? `/${locale}/company/login`
      : `/${locale}/customer/login`;

    const redirectUrl = search ? `${loginPath}${search}` : loginPath;
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  return intlMiddleware(request);
}

function checkAuthFromCookies(request: NextRequest): boolean {
  try {
    const authCheckCookie = request.cookies.get("auth-check")?.value;
    if (authCheckCookie === "true") {
      return true;
    }

    const authCookie = request.cookies.get("auth-storage")?.value;
    if (authCookie) {
      try {
        const authState = JSON.parse(
          decodeURIComponent(authCookie)
        ) as AuthState;

        if (
          authState?.state?.isAuthenticated &&
          authState?.state?.user?.token &&
          isTokenValid(authState.state.user.tokenExpiry)
        ) {
          return true;
        }
      } catch (error) {
        console.error("Error parsing auth cookie:", error);
      }
    }

    return false;
  } catch (error) {
    console.error("Error checking authentication state:", error);
    return false;
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

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
