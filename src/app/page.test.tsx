import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import DeprecatedPage from "./page";

describe("DeprecatedPage", () => {
  const html = renderToStaticMarkup(<DeprecatedPage />);

  it("shows the deprecation message", () => {
    expect(html).toContain(
      "This webpage has been deprecated and replaced by the new",
    );
  });

  it("links to the Explorer and oracle requests", () => {
    expect(html).toContain('<a href="https://explorer.uma.xyz/">Explorer</a>');
    expect(html).toContain(
      '<a href="https://explorer.uma.xyz/requests">oracle requests</a>',
    );
  });
});
