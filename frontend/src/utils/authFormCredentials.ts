/**
 * Encode auth payloads as application/x-www-form-urlencoded.
 * Production reverse-proxies currently drop JSON bodies on several Roots hosts
 * while form bodies parse correctly in Nest ValidationPipe.
 */
export function encodeAuthFormBody(
  payload: Record<string, string | undefined | null>,
): URLSearchParams {
  const params = new URLSearchParams();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    params.set(key, String(value));
  });
  return params;
}

/**
 * Read login credentials from the live form DOM.
 * Browser password-managers / autofill often fill inputs without firing React
 * onChange, so React state and react-hook-form can still be empty on submit.
 * FormData + input.value are the source of truth at submit time.
 */
export function readLoginCredentials(form: HTMLFormElement): {
  email: string;
  password: string;
} {
  const data = new FormData(form);
  const emailInput =
    (form.elements.namedItem("email") as HTMLInputElement | null) ||
    form.querySelector<HTMLInputElement>('input[type="email"]');
  const passwordInput =
    (form.elements.namedItem("password") as HTMLInputElement | null) ||
    form.querySelector<HTMLInputElement>('input[type="password"]');

  const email = String(
    data.get("email") ?? emailInput?.value ?? "",
  )
    .trim()
    .toLowerCase();
  const password = String(
    data.get("password") ?? passwordInput?.value ?? "",
  );

  return { email, password };
}

/** Normalize Nest/Axios auth error payloads into a single user-facing string. */
export function formatAuthApiError(err: unknown, fallback: string): string {
  const anyErr = err as {
    userMessage?: unknown;
    message?: unknown;
    response?: { data?: { message?: unknown } };
  };
  const raw =
    anyErr?.userMessage ??
    anyErr?.response?.data?.message ??
    anyErr?.message;
  if (Array.isArray(raw)) {
    const joined = raw.map((part) => String(part || "").trim()).filter(Boolean).join(", ");
    return joined || fallback;
  }
  if (typeof raw === "string" && raw.trim()) return raw.trim();
  return fallback;
}
