import { Tooltip } from "@/components";
import { getCurrencyIcon } from "@/constants";
import type { ChainId } from "@shared/types";
import type { Address } from "@wagmi/core";
import type { BigNumber } from "ethers";
import type { ReactNode } from "react";
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
  const Icon = getCurrencyIcon(symbol);
  const hasIcon = !!Icon && showIcon;
  const isLoading =
    tokenLoading ||
    value === undefined ||
    decimals === undefined ||
    address === undefined ||
    chainId === undefined;

  return (
    <OuterWrapper hasIcon={hasIcon} symbol={symbol}>
      <InnerWrapper
        style={{
          cursor: hasIcon ? "pointer" : "default",
        }}
      >
        {isLoading ? (
          <LoadingSkeleton width={80} height={16} />
        ) : (
          <>
            {hasIcon && <Icon className="inline-block w-4 h-4" />}{" "}
            <FormattedTokenValue value={value} decimals={decimals} />{" "}
            {!hasIcon && symbol}
          </>
        )}
      </InnerWrapper>
    </OuterWrapper>
  );
}

function OuterWrapper({
  hasIcon,
  symbol,
  children,
}: {
  hasIcon: boolean;
  symbol: string | undefined;
  children: ReactNode;
}) {
  if (!hasIcon) return <>{children}</>;
  return <Tooltip content={symbol}>{children}</Tooltip>;
}

const InnerWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;
