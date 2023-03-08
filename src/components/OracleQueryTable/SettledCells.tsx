import type { OracleQueryUI } from "@/types";
import { TD, Text } from "./style";

export function SettledCells({ oracleType, valueText }: OracleQueryUI) {
  return (
    <>
      <TD>
        <Text>{oracleType}</Text>
      </TD>
      <TD>
        <Text>{valueText}</Text>
      </TD>
    </>
  );
}
