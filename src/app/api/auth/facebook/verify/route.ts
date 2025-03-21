import { type NextRequest, NextResponse } from "next/server";

interface FacebookUserData {
  id: string;
  email: string;
  name: string;
  picture: {
    data: {
      url: string;
    };
  };
}

export async function POST(request: NextRequest) {
  try {
    const { accessToken } = await request.json();

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: "No access token provided" },
        { status: 400 }
      );
    }

    // Verify the access token and get user data
    const userInfoResponse = await fetch(
      `https://graph.facebook.com/v19.0/me?fields=id,name,email,picture&access_token=${accessToken}`,
      {
        cache: "no-store",
        next: { revalidate: 0 },
      }
    );

    const userData: FacebookUserData = await userInfoResponse.json();

    if (!userInfoResponse.ok) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 400 }
      );
    }

    // Create response with user data
    const response = NextResponse.json({
      success: true,
      user: {
        facebookUserId: userData.id,
        email: userData.email,
        name: userData.name,
        picture: userData.picture.data.url,
      },
    });

    // Set user cookie
    response.cookies.set("user_email", userData.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return response;
  } catch (error) {
    console.error("Error verifying Facebook token:", error);
    return NextResponse.json(
      { success: false, error: "Invalid token" },
      { status: 400 }
    );
  }
}
