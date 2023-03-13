import { getCurrencyIcon } from "@/constants";
import type { Token } from "@shared/types";
import styled from "styled-components";
import { LoadingSkeleton } from "./LoadingSkeleton";

interface Props {
  token: Token | undefined;
  formattedAmount: string | undefined;
}
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
