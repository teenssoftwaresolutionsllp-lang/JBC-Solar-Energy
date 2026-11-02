import crypto from "crypto";
import bcrypt from "bcryptjs";

const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || "jbc-solar-super-secret-key-2026-secure-token-99x";

/**
 * Hashes a plaintext password using scrypt with a unique random salt
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derivedKey}`;
}

/**
 * Securely verifies a plaintext password against:
 * 1. bcrypt hashes (e.g. $2a$, $2b$, $2y$, $2x$)
 * 2. scrypt hashes (salt:derivedKey)
 * 3. Plaintext fallback (if password was manually edited directly in pgAdmin/database)
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    if (!storedHash || !password) return false;

    // 1. Check bcrypt hash
    if (
      storedHash.startsWith("$2a$") ||
      storedHash.startsWith("$2b$") ||
      storedHash.startsWith("$2y$") ||
      storedHash.startsWith("$2x$")
    ) {
      return bcrypt.compareSync(password, storedHash);
    }

    // 2. Check scrypt hash (salt:derivedKey)
    if (storedHash.includes(":")) {
      const parts = storedHash.split(":");
      if (parts.length === 2) {
        const [salt, key] = parts;
        const derivedKey = crypto.scryptSync(password, salt, 64).toString("hex");
        if (
          derivedKey.length === key.length &&
          crypto.timingSafeEqual(Buffer.from(derivedKey, "hex"), Buffer.from(key, "hex"))
        ) {
          return true;
        }
      }
    }

    // 3. Fallback: plaintext match (if password was updated as plain text in pgAdmin)
    if (password === storedHash) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Creates an HMAC-signed session string
 */
export function signSessionToken(payload: Record<string, unknown>): string {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(data)
    .digest("base64url");
  return `${data}.${signature}`;
}

/**
 * Verifies and parses an HMAC-signed session string
 */
export function verifySessionToken<T = Record<string, unknown>>(token: string): T | null {
  try {
    const [data, signature] = token.split(".");
    if (!data || !signature) return null;

    const expectedSignature = crypto
      .createHmac("sha256", SESSION_SECRET)
      .update(data)
      .digest("base64url");

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }

    const json = Buffer.from(data, "base64url").toString("utf-8");
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}
