export type LeadKind = 'contact' | 'callback';

type LeadDetails = {
  kind: LeadKind;
  name: string;
  email: string;
  phone: string;
  message: string;
  website: string;
  submissionId?: string;
};

const deliveryError =
  'We couldn’t confirm delivery. Your details are still here. Please try again or use one of our other contact options.';

export async function sendLead(
  details: LeadDetails,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch('/api/enquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(details),
      signal: controller.signal,
    });
    const payload = await response.json();
    if (response.ok && payload?.ok === true) return { ok: true };
    if (response.status === 400 && typeof payload?.message === 'string') {
      return { ok: false, message: payload.message };
    }
  } catch {
    return { ok: false, message: deliveryError };
  } finally {
    clearTimeout(timeout);
  }
  return { ok: false, message: deliveryError };
}
