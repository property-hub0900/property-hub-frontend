import { SessionOptions } from "iron-session";

export interface SessionData {
  userId?: string | null;
  isLoggedIn: boolean;
}

export const defaultSession: SessionData = {
  isLoggedIn: false,
};

export const sessionOptions: SessionOptions = {
  password: process.env.NEXT_PUBLIC_SECERT_KEY!,
  cookieName: "PropertyExplorer-session",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NEXT_PUBLIC_NODE_ENV === "production",
    maxAge: 60 * 60 * 8 * 1000,
  },
};
