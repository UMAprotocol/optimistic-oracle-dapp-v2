import type { OracleQueryUI } from "@/types";
import { Currency } from "../Currency";
import { LivenessProgressBar } from "../LivenessProgressBar";
import { TD, Text } from "./style";

export function VerifyCells({
  valueText,
  timeMilliseconds,
  livenessEndsMilliseconds,
  disputeHash,
  bond,
  chainId,
  tokenAddress,
}: OracleQueryUI) {
  return (
    <>
      <TD>
        <Text>{valueText}</Text>
      </TD>
      <TD>
        <Text>
          <Currency address={tokenAddress} chainId={chainId} value={bond} />
        </Text>
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
