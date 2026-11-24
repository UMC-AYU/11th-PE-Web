export function getMemberIdFromToken(accessToken: string | null): string | null {
  const payload = accessToken?.split(".")[1];
  if (!payload) return null;

  try {
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const bytes = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
    const claims = JSON.parse(new TextDecoder().decode(bytes)) as {
      sub?: unknown;
    };

    return typeof claims.sub === "string" && /^[1-9]\d*$/.test(claims.sub)
      ? claims.sub
      : null;
  } catch {
    return null;
  }
}