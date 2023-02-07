import { getValueText } from "@/helpers";
import { OracleQueryUI } from "@/types";
import { LivenessProgressBar } from "../LivenessProgressBar";
import { TD } from "./style";

export function VerifyCells({
  price,
  assertion,
  timeMilliseconds,
  livenessEndsMilliseconds,
}: OracleQueryUI) {
  const proposedValue = getValueText({ price, assertion });

  return (
    <>
      <TD>{proposedValue}</TD>
      <TD>
        <LivenessProgressBar
          startTime={timeMilliseconds}
          endTime={livenessEndsMilliseconds}
        />
      </TD>
    </>
  );
}
