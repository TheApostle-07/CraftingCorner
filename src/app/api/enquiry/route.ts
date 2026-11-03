import { NextResponse } from 'next/server';

const defaultEndpoint =
  'https://script.google.com/macros/s/AKfycbwZsbBvBYhneOx6Wev7lgY2QZwiFL5NB0TebTjQ-lFG5ZPYCzC2HmMTyQ4Lt3QiCkmu_g/exec';
export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin)
    return NextResponse.json({ ok: false }, { status: 403 });
  if (Number(request.headers.get('content-length')) > 12000)
    return NextResponse.json({ ok: false }, { status: 413 });
  try {
    const text = await request.text();
    if (text.length > 12000)
      return NextResponse.json({ ok: false }, { status: 413 });
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    if (!data || typeof data !== 'object' || Array.isArray(data))
      return NextResponse.json({ ok: false }, { status: 400 });
    const { name, email, phone = '', message } = data;
    if (data.website) return NextResponse.json({ ok: false }, { status: 400 });
    if (
      typeof name !== 'string' ||
      name.trim().length < 2 ||
      name.length > 100 ||
      typeof email !== 'string' ||
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      typeof message !== 'string' ||
      message.trim().length < 10 ||
      message.length > 4000 ||
      typeof phone !== 'string' ||
      (phone && !/^[+\d() \-]{7,20}$/.test(phone))
    )
      return NextResponse.json(
        { ok: false, message: 'Check the name, email and message.' },
        { status: 400 },
      );
    const response = await fetch(
      process.env.LEAD_WEBHOOK_URL || defaultEndpoint,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          message: message.trim(),
        }),
        signal: AbortSignal.timeout(15000),
        cache: 'no-store',
      },
    );
    const result = await response.json();
    const accepted =
      result.success === true ||
      result.ok === true ||
      result.result === 'success' ||
      result.status === 'success';
    if (!response.ok || !accepted)
      return NextResponse.json({ ok: false }, { status: 502 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, message: 'Delivery could not be confirmed.' },
      { status: 502 },
    );
  }
}
