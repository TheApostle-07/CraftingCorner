export function getAnalyticsConfig() {
  const measurementId = process.env.GA4_MEASUREMENT_ID?.trim();
  const apiSecret = process.env.GA4_MEASUREMENT_PROTOCOL_SECRET?.trim();
  return measurementId && /^G-[A-Z0-9]+$/.test(measurementId) && apiSecret
    ? { measurementId, apiSecret }
    : null;
}
