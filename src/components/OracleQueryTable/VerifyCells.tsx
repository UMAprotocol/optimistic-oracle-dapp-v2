import type { OracleQueryUI } from "@/types";
import { LivenessProgressBar } from "../LivenessProgressBar";
import { TD, Text } from "./style";

export function VerifyCells({
  valueText,
  timeMilliseconds,
  livenessEndsMilliseconds,
  disputeHash,
}: OracleQueryUI) {
  return (
    <>
      <TD>
        <Text>{valueText}</Text>
      </TD>
      {disputeHash && <TD>Disputed</TD>}
      {!disputeHash &&
      livenessEndsMilliseconds !== undefined &&
      timeMilliseconds !== undefined ? (
        <TD>
          <LivenessProgressBar
            startTime={timeMilliseconds}
            endTime={livenessEndsMilliseconds}
          />
        </TD>
      ) : undefined}
    </>
  );
}
