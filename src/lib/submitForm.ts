import { business } from "@/data/business";

export type FieldErrors = Record<string, string>;
export type SubmitResult = { success: boolean; message: string; errors?: FieldErrors; status?: number; data?: Record<string, unknown> };

const FALLBACK = `Sorry, we couldn't send that. Please try again, or call us on ${business.phone.display}.`;

/** POSTs FormData to a PHP endpoint and always resolves to a usable result (never throws). */
export async function submitForm(endpoint: string, body: FormData, timeoutMs = 45_000): Promise<SubmitResult> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      body,
      headers: { Accept: "application/json" },
      credentials: "same-origin",
      signal: ctrl.signal,
    });
    let json: unknown = null;
    try {
      json = await res.json();
    } catch {
      /* non-JSON (e.g. a 404 page or a proxy error) */
    }
    if (json && typeof json === "object" && "success" in json) {
      const j = json as Record<string, unknown>;
      const errors =
        j.errors && typeof j.errors === "object"
          ? Object.fromEntries(Object.entries(j.errors as Record<string, unknown>).filter(([, v]) => typeof v === "string")) as FieldErrors
          : undefined;
      return {
        success: j.success === true,
        message: typeof j.message === "string" && j.message ? j.message : FALLBACK,
        errors,
        status: res.status,
        data: j,
      };
    }
    if (res.status === 413) {
      return { success: false, message: "Your photos are too large to send. Please use smaller images (max 5MB each)." };
    }
    return { success: false, message: FALLBACK };
  } catch (err) {
    const aborted = err instanceof DOMException && err.name === "AbortError";
    return {
      success: false,
      message: aborted ? `The request took too long. Please check your connection and try again, or call us on ${business.phone.display}.` : FALLBACK,
    };
  } finally {
    clearTimeout(timer);
  }
}
