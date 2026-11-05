export async function blogRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`/api/admin/blog${path}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...options.headers,
    },
    cache: "no-store",
    signal: options.signal || AbortSignal.timeout(30000),
  }).catch((error) => {
    if (error.name === "AbortError") throw error;
    throw new Error(
      error.name === "TimeoutError"
        ? "The request timed out. Your draft is preserved; please retry."
        : "We could not reach the studio. Check your connection and retry; your draft is preserved.",
    );
  });
  const result = await response.json().catch(() => ({
    message:
      "The server could not complete this request. Your draft is preserved; please retry.",
  }));
  if (!response.ok)
    throw Object.assign(
      new Error(result.message || "The request could not be completed."),
      { status: response.status },
    );
  return result as T;
}
