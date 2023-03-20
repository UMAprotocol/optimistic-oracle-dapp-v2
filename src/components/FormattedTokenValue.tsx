import { formatNumberForDisplay, formatUnits } from "@shared/utils";
import type { BigNumber } from "ethers";

interface Props {
  value: BigNumber;
  decimals: number;
}
export function FormattedTokenValue({ value, decimals }: Props) {
  const formattedValue = formatUnits(value, decimals);
  const formattedToDisplay = formatNumberForDisplay(formattedValue);

  return <>{formattedToDisplay}</>;
}
