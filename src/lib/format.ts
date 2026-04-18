export function formatEur(value: number, opts: { compact?: boolean } = {}) {
  if (opts.compact) {
    return new Intl.NumberFormat("en-EU", {
      style: "currency",
      currency: "EUR",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  }
  return new Intl.NumberFormat("en-EU", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number, opts: { compact?: boolean } = {}) {
  if (opts.compact) {
    return new Intl.NumberFormat("en-EU", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  }
  return new Intl.NumberFormat("en-EU").format(value);
}

export function formatDate(iso: string | null | undefined, opts: Intl.DateTimeFormatOptions = {}) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...opts,
  }).format(d);
}

export function formatDateRange(startIso: string | null | undefined, endIso: string | null | undefined) {
  const s = formatDate(startIso, { month: "short", year: "numeric" });
  const e = formatDate(endIso, { month: "short", year: "numeric" });
  return e === "—" ? s : `${s} – ${e}`;
}

export function daysUntil(iso: string) {
  const ms = new Date(iso).getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export function relativeDeadline(iso: string) {
  const d = daysUntil(iso);
  if (d < 0) return "Closed";
  if (d === 0) return "Closes today";
  if (d === 1) return "Closes tomorrow";
  if (d < 30) return `${d} days left`;
  if (d < 60) return `${Math.floor(d / 7)} weeks left`;
  return `${Math.floor(d / 30)} months left`;
}
