/**
 * Shared WorkOS org used to pin AuthKit to a single tenant so users with multiple
 * memberships can skip the hosted "select an organization" step.
 *
 * Must match `WORKOS_DEFAULT_ORG_ID` documented for the OAuth callback.
 */
export function getWorkosDefaultOrganizationId(): string | undefined {
  const id = process.env.WORKOS_DEFAULT_ORG_ID;
  return id && id.length > 0 ? id : undefined;
}

/**
 * Appends `organization_id` to a WorkOS `/user_management/authorize` URL when the
 * default org is configured and the param is not already present.
 *
 * @param url - Full authorize URL from AuthKit
 */
export function withWorkosDefaultOrganizationId(url: string): string {
  const orgId = getWorkosDefaultOrganizationId();
  if (!orgId) return url;
  try {
    const parsed = new URL(url);
    if (!parsed.searchParams.has('organization_id')) {
      parsed.searchParams.set('organization_id', orgId);
    }
    return parsed.toString();
  } catch {
    return url;
  }
}
