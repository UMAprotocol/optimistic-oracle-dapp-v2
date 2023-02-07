import { getValueText } from "@/helpers";
import { OracleQueryUI } from "@/types";
import { TD } from "./style";

export function SettledCells({ oracleType, price, assertion }: OracleQueryUI) {
  const settledAs = getValueText({ price, assertion });
  return (
    <>
      <TD>{oracleType}</TD>
      <TD>{settledAs}</TD>
    </>
  );
}
