import { OracleQueryUI } from "@/types";
import { TD, Text } from "./style";

export function ProposeCells({
  oracleType,
  formattedBond,
  formattedReward,
  currency,
}: OracleQueryUI) {
  return (
    <>
      <TD>
        <Text>{oracleType}</Text>
      </TD>
      <TD>
        <Text>
          {currency} {formattedBond?.toString()}
        </Text>
      </TD>
      <TD>
        <Text>
          {currency} {formattedReward?.toString()}
        </Text>
      </TD>
    </>
  );
}
