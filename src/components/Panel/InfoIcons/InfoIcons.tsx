import type { OracleQueryUI } from "@/types";
import { ChainIcon } from "./ChainIcon";
import { ExpiryTypeIcon } from "./ExpiryTypeIcon";
import { OoTypeIcon } from "./OoTypeIcon";
import { ProjectTag } from "./ProjectTag";

export function InfoIcons({
  chainId,
  oracleType,
  expiryType,
  project,
}: OracleQueryUI) {
  return (
    <div className="flex flex-wrap gap-3 mt-5 px-page-padding lg:px-7 mb-11">
      <ProjectTag project={project} />
      <ChainIcon chainId={chainId} />
      <OoTypeIcon ooType={oracleType} />
      {expiryType && <ExpiryTypeIcon expiryType={expiryType} />}
    </div>
  );
}
