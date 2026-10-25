import crypto from 'crypto';
import { cookies } from 'next/headers';
import { readLocalDb, writeLocalDb } from '@/lib/db';
import { isNeonConfigured, neonGet, neonSet } from '@/lib/neon';
import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase';

export const ADMIN_COOKIE_NAME = 'apple_admin_session';
const SESSION_MAX_AGE_SECONDS = 86400 * 7; // 7 days

function getSecretKey(): string {
  const adminPassword = process.env.ADMIN_PASSWORD || 'apple2026';
  // Derive a strong HMAC secret from the admin password
  return crypto.createHash('sha256').update(`apple_secret_salt_${adminPassword}`).digest('hex');
}

export interface AdminSessionPayload {
  role: 'admin';
  exp: number;
  iat: number;
}

export function createSessionToken(): string | null {
  const secret = getSecretKey();
  if (!secret) return null;

  const now = Date.now();
  const payload: AdminSessionPayload = {
    role: 'admin',
    iat: now,
    exp: now + SESSION_MAX_AGE_SECONDS * 1000,
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', secret)
    .update(payloadB64)
    .digest('base64url');

  return `${payloadB64}.${signature}`;
}

export function verifySessionToken(token: string): boolean {
  if (!token || typeof token !== 'string') return false;
  const secret = getSecretKey();
  if (!secret) return false;

  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [payloadB64, signature] = parts;
  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(payloadB64)
    .digest('base64url');

  try {
    const isSigValid = crypto.timingSafeEqual(
      Buffer.from(signature, 'utf-8'),
      Buffer.from(expectedSig, 'utf-8')
    );
    if (!isSigValid) return false;

    const payloadRaw = Buffer.from(payloadB64, 'base64url').toString('utf-8');
    const payload: AdminSessionPayload = JSON.parse(payloadRaw);

    if (payload.role !== 'admin') return false;
    if (typeof payload.exp !== 'number' || payload.exp < Date.now()) return false;

    return true;
  } catch {
    return false;
  }
}

export function getCookieOptions(isHttps?: boolean) {
  const isProduction = process.env.NODE_ENV === 'production';
  // Secure flag based on environment: HTTPS protocol or production domain with https URL
  const secure =
    isHttps !== undefined
      ? isHttps
      : Boolean(
          process.env.COOKIE_SECURE === 'true' ||
            (isProduction && process.env.NEXT_PUBLIC_APP_URL?.startsWith('https'))
        );

  return {
    httpOnly: true,
    secure,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}

export async function verifyAdminSession(req?: Request): Promise<boolean> {
  const secret = getSecretKey();
  if (!secret) return false;

  // 1. Check Authorization header (Bearer token) if provided
  if (req) {
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const bearerToken = authHeader.substring(7).trim();
      if (verifySessionToken(bearerToken)) {
        return true;
      }
    }

    // 2. Check Cookie header from request
    const cookieHeader = req.headers.get('cookie') || '';
    const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${ADMIN_COOKIE_NAME}=([^;]+)`));
    if (match && match[1]) {
      const cookieVal = decodeURIComponent(match[1]);
      if (verifySessionToken(cookieVal)) {
        return true;
      }
    }
  }

  // 3. Fallback to Next.js cookies() API
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(ADMIN_COOKIE_NAME);
    if (cookie?.value && verifySessionToken(cookie.value)) {
      return true;
    }
  } catch {
    // cookies() may throw outside Next request context
  }

  return false;
}

export function hashCustomPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

export function verifyCustomHash(password: string, hash: string, salt: string): boolean {
  try {
    const computed = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    const compBuf = Buffer.from(computed);
    const hashBuf = Buffer.from(hash);
    if (compBuf.length !== hashBuf.length) return false;
    return crypto.timingSafeEqual(compBuf, hashBuf);
  } catch {
    return false;
  }
}

export async function hasCustomAdminPassword(): Promise<boolean> {
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data } = await supabaseAdmin
        .from('store_settings')
        .select('value')
        .eq('key', 'admin_auth')
        .maybeSingle();
      if (data && data.value) {
        const val = data.value as { hash?: string; salt?: string };
        return Boolean(val.hash && val.salt);
      }
      return false;
    } catch {
      return false;
    }
  }

  if (isNeonConfigured) {
    try {
      const authData = await neonGet<{ hash?: string; salt?: string } | null>('admin_auth', null);
      if (authData && authData.hash && authData.salt) {
        return true;
      }
    } catch {
      // fallback
    }
  }
  try {
    const db = readLocalDb();
    return Boolean(db.admin_password_hash && db.admin_password_salt);
  } catch {
    return false;
  }
}

export async function setAdminPassword(newPassword: string): Promise<boolean> {
  try {
    const { hash, salt } = hashCustomPassword(newPassword);

    if (isSupabaseConfigured && supabaseAdmin) {
      const { error } = await supabaseAdmin
        .from('store_settings')
        .upsert({
          key: 'admin_auth',
          value: { hash, salt },
          updated_at: new Date().toISOString(),
        });
      if (error) {
        console.error('Failed to save custom password to Supabase:', error);
        return false;
      }
      return true;
    }

    if (isNeonConfigured) {
      await neonSet('admin_auth', { hash, salt });
    }

    const db = readLocalDb();
    db.admin_password_hash = hash;
    db.admin_password_salt = salt;
    writeLocalDb(db);
    return true;
  } catch (err) {
    console.error('Failed to set custom admin password:', err);
    return false;
  }
}

export async function verifyAdminPassword(inputPassword: string): Promise<boolean> {
  if (!inputPassword || typeof inputPassword !== 'string') {
    return false;
  }

  // 1. Check Supabase custom password
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data } = await supabaseAdmin
        .from('store_settings')
        .select('value')
        .eq('key', 'admin_auth')
        .maybeSingle();
      if (data && data.value) {
        const auth = data.value as { hash?: string; salt?: string };
        if (auth.hash && auth.salt) {
          return verifyCustomHash(inputPassword, auth.hash, auth.salt);
        }
      }
    } catch (e) {
      console.warn('Could not read custom admin password from Supabase:', e);
    }

    // If Supabase is active and has no custom password set, fall back to environment password
    const adminPassword = process.env.ADMIN_PASSWORD || 'apple2026';
    const inputBuffer = Buffer.from(inputPassword, 'utf-8');
    const actualBuffer = Buffer.from(adminPassword, 'utf-8');
    if (inputBuffer.length !== actualBuffer.length) {
      return false;
    }
    return crypto.timingSafeEqual(inputBuffer, actualBuffer);
  }

  // 2. Check Neon PostgreSQL custom password
  if (isNeonConfigured) {
    try {
      const authData = await neonGet<{ hash?: string; salt?: string } | null>('admin_auth', null);
      if (authData && authData.hash && authData.salt) {
        return verifyCustomHash(inputPassword, authData.hash, authData.salt);
      }
    } catch (e) {
      console.warn('Could not read custom admin password from Neon:', e);
    }
  }

  // 3. Check custom password saved in local DB
  try {
    const db = readLocalDb();
    if (db.admin_password_hash && db.admin_password_salt) {
      return verifyCustomHash(inputPassword, db.admin_password_hash, db.admin_password_salt);
    }
  } catch (e) {
    console.warn('Could not read custom admin password from local:', e);
  }

  // 4. Fallback to environment variable or initial default 'apple2026' ONLY IF no custom password is set
  const adminPassword = process.env.ADMIN_PASSWORD || 'apple2026';
  const inputBuffer = Buffer.from(inputPassword, 'utf-8');
  const actualBuffer = Buffer.from(adminPassword, 'utf-8');

  if (inputBuffer.length !== actualBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(inputBuffer, actualBuffer);
}
