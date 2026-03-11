import { createHash, timingSafeEqual } from 'node:crypto';

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const ADMIN_SESSION_COOKIE = 'crafting_corner_admin_session';

const SESSION_MAX_AGE = 60 * 60 * 24 * 14;

function getAdminUsername() {
  return process.env.ADMIN_USERNAME || 'admin';
}

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || '';
}

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || '';
}

function safeCompare(left: string, right: string) {
  if (!left || !right) {
    return false;
  }

  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function getSessionToken() {
  return createHash('sha256')
    .update(`${getAdminUsername()}:${getAdminPassword()}:${getSessionSecret()}`)
    .digest('hex');
}

export function isAdminConfigured() {
  return Boolean(getAdminPassword() && getSessionSecret());
}

export function getAdminConfigurationNote() {
  if (isAdminConfigured()) {
    return 'Admin credentials are configured on the server.';
  }

  return 'Set ADMIN_PASSWORD and ADMIN_SESSION_SECRET before using the admin login. ADMIN_USERNAME is optional and defaults to "admin".';
}

export function verifyAdminCredentials(username: string, password: string) {
  if (!isAdminConfigured()) {
    return false;
  }

  return (
    safeCompare(username, getAdminUsername()) &&
    safeCompare(password, getAdminPassword())
  );
}

export async function isAdminAuthenticated() {
  if (!isAdminConfigured()) {
    return false;
  }

  const cookieStore = await cookies();
  const sessionValue = cookieStore.get(ADMIN_SESSION_COOKIE)?.value || '';

  return safeCompare(sessionValue, getSessionToken());
}

export function attachAdminSession(response: NextResponse) {
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: getSessionToken(),
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
}

export function clearAdminSession(response: NextResponse) {
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
}
