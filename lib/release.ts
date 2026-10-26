/**
 * Indexing is explicitly opt-in and requires a canonical HTTPS origin.
 * Production deployments alone do not authorize a public launch.
 */
export function canonicalOrigin(env: Record<string, string | undefined> = process.env): string | null {
  const raw = env.FITMATCH_PUBLIC_ORIGIN;
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" || url.username || url.password || url.port ||
        url.pathname !== "/" || url.search || url.hash ||
        !url.hostname.includes(".") || url.hostname === "localhost") return null;
    return url.origin;
  } catch {
    return null;
  }
}

export function publicLaunchEnabled(env: Record<string, string | undefined> = process.env): boolean {
  return env.FITMATCH_PUBLIC_LAUNCH === "true" && canonicalOrigin(env) !== null;
}
