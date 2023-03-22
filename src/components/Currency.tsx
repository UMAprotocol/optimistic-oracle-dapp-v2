import { getCurrencyIcon } from "@/constants";
import type { ChainId } from "@shared/types";
import type { Address } from "@wagmi/core";
import type { BigNumber } from "ethers";
import styled from "styled-components";
import { useToken } from "wagmi";
import { FormattedTokenValue } from "./FormattedTokenValue";
import { LoadingSkeleton } from "./LoadingSkeleton";

interface Props {
  address: Address | undefined;
  chainId: ChainId | undefined;
  value: BigNumber | undefined;
  showIcon?: boolean;
}
/**
 * Displays a currency icon and amount.
 * If the currency is a known currency, the icon will be displayed.
 * Otherwise, the currency symbol will be displayed.
 */
export function Currency(props: Props) {
  const { address, chainId, value, showIcon = true } = props;
  const { data: token, isLoading: tokenLoading } = useToken({
    address,
    chainId,
    enabled: !!address && !!chainId,
  });
  const symbol = token?.symbol;
  const decimals = token?.decimals;
  const icon = getCurrencyIcon(symbol);
  const hasIcon = !!icon && showIcon;
  const isLoading =
    tokenLoading ||
    value === undefined ||
    decimals === undefined ||
    address === undefined ||
    chainId === undefined;

  return (
    <Wrapper>
      {isLoading ? (
        <LoadingSkeleton width={80} height={16} />
      ) : (
        <>
          {hasIcon && icon}{" "}
          <FormattedTokenValue value={value} decimals={decimals} />{" "}
          {!hasIcon && symbol}
        </>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.span`
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
`;
