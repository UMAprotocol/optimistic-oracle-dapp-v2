import { Tooltip } from "@/components";
import { getCurrencyIcon } from "@/constants";
import type { ChainId } from "@shared/types";
import type { Address } from "@wagmi/core";
import type { ReactNode } from "react";
import { useToken } from "wagmi";
import { FormattedTokenValue } from "./FormattedTokenValue";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { makeBlockExplorerLink } from "@shared/utils";
import { truncateAddress } from "@/helpers";

interface Props {
  address: Address | undefined;
  chainId: ChainId | undefined;
  value: bigint | undefined;
  showIcon?: boolean;
  showAddressLink?: boolean;
}
/**
 * Displays a currency icon and amount.
 * If the currency is a known currency, the icon will be displayed.
 * Otherwise, the currency symbol will be displayed.
 */
export function Currency(props: Props) {
  const {
    address,
    chainId,
    value,
    showIcon = true,
    showAddressLink = false,
  } = props;
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

  function Content() {
    if (isLoading) {
      return <LoadingSkeleton width={80} height={16} />;
    }

    if (showAddressLink) {
      return (
        <>
          <a
            target="_blank"
            href={`${makeBlockExplorerLink(address, chainId, "address")}`}
            className="border text-sm inline-flex gap-2 items-center border-dashed border-dark/50 hover:border-dark rounded-lg px-1 mr-1"
          >
            {truncateAddress(address)}
            {hasIcon ? (
              <Icon className="w-[16px] h-[16px] inline-block" />
            ) : (
              symbol
            )}
          </a>
          <FormattedTokenValue value={value} decimals={decimals} />{" "}
        </>
      );
    }

    return (
      <>
        {hasIcon && <Icon className="w-[16px] h-[16px] inline-block" />}{" "}
        <FormattedTokenValue value={value} decimals={decimals} />{" "}
        {!hasIcon && symbol}
      </>
    );
  }

  return (
    <OuterWrapper hasIcon={hasIcon} symbol={symbol}>
      <span
        className="inline-flex items-center gap-2"
        style={{
          cursor: hasIcon ? "pointer" : "default",
        }}
      >
        <Content />
      </span>
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
