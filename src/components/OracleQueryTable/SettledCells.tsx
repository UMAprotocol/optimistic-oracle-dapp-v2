import { getValueText } from "@/helpers";
import type { OracleQueryUI } from "@/types";
import { TD, Text } from "./style";

export function SettledCells({ oracleType, price, assertion }: OracleQueryUI) {
  const settledAs = getValueText({ price, assertion });
  return (
    <>
      <TD>
        <Text>{oracleType}</Text>
      </TD>
      <TD>
        <Text>{settledAs}</Text>
      </TD>
    </>
  );
}
