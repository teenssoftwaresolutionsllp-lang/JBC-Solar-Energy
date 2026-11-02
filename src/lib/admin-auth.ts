import { cookies } from "next/headers";
import { signSessionToken, verifySessionToken } from "./admin-crypto";
import { SafeAdminUser } from "./admin-types";
import { getAdminUserById } from "./admin-store";

export const ADMIN_COOKIE_NAME = "jbc_admin_session";

interface SessionPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
  iat: number;
  exp: number;
}

/**
 * Creates an encrypted session token and returns cookie options
 */
export async function createAdminSession(user: SafeAdminUser, remember = true): Promise<string> {
  const maxAge = remember ? 30 * 24 * 60 * 60 : 24 * 60 * 60; // 30 days or 1 day
  const payload: SessionPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + maxAge,
  };

  const token = signSessionToken(payload as unknown as Record<string, unknown>);
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });

  return token;
}

/**
 * Retrieves the currently authenticated admin user from the session cookie
 */
export async function getCurrentAdmin(): Promise<SafeAdminUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(ADMIN_COOKIE_NAME);
    if (!sessionCookie?.value) {
      return null;
    }

    const payload = verifySessionToken<SessionPayload>(sessionCookie.value);
    if (!payload || !payload.userId) {
      return null;
    }

    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    const user = getAdminUserById(payload.userId);
    if (!user || user.status !== "active") {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

/**
 * Removes the session cookie on logout
 */
export async function destroyAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}
