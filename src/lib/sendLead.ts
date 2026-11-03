export async function sendLead(
  name: string,
  email: string,
  phone: string,
  message = '',
  website = '',
) {
  try {
    const response = await fetch('/api/enquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, message, website }),
      signal: AbortSignal.timeout(20000),
    });
    const payload = await response.json();
    return response.ok && payload.ok === true;
  } catch {
    return false;
  }
}
