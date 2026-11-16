import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import DeprecatedPage from "./page";

describe("DeprecatedPage", () => {
  const html = renderToStaticMarkup(<DeprecatedPage />);

  it("shows the deprecation message", () => {
    expect(html).toContain(
      "This webpage has been deprecated and replaced by the new",
    );
    expect(html).toContain("for more information.");
  });

  it("links to the Explorer and the docs", () => {
    expect(html).toContain('<a href="https://explorer.uma.xyz/">Explorer</a>');
    expect(html).toMatch(/<a href="https:\/\/docs\.uma\.xyz\/[^"]*">docs<\/a>/);
  });
});
