import { getValueText } from "@/helpers";
import { OracleQueryUI } from "@/types";
import { LivenessProgressBar } from "../LivenessProgressBar";
import { TD, Text } from "./style";

export function VerifyCells({
  price,
  assertion,
  timeMilliseconds,
  livenessEndsMilliseconds,
}: OracleQueryUI) {
  const proposedValue = getValueText({ price, assertion });

  return (
    <>
      <TD>
        <Text>{proposedValue}</Text>
      </TD>
      <TD>
        <LivenessProgressBar
          startTime={timeMilliseconds}
          endTime={livenessEndsMilliseconds}
        />
      </TD>
    </>
  );
}
