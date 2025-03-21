import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(
      new URL("/en/customer/login?error=no_code", request.url)
    );
  }

  try {
    // Exchange the code for an access token
    const tokenResponse = await fetch(
      "https://graph.facebook.com/v19.0/oauth/access_token",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        next: { revalidate: 0 },
      }
    );

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("Token exchange error:", tokenData);
      return NextResponse.redirect(
        new URL("/en/customer/login?error=token_exchange", request.url)
      );
    }

    // Get user data using the access token
    const userInfoResponse = await fetch(
      `https://graph.facebook.com/v19.0/me?fields=id,name,email,picture&access_token=${tokenData.access_token}`,
      {
        cache: "no-store",
        next: { revalidate: 0 },
      }
    );

    const userData = await userInfoResponse.json();

    if (!userInfoResponse.ok) {
      console.error("User info error:", userData);
      return NextResponse.redirect(
        new URL("/en/customer/login?error=user_info", request.url)
      );
    }

    // Redirect to dashboard with user info
    const successUrl = new URL("/en/customer/dashboard", request.url);
    const response = NextResponse.redirect(successUrl);

    // Set cookies with user info
    response.cookies.set("user_email", userData.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return response;
  } catch (error) {
    console.error("Facebook OAuth callback error:", error);
    return NextResponse.redirect(
      new URL("/en/customer/login?error=server_error", request.url)
    );
  }
}
