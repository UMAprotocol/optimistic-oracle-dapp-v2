import { Link } from "../Link";
import { Banner } from "./Banner";

const linkClassName = "underline hover:opacity-60 transition-opacity";

export function SunsetBanner() {
  return (
    <Banner>
      <span>
        <strong>This site will be taken down on November 16th, 2026.</strong>
        <br />
        Polymarket, Predict.fun, and Risk Labs Polygon requests can be viewed at
        the new{" "}
        <Link className={linkClassName} href="https://explorer.uma.xyz/">
          explorer.uma.xyz
        </Link>{" "}
        site. Legacy OO requests not served by the Explorer can be viewed
        onchain or by forking our open source Oracle dapp{" "}
        <Link
          className={linkClassName}
          href="https://github.com/UMAprotocol/optimistic-oracle-dapp-v2"
        >
          repo
        </Link>
        .
      </span>
    </Banner>
  );
}
