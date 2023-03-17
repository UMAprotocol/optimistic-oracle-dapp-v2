import { getCurrencyIcon } from "@/constants";
import type { FetchTokenResult } from "@wagmi/core";
import styled from "styled-components";
import { LoadingSkeleton } from "./LoadingSkeleton";

interface Props {
  token: FetchTokenResult | undefined;
  formattedAmount: string | null | undefined;
}
/**
 * Displays a currency icon and amount.
 * If the currency is a known currency, the icon will be displayed.
 * Otherwise, the currency symbol will be displayed.
 */
export function Currency({ token, formattedAmount }: Props) {
  const currency = token?.symbol;
  const currencyIcon = getCurrencyIcon(currency);
  const hasCurrencyIcon = !!currencyIcon;

  const isLoading = currency === undefined;

  return (
    <Wrapper>
      {isLoading ? (
        <LoadingSkeleton width={80} height={16} />
      ) : (
        <>
          {hasCurrencyIcon && currencyIcon} {formattedAmount}{" "}
          {!hasCurrencyIcon && currency}
        </>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
`;
