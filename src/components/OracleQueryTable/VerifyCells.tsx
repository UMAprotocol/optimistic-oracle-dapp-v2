import type { OracleQueryUI } from "@/types";
import { LivenessProgressBar } from "../LivenessProgressBar";
import { TD, Text } from "./style";

export function VerifyCells({
  valueText,
  timeMilliseconds,
  livenessEndsMilliseconds,
}: OracleQueryUI) {
  return (
    <>
      <TD>
        <Text>{valueText}</Text>
      </TD>
      {livenessEndsMilliseconds !== undefined &&
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
