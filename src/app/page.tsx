const EXPLORER_URL = "https://explorer.uma.xyz/";
// TODO: placeholder — replace with the docs page about the Explorer / this
// deprecation before merging.
const DOCS_URL = "https://docs.uma.xyz/";

// Every path on this site is rewritten to this page (see next.config.js), so
// old deeplinks with query params land here too.
export default function DeprecatedPage() {
  return (
    <main
      style={{
        maxWidth: 640,
        margin: "0 auto",
        padding: "96px 24px",
        fontSize: 18,
        lineHeight: 1.6,
      }}
    >
      <p>
        This webpage has been deprecated. Polygon MOOV2 and legacy Polymarket
        OOV2 requests can be viewed on the new{" "}
        <a href={EXPLORER_URL}>Explorer</a> page. See our{" "}
        <a href={DOCS_URL}>docs</a> for more information.
      </p>
    </main>
  );
}
