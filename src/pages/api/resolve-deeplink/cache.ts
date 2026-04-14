import type { NextApiResponse } from "next";

export const DEEPLINK_NO_STORE_CACHE_CONTROL =
  "private, no-store, no-cache, max-age=0, must-revalidate";

export function setDeeplinkCacheHeaders(
  res: Pick<NextApiResponse, "setHeader">,
) {
  // Deeplink resolution depends on query params like transactionHash and
  // eventIndex. Avoid HTTP/CDN reuse and rely on client-side query caching.
  res.setHeader("Cache-Control", DEEPLINK_NO_STORE_CACHE_CONTROL);
  res.setHeader("CDN-Cache-Control", "no-store");
  res.setHeader("Vercel-CDN-Cache-Control", "no-store");
}
