import styled from "styled-components";
import { Link } from "../Link";
import { Banner } from "./Banner";

export function ManagedOracleBanner() {
  return (
    <GradientBanner>
      <span>
        Polymarket&apos;s <strong>Managed Optimistic Oracle V2</strong> contract
        is now live! Please review these new requests on the &quot;Verify&quot;
        and &quot;Propose&quot; tabs and see our{" "}
        <Link
          className="underline hover:opacity-60 transition-opacity"
          href="https://docs.uma.xyz/developers/managedoptimisticoraclev2/proposing-via-the-oracle-dapp"
        >
          docs
        </Link>{" "}
        for more information.
      </span>
    </GradientBanner>
  );
}

const GradientBanner = styled(Banner)`
  background: linear-gradient(
    80deg,
    #3c2525 0%,
    #ff4a4a 25%,
    #ff4a4a 75%,
    #eabbbb 100%
  );
`;
