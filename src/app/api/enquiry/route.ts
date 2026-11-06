import { NextResponse } from 'next/server';

const defaultEndpoint =
  'https://script.google.com/macros/s/AKfycbwZsbBvBYhneOx6Wev7lgY2QZwiFL5NB0TebTjQ-lFG5ZPYCzC2HmMTyQ4Lt3QiCkmu_g/exec';
const maxBodyBytes = 24 * 1024;
const unconfirmed = 'Delivery could not be confirmed.';

function error(message: string, status: number) {
  return NextResponse.json({ ok: false, message }, { status });
}

async function readBody(request: Request) {
  if (!request.body) return '';
  const reader = request.body.getReader();
  const decoder = new TextDecoder('utf-8', { fatal: true });
  let bytes = 0;
  let text = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) return text + decoder.decode();
      bytes += value.byteLength;
      if (bytes > maxBodyBytes) {
        void reader.cancel().catch(() => {});
        return null;
      }
      text += decoder.decode(value, { stream: true });
    }
  } finally {
    reader.releaseLock();
  }
}

function sheetText(value: string) {
  return value.startsWith('=') ? `'${value}` : value;
}

function acknowledged(result: unknown) {
  if (!result || typeof result !== 'object') return false;
  const {
    success,
    ok,
    result: outcome,
    status,
  } = result as Record<string, unknown>;
  if (success === false || ok === false) return false;
  return (
    success === true ||
    ok === true ||
    outcome === 'success' ||
    status === 'success'
  );
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  const requestUrl = new URL(request.url);
  const host = request.headers.get('host');
  // Next.js can normalise the URL to localhost while preserving the browser's Host.
  const hostOrigin = host ? `${requestUrl.protocol}//${host}` : requestUrl.origin;
  if (origin && origin !== requestUrl.origin && origin !== hostOrigin) {
    return error('Submit the enquiry from the Crafting Corner website.', 403);
  }
  if (
    request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !==
    'application/json'
  ) {
    return error('The enquiry format is invalid.', 415);
  }
  if (Number(request.headers.get('content-length')) > maxBodyBytes) {
    return error('Your enquiry is too long.', 413);
  }

  let data: unknown;
  try {
    const text = await readBody(request);
    if (text === null) return error('Your enquiry is too long.', 413);
    data = JSON.parse(text);
  } catch {
    return error('The enquiry format is invalid.', 400);
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return error('The enquiry format is invalid.', 400);
  }

  const input = data as Record<string, unknown>;
  const { kind = 'contact', submissionId } = input;
  if ((kind !== 'contact' && kind !== 'callback') || input.website) {
    return error('The enquiry format is invalid.', 400);
  }

  const name = typeof input.name === 'string' ? input.name.trim() : '';
  const email = typeof input.email === 'string' ? input.email.trim() : '';
  const phone = typeof input.phone === 'string' ? input.phone.trim() : '';
  const message =
    kind === 'callback'
      ? 'Callback requested from the Crafting Corner homepage.'
      : typeof input.message === 'string'
        ? input.message.trim()
        : '';

  if (name.length < 2 || name.length > 100) {
    return error('Enter a name between 2 and 100 characters.', 400);
  }
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return error('Enter a valid email address.', 400);
  }
  const digits = phone.replace(/\D/g, '');
  const phoneRequired = kind === 'callback' || Boolean(phone);
  if (
    (input.phone !== undefined && typeof input.phone !== 'string') ||
    (phoneRequired &&
      (phone.length > 25 ||
        !/^\+?[\d() -]+$/.test(phone) ||
        digits.length < 7 ||
        digits.length > 15))
  ) {
    return error('Enter a valid phone number with 7 to 15 digits.', 400);
  }
  if (message.length < 10 || message.length > 4000) {
    return error('Enter a message between 10 and 4,000 characters.', 400);
  }
  if (
    submissionId !== undefined &&
    (typeof submissionId !== 'string' ||
      !/^[a-f\d]{8}(?:-[a-f\d]{4}){3}-[a-f\d]{12}$/i.test(submissionId))
  ) {
    return error('The enquiry format is invalid.', 400);
  }

  const body = new URLSearchParams({
    name: sheetText(name),
    email: sheetText(email),
    phone,
    message: sheetText(message),
    source: kind,
    submissionId:
      typeof submissionId === 'string' ? submissionId : crypto.randomUUID(),
  });
  const signal = AbortSignal.timeout(15000);
  try {
    const response = await fetch(
      process.env.LEAD_WEBHOOK_URL?.trim() || defaultEndpoint,
      {
        method: 'POST',
        body,
        signal,
        cache: 'no-store',
      },
    );
    if (!response.ok || !acknowledged(await response.json())) {
      return error(unconfirmed, 502);
    }
    return NextResponse.json({ ok: true });
  } catch {
    return error(unconfirmed, signal.aborted ? 504 : 502);
  }
}
