import { Link } from "../Link";
import { Banner } from "./Banner";

export function ManagedOracleBanner() {
  return (
    <Banner>
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
    </Banner>
  );
}
