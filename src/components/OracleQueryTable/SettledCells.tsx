import { maybeGetValueTextFromOptions } from "@/helpers";
import type { OracleQueryUI } from "@/types";
import { TD, Text } from "./style";

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
        <Text>{valuesToShow.join(", ")}</Text>
      </TD>
    </>
  );
}
