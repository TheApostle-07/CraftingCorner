// src/lib/sendLead.ts
/**
 * Push a lead to the Google Apps Script endpoint.
 * We send the request in `no‑cors` mode so the browser skips CORS checks.
 * The response is therefore *opaque* (status 0, `ok === false`) so we can’t
 * inspect it – reaching the `await` without throwing is taken as success.
 */
export async function sendLead(
  name: string,
  email: string,
  phone: string
): Promise<boolean> {
  try {
    await fetch(
      'https://script.google.com/macros/s/AKfycbwZsbBvBYhneOx6Wev7lgY2QZwiFL5NB0TebTjQ-lFG5ZPYCzC2HmMTyQ4Lt3QiCkmu_g/exec',
      {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone })
      }
    );

    // If we reach here, the request left the browser successfully.
    return true;
  } catch (err) {
    console.error('Lead send failed:', err);
    return false;
  }
}
