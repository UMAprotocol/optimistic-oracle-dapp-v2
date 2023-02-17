import { getCurrencyIcon } from "@/constants";
import styled from "styled-components";

interface Props {
  currency: string | undefined;
  amount: string | number | undefined;
}
export function Currency({ currency, amount }: Props) {
  const currencyIcon = getCurrencyIcon(currency);

  return (
    <Wrapper>
      {currencyIcon && (
        <CurrencyIconWrapper>{currencyIcon}</CurrencyIconWrapper>
      )}
      {amount} {!currencyIcon && currency}
    </Wrapper>
  );
}

const Wrapper = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CurrencyIconWrapper = styled.span``;
