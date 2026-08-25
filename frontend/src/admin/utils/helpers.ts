export const classNames = (...args: any[]) => args.filter(Boolean).join(" ");

export const formatDate = (iso: any) => {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString();
  } catch {
    return iso;
  }
};
