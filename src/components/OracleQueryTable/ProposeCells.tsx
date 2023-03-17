import { useTokens } from "@/hooks/tokens";
import type { OracleQueryUI } from "@/types";
import styled from "styled-components";
import { Currency } from "../Currency";
import { TD, Text } from "./style";

export function ProposeCells({ query }: { query: OracleQueryUI }) {
  const { oracleType, formattedBond, formattedReward } = query;
  const { token } = useTokens(query);

  const hasBond = formattedBond !== null;

  return (
    <>
      <TD>
        <_Text>{oracleType}</_Text>
      </TD>
      <TD>
        {hasBond ? (
          <_Text>
            <Currency token={token} formattedAmount={formattedBond} />
          </_Text>
        ) : (
          "No bond"
        )}
      </TD>
      <TD>
        <_Text>
          <Currency token={token} formattedAmount={formattedReward} />
        </_Text>
      </TD>
    </>
  );
}

const _Text = styled(Text)`
  display: flex;
  gap: 4px;
`;
