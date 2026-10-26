/**
 * Affiliate redirects are fail-closed. Hosts must be explicitly approved via
 * FITMATCH_LINKWISE_HOSTS; no wildcard, subdomain, or suffix matching.
 */
export function approvedTrackingHosts(value: string | undefined): ReadonlySet<string> {
  return new Set((value ?? "").split(",").map(x => x.trim().toLowerCase()).filter(x =>
    /^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/.test(x) && !x.includes("..")
  ));
}

export function validatedTrackingUrl(value: string, hosts: ReadonlySet<string>): URL | null {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password || url.port ||
        !hosts.has(url.hostname.toLowerCase())) return null;
    return url;
  } catch {
    return null;
  }
}
