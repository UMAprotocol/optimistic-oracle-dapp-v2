import { maybeGetValueTextFromOptions } from "@/helpers";
import type { OracleQueryUI } from "@/types";
import { TD, Text } from "./style";
import ExternalLink from "public/assets/icons/external-link.svg";

export function SettledCells({
  oracleType,
  valueText,
  proposeOptions,
}: OracleQueryUI) {
  const valuesToShow = Array.isArray(valueText)
    ? valueText
    : [maybeGetValueTextFromOptions(valueText, proposeOptions)];

  return (
    <>
      <TD>
        <Text>{oracleType}</Text>
      </TD>
      <TD>
        <Text>
          {valuesToShow.length > 1 ? (
            <span>
              See Outcome <ExternalLink className="inline rounded-none" />{" "}
            </span>
          ) : (
            valuesToShow[0]
          )}
        </Text>
      </TD>
    </>
  );
}
