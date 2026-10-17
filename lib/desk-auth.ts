import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { readFileSync } from "fs";
import path from "path";

export const deskCookie = "desk_session";
const maxAgeSeconds = 60 * 60 * 12;

function readLocal(name: string) {
  try {
    return readFileSync(path.join(process.cwd(), name), "utf8").trim();
  } catch {
    return "";
  }
}

export function inviteToken() {
  return process.env.DESK_INVITE_TOKEN?.trim() || readLocal(".desk-invite");
}

function sessionSecret() {
  return process.env.DESK_SESSION_SECRET?.trim() || readLocal(".desk-session");
}

export function deskConfigured() {
  return Boolean(sessionSecret());
}

export function inviteMatches(token: string) {
  const expected = inviteToken();
  const left = Buffer.from(token);
  const right = Buffer.from(expected);
  if (left.length === 0 || left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("base64url");
  const hash = scryptSync(password, salt, 32).toString("base64url");
  return `scrypt$${salt}$${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [kind, salt, hash] = stored.split("$");
  if (kind !== "scrypt" || !salt || !hash) return false;
  const next = scryptSync(password, salt, 32);
  const current = Buffer.from(hash, "base64url");
  if (next.length !== current.length) return false;
  return timingSafeEqual(next, current);
}

function sign(userId: string, exp: number) {
  return createHmac("sha256", sessionSecret()).update(`desk:${userId}.${exp}`).digest("base64url");
}

export function newSessionValue(userId: string) {
  const exp = Math.floor(Date.now() / 1000) + maxAgeSeconds;
  return `${userId}.${exp}.${sign(userId, exp)}`;
}

export function sessionValid(value: string | undefined) {
  if (!value || !deskConfigured()) return false;
  const [userId, expRaw, mac] = value.split(".");
  const exp = Number(expRaw);
  if (!userId || !Number.isFinite(exp) || !mac || exp < Math.floor(Date.now() / 1000)) return false;
  const expected = sign(userId, exp);
  const left = Buffer.from(mac);
  const right = Buffer.from(expected);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: maxAgeSeconds,
};
