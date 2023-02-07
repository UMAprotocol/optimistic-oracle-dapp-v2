import { OracleQueryUI } from "@/types";
import { TD } from "./style";

export function ProposeCells({
  oracleType,
  formattedBond,
  formattedReward,
  currency,
}: OracleQueryUI) {
  return (
    <>
      <TD>{oracleType}</TD>
      <TD>
        {currency} {formattedBond?.toString()}
      </TD>
      <TD>
        {currency}
        {formattedReward?.toString()}
      </TD>
    </>
  );
}
