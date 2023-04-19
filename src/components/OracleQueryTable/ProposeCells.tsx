import type { OracleQueryUI } from "@/types";
import styled from "styled-components";
import { Currency } from "../Currency";
import { TD, Text } from "./style";
import { exists } from "@libs/utils";

export function ProposeCells({ query }: { query: OracleQueryUI }) {
  const { oracleType, tokenAddress, chainId, bond, reward } = query;

  const hasReward = exists(reward);
  return (
    <>
      <TD>
        <_Text>{oracleType}</_Text>
      </TD>
      <TD>
        <_Text>
          <Currency address={tokenAddress} chainId={chainId} value={bond} />
        </_Text>
      </TD>
      <TD>
        {hasReward ? (
          <_Text>
            <Currency address={tokenAddress} chainId={chainId} value={reward} />
          </_Text>
        ) : (
          "No reward"
        )}
      </TD>
    </>
  );
}

const _Text = styled(Text)`
  display: flex;
  gap: 4px;
`;
