import { currencyIcons } from "@/constants";
import { OracleQueryUI } from "@/types";
import styled from "styled-components";
import { TD, Text } from "./style";

export function ProposeCells({
  oracleType,
  formattedBond,
  formattedReward,
  currency,
}: OracleQueryUI) {
  const currencyIcon = currency ? currencyIcons[currency] : undefined;

  return (
    <>
      <TD>
        <_Text>{oracleType}</_Text>
      </TD>
      <TD>
        <_Text>
          {currencyIcon && currencyIcon} {formattedBond?.toString()}{" "}
          {!currencyIcon && currency}
        </_Text>
      </TD>
      <TD>
        <_Text>
          {currencyIcon && currencyIcon} {formattedReward?.toString()}{" "}
          {!currencyIcon && currency}
        </_Text>
      </TD>
    </>
  );
}

const _Text = styled(Text)`
  display: flex;
  gap: 4px;
`;
