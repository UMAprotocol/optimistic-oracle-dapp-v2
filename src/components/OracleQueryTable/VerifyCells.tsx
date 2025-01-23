import { maybeGetValueTextFromOptions } from "@/helpers";
import type { OracleQueryUI } from "@/types";
import { Currency } from "../Currency";
import { LivenessProgressBar } from "../LivenessProgressBar";
import { TD, Text } from "./style";
import ExternalLink from "public/assets/icons/external-link.svg";
import { isUnresolvable } from "@/helpers/validators";

export function VerifyCells({
  valueText,
  proposeOptions,
  timeMilliseconds,
  livenessEndsMilliseconds,
  disputeHash,
  bond,
  chainId,
  tokenAddress,
}: OracleQueryUI) {
  const valuesToShow = Array.isArray(valueText)
    ? valueText
    : [maybeGetValueTextFromOptions(valueText, proposeOptions)];
  return (
    <>
      <TD>
        <Text>
          {valuesToShow.length > 1 ? (
            <span>
              See Proposal
              <ExternalLink className="inline rounded-none ml-2" />{" "}
            </span>
          ) : isUnresolvable(valuesToShow[0] ?? "") ? (
            "Unresolvable"
          ) : (
            valuesToShow[0]
          )}
        </Text>
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
