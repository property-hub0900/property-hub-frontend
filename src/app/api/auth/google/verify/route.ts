import { type NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

interface GoogleTokenPayload {
  iss: string;
  nbf: number;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  azp: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  iat: number;
  exp: number;
  jti: string;
}

export async function POST(request: NextRequest) {
  try {
    const { credential } = await request.json();

    if (!credential) {
      return NextResponse.json(
        { success: false, error: "No credential provided" },
        { status: 400 }
      );
    }

    // Decode the JWT token to get user information
    // Note: In production, you should verify the token with Google's API
    const decoded = jwtDecode<GoogleTokenPayload>(credential);

    // In a real application, you would:
    // 1. Verify the token with Google's API
    // 2. Check if the user exists in your database
    // 3. Create the user if they don't exist
    // 4. Create a session or JWT token for your app

    // For this example, we'll just use the decoded information
    const { sub: googleUserId, email, name, picture } = decoded;

    // Create a response with a cookie
    const response = NextResponse.json({
      success: true,
      user: { email, name, picture, googleUserId },
    });

    // Set a cookie with user info
    response.cookies.set("user_email", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return response;
  } catch (error) {
    console.error("Error verifying Google token:", error);
    return NextResponse.json(
      { success: false, error: "Invalid token" },
      { status: 400 }
    );
  }
}
