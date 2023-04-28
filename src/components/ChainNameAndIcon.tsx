import { getChainIcon } from "@/constants";
import type { ChainId, ChainName } from "@shared/types";
import styled from "styled-components";

interface Props {
  chainName: ChainName;
  chainId: ChainId;
}
export function ChainNameAndIcon({ chainName, chainId }: Props) {
  const chainIcon = getChainIcon(chainId);

  return (
    <Wrapper>
      <IconWrapper>{chainIcon}</IconWrapper> {chainName}
    </Wrapper>
  );
}

const Wrapper = styled.span`
  display: inline-flex;
  align-items: center;
  margin-right: 2px;
  margin-left: 3px;
`;

const IconWrapper = styled.span`
  width: 14px;
  margin-right: 3px;
`;
