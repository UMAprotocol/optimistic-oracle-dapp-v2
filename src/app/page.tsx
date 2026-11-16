const EXPLORER_URL = "https://explorer.uma.xyz/";
const REQUESTS_URL = "https://explorer.uma.xyz/requests";

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
        This webpage has been deprecated and replaced by the new{" "}
        <a href={EXPLORER_URL}>Explorer</a> page. View{" "}
        <a href={REQUESTS_URL}>oracle requests</a>.
      </p>
    </main>
  );
}
