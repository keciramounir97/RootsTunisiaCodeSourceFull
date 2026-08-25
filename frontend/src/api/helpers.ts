import { api } from "./client";

/** Normalize tree from API (snake_case → camelCase, add hasGedcom, gedcomUrl, owner) */
export const normalizeTree = (tree: any, options?: { apiRoot?: string; isPublic?: boolean }) => {
  if (!tree) return tree;
  const baseUrl = options?.apiRoot ?? "";
  const isPublic = options?.isPublic ?? (tree.is_public ?? tree.isPublic ?? false);
  const ownerRaw = tree.owner ?? tree.owner_name ?? "";
  const owner =
    ownerRaw && typeof ownerRaw === "object"
      ? ownerRaw.full_name ?? ownerRaw.fullName ?? ownerRaw.email ?? ""
      : ownerRaw ?? "";
  const hasGedcom = !!(tree.gedcom_path ?? tree.gedcomPath);
  // True once the tree's full GEDCOM content is stored in the database (survives
  // even if the uploads folder is wiped), reported by the backend listings.
  const hasGedcomBackup = Boolean(
    (tree as any).has_gedcom_backup ?? (tree as any).hasGedcomBackup,
  );
  const gedcomPath = hasGedcom
    ? (isPublic ? `/api/trees/${tree.id}/gedcom` : `/api/my/trees/${tree.id}/gedcom`)
    : null;
  const gedcomUrl = gedcomPath ? (baseUrl ? `${baseUrl}${gedcomPath}` : gedcomPath) : null;
  return {
    ...tree,
    id: tree.id,
    title: tree.title ?? "",
    description: tree.description ?? "",
    category: tree.category ?? "",
    archiveSource: tree.archive_source ?? tree.archiveSource ?? "",
    documentCode: tree.document_code ?? tree.documentCode ?? "",
    isPublic: !!isPublic,
    hasGedcom,
    hasGedcomBackup,
    gedcomUrl,
    owner,
    createdAt: tree.created_at ?? tree.createdAt,
    data_format: tree.data_format ?? tree.dataFormat,
  };
};

export const GEDCOM_REUPLOAD_MESSAGE =
  "Original GEDCOM file is missing on the server. Re-upload or restore the GEDCOM file for this tree to load the full visualizer.";

export const getGedcomLoadErrorMessage = (
  status?: number,
  body?: string,
  fallback = "Failed to load tree.",
) => {
  const normalized = String(body || "").toLowerCase();
  if (
    status === 404 ||
    normalized.includes("gedcom file missing") ||
    normalized.includes("gedcom upload not found")
  ) {
    return GEDCOM_REUPLOAD_MESSAGE;
  }
  return body?.trim() || fallback;
};

export const getApiRoot = () => {
  const base = String(api.defaults.baseURL || "");
  return base.replace(/\/api\/?$/, "");
};

export const shouldFallbackRoute = (error: any) => {
  const status = error?.response?.status;
  return status === 404 || status === 405 || status === 501;
};

export const requestWithFallback = async (requests: any[], shouldFallback = shouldFallbackRoute) => {
  let lastError;
  for (const request of requests) {
    try {
      return await request();
    } catch (err) {
      lastError = err;
      if (!shouldFallback(err)) break;
    }
  }
  throw lastError;
};

export const getApiErrorMessage = (error: any, fallback = "Operation failed", overrides: any = {}) => {
  const status = error?.response?.status;
  let serverMessage =
    error?.response?.data?.message || error?.response?.data?.error;
  if (!serverMessage && typeof error?.response?.data === "string") {
    try {
      const parsed = JSON.parse(error.response.data);
      serverMessage = parsed?.message || parsed?.error;
    } catch {
      // leave serverMessage falsy
    }
  }

  if (error?.code === "AUTH_MISSING") {
    return overrides.unauthorized || "Please log in to continue.";
  }
  if (status === 401) {
    return (
      overrides.unauthorized ||
      serverMessage ||
      "Session expired. Please log in again."
    );
  }
  if (status === 403) {
    return (
      overrides.forbidden ||
      serverMessage ||
      "You do not have permission to perform this action."
    );
  }
  if (status === 404) {
    return (
      overrides.notFound ||
      serverMessage ||
      "Resource not found. The tree or GEDCOM file may be missing."
    );
  }
  if (status === 413) {
    return overrides.tooLarge || serverMessage || "File is too large.";
  }
  if (status === 415) {
    return overrides.unsupported || serverMessage || "Unsupported file type.";
  }
  if (status === 422) {
    return overrides.invalid || serverMessage || "Invalid data provided.";
  }
  if (status === 503) {
    return (
      overrides.unavailable ||
      serverMessage ||
      "Service unavailable. Please try again later."
    );
  }
  if (error?.code === "ERR_NETWORK") {
    return overrides.network || "Network error. Please try again.";
  }

  return serverMessage || fallback;
};
