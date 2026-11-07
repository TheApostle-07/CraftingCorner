import { z } from "zod";
import { getAnalyticsConfig } from "@/lib/analytics.server";

const clientId = z.uuid();
const conversion = z.discriminatedUnion("event", [
  z.strictObject({ event: z.literal("whatsapp_click"), clientId }),
  z.strictObject({
    event: z.literal("generate_lead"),
    clientId,
    formKind: z.enum(["contact", "callback"]),
  }),
]);

export async function POST(request: Request) {
  const config = getAnalyticsConfig();
  if (!config) return new Response(null, { status: 404 });
  if (request.headers.get("sec-fetch-site") !== "same-origin")
    return new Response(null, { status: 403 });
  if (request.headers.get("content-type") !== "application/json")
    return new Response(null, { status: 415 });
  if (Number(request.headers.get("content-length")) > 512)
    return new Response(null, { status: 413 });

  let body: unknown;
  try {
    const text = await request.text();
    if (text.length > 512) return new Response(null, { status: 413 });
    body = JSON.parse(text);
  } catch {
    return new Response(null, { status: 400 });
  }
  const parsed = conversion.safeParse(body);
  if (!parsed.success) return new Response(null, { status: 400 });

  const event = parsed.data;
  const endpoint = new URL("https://www.google-analytics.com/mp/collect");
  endpoint.search = new URLSearchParams({
    measurement_id: config.measurementId,
    api_secret: config.apiSecret,
  }).toString();
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        client_id: event.clientId,
        consent: { ad_user_data: "DENIED", ad_personalization: "DENIED" },
        events: [
          {
            name: event.event,
            params:
              event.event === "generate_lead"
                ? { form_kind: event.formKind }
                : {},
          },
        ],
      }),
      signal: AbortSignal.timeout(2500),
      cache: "no-store",
    });
    if (response.ok) return new Response(null, { status: 204 });
  } catch {
    // Measurement is optional and independent of enquiry delivery.
  }
  return new Response(null, { status: 502 });
}
