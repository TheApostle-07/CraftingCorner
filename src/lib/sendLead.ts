// src/lib/sendLead.ts
export async function sendLead(
  name: string,
  email: string,
  phone: string,
  message = ''
) {
  const body = new URLSearchParams({ name, email, phone, message });
  const bodyString = body.toString();

  try {
    const res = await fetch(
      'https://script.google.com/macros/s/AKfycbwZsbBvBYhneOx6Wev7lgY2QZwiFL5NB0TebTjQ-lFG5ZPYCzC2HmMTyQ4Lt3QiCkmu_g/exec',
      {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, // ← “simple” header
        body: bodyString,
      }
    );

    return true; // fetch succeeded (response is opaque in no‑cors mode)
  } catch (err) {
    console.error('Lead send failed:', err);
    return false;
  }
}
