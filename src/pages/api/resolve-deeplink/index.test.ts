import { describe, expect, test, vi } from "vitest";
import {
  DEEPLINK_NO_STORE_CACHE_CONTROL,
  setDeeplinkCacheHeaders,
} from "./cache";

describe("setDeeplinkCacheHeaders", () => {
  test("disables browser and CDN caching for deeplink resolution", () => {
    const setHeader = vi.fn();

    setDeeplinkCacheHeaders({ setHeader });

    expect(setHeader).toHaveBeenCalledWith(
      "Cache-Control",
      DEEPLINK_NO_STORE_CACHE_CONTROL,
    );
    expect(setHeader).toHaveBeenCalledWith("CDN-Cache-Control", "no-store");
    expect(setHeader).toHaveBeenCalledWith(
      "Vercel-CDN-Cache-Control",
      "no-store",
    );
  });
});
