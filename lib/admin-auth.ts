import crypto from 'crypto';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const COOKIE_NAME = 'qt_admin_session';
const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function getAdminEmail(): string {
  return (process.env.ADMIN_EMAIL || 'admin@quangtri.wiki').trim().toLowerCase();
}

function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || 'quangtri2026';
}

function getSessionSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    'qt-admin-session-secret-v2'
  );
}

export function isUsingDefaultAdminPassword(): boolean {
  return !process.env.ADMIN_PASSWORD;
}

function sha256Buffer(value: string): Buffer {
  return crypto.createHash('sha256').update(value, 'utf8').digest();
}

export function validateAdminCredentials(email: string, password: string): boolean {
  if (!email || !password) return false;
  const inputEmailHash = sha256Buffer(email.trim().toLowerCase());
  const expectedEmailHash = sha256Buffer(getAdminEmail());
  const emailValid = crypto.timingSafeEqual(inputEmailHash, expectedEmailHash);

  const inputPassHash = sha256Buffer(password);
  const expectedPassHash = sha256Buffer(getAdminPassword());
  const passwordValid = crypto.timingSafeEqual(inputPassHash, expectedPassHash);

  return emailValid && passwordValid;
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  if (!password || !storedHash || !storedHash.includes(':')) return false;
  const [salt, keyHex] = storedHash.split(':');
  if (!salt || !keyHex) return false;
  try {
    const keyBuf = Buffer.from(keyHex, 'hex');
    const derivedBuf = crypto.scryptSync(password, salt, 64);
    if (keyBuf.length !== derivedBuf.length) return false;
    return crypto.timingSafeEqual(keyBuf, derivedBuf);
  } catch {
    return false;
  }
}

function signPayload(encodedPayload: string): string {
  return crypto
    .createHmac('sha256', getSessionSecret())
    .update(encodedPayload)
    .digest('base64url');
}

export interface AdminSessionInfo {
  email: string;
  role: 'admin' | 'editor';
  name: string;
}

export function createAdminSessionToken(
  email: string,
  role: 'admin' | 'editor' = 'admin',
  name = 'Quản trị viên'
): string {
  const payload = {
    email: email.trim().toLowerCase(),
    role,
    name,
    exp: Date.now() + SESSION_TTL_MS,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const signature = signPayload(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export function verifyAdminSessionToken(token?: string | null): AdminSessionInfo | null {
  if (!token || typeof token !== 'string') return null;
  const dotIdx = token.indexOf('.');
  if (dotIdx <= 0) return null;

  const encodedPayload = token.slice(0, dotIdx);
  const signature = token.slice(dotIdx + 1);
  if (!encodedPayload || !signature) return null;

  const expectedSignature = signPayload(encodedPayload);
  const sigBuf = Buffer.from(signature, 'utf8');
  const expectedBuf = Buffer.from(expectedSignature, 'utf8');
  if (sigBuf.length !== expectedBuf.length) return null;
  if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return null;

  try {
    const parsed = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
    if (!parsed?.email || typeof parsed?.exp !== 'number') return null;
    if (parsed.exp <= Date.now()) return null;
    return {
      email: String(parsed.email),
      role: parsed.role === 'editor' ? 'editor' : 'admin',
      name: String(parsed.name || 'Quản trị viên'),
    };
  } catch {
    return null;
  }
}

export async function getAdminSession(req?: NextRequest): Promise<AdminSessionInfo | null> {
  if (req) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    return verifyAdminSessionToken(token);
  }
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return verifyAdminSessionToken(token);
}

export function requireAdmin(req: NextRequest): NextResponse | null {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const session = verifyAdminSessionToken(token);
  if (!session) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Vui lòng đăng nhập quyền Quản trị viên.' },
      { status: 401 }
    );
  }
  return null;
}
