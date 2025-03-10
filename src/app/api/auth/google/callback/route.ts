import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Get the authorization code from the URL query parameters
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(
      new URL("/en/customer/login?error=no_code", request.url)
    );
  }

  try {
    // Exchange the authorization code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${request.nextUrl.origin}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("Token exchange error:", tokenData);
      return NextResponse.redirect(
        new URL("/en/customer/login?error=token_exchange", request.url)
      );
    }

    // Get user info using the access token
    const userInfoResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      }
    );

    const userData = await userInfoResponse.json();

    if (!userInfoResponse.ok) {
      console.error("User info error:", userData);
      return NextResponse.redirect(
        new URL("/en/customer/login?error=user_info", request.url)
      );
    }

    // Here you would typically:
    // 1. Check if the user exists in your database
    // 2. Create the user if they don't exist
    // 3. Create a session or JWT token
    // 4. Set cookies or other auth mechanisms

    // For now, we'll just redirect to a success page with some user info
    const successUrl = new URL("/en/customer/dashboard", request.url);

    // Store user info in cookies or session (simplified example)
    const response = NextResponse.redirect(successUrl);

    // Set a cookie with user info (in production, use a proper session mechanism)
    response.cookies.set("user_email", userData.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return response;
  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.redirect(
      new URL("/en/customer/login?error=server_error", request.url)
    );
  }
}
