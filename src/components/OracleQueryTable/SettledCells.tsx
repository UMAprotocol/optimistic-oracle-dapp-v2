import { maybeGetValueTextFromOptions } from "@/helpers";
import type { OracleQueryUI } from "@/types";
import { TD, Text } from "./style";

export function SettledCells({
  oracleType,
  valueText,
  proposeOptions,
}: OracleQueryUI) {
  const valueToShow = maybeGetValueTextFromOptions(valueText, proposeOptions);

  return (
    <>
      <TD>
        <Text>{oracleType}</Text>
      </TD>
      <TD>
        <Text>{valueToShow}</Text>
      </TD>
    </>
  );
}
