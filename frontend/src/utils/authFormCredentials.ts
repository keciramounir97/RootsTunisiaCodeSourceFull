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

const KNOWN_AUTH_ERROR_KEYS: Array<{
  pattern: RegExp;
  key: string;
  defaultText: string;
}> = [
  {
    pattern: /invalid credentials|unauthorized|status code 401/i,
    key: "invalid_credentials",
    defaultText: "Invalid credentials. Please check your email and password.",
  },
  {
    pattern: /pending validation/i,
    key: "auth_error_account_pending",
    defaultText: "Your account is awaiting administrator approval.",
  },
  {
    pattern: /not allowed to log in|banned|rejected/i,
    key: "auth_error_account_blocked",
    defaultText: "This account is not permitted to sign in. Please contact support.",
  },
  {
    pattern: /permanently removed/i,
    key: "auth_error_account_removed",
    defaultText: "This account has been permanently removed.",
  },
  {
    pattern: /database service is temporarily unavailable|status code 503/i,
    key: "auth_error_service_unavailable",
    defaultText: "Service temporarily unavailable. Please try again shortly.",
  },
  {
    pattern: /invalid user data received/i,
    key: "login_failed_no_user",
    defaultText: "Login failed: No user data received",
  },
  {
    pattern: /too many requests|throttl|status code 429/i,
    key: "auth_error_rate_limit",
    defaultText: "Too many sign-in attempts. Please wait a moment and try again.",
  },
  {
    pattern: /network error|failed to fetch|timeout/i,
    key: "auth_error_network",
    defaultText: "Network error. Please check your connection and try again.",
  },
  {
    pattern: /email must be an email|valid email|email is required/i,
    key: "valid_email_required",
    defaultText: "Valid email is required",
  },
  {
    pattern: /email already registered|already exists/i,
    key: "auth_error_email_already_registered",
    defaultText: "An account is already registered with this email.",
  },
  {
    pattern: /full name is required|full_name should not be empty/i,
    key: "name_required",
    defaultText: "Full name is required",
  },
  {
    pattern: /at least 6 characters|longer than or equal to 6/i,
    key: "password_min_6",
    defaultText: "Password must be at least 6 characters",
  },
  {
    pattern: /at least 18 years old/i,
    key: "auth_error_underage",
    defaultText: "You must be at least 18 years old to register.",
  },
  {
    pattern: /invalid or expired reset code/i,
    key: "auth_error_reset_code_expired",
    defaultText: "This reset code is invalid or has expired. Please request a new one.",
  },
  {
    pattern: /invalid reset code/i,
    key: "auth_error_reset_code_invalid",
    defaultText: "The verification code is incorrect. Please check and try again.",
  },
  {
    pattern: /email,\s*code,\s*and new password are required/i,
    key: "auth_error_reset_fields_required",
    defaultText: "Email, verification code, and new password are required.",
  },
  {
    pattern: /password is required|password should not be empty/i,
    key: "password_required",
    defaultText: "Password is required",
  },
];

/** Translate known backend, Axios, or client-side auth error strings using active locale. */
export function translateAuthErrorMessage(
  rawMessage: string,
  t: (key: string, fallback?: string) => string,
  fallback: string,
): string {
  const clean = String(rawMessage || "").trim();
  if (!clean) return fallback;
  for (const entry of KNOWN_AUTH_ERROR_KEYS) {
    if (entry.pattern.test(clean)) {
      return t(entry.key, entry.defaultText);
    }
  }
  return clean;
}
