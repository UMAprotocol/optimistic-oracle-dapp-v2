import type { OracleQueryUI } from "@/types";
import { ChainIcon } from "./ChainIcon";
import { ExpiryTypeIcon } from "./ExpiryTypeIcon";
import { OoTypeIcon } from "./OoTypeIcon";

export function InfoIcons({ chainId, oracleType, expiryType }: OracleQueryUI) {
  return (
    <div className="flex flex-wrap gap-3 mt-5 px-page-padding lg:px-7 mb-11">
      <ChainIcon chainId={chainId} />
      <OoTypeIcon ooType={oracleType} />
      {expiryType && <ExpiryTypeIcon expiryType={expiryType} />}
    </div>
  );
}
