import { formatNumberForDisplay, formatUnits } from "@shared/utils";

interface Props {
  value: bigint;
  decimals: number;
}
export function FormattedTokenValue({ value, decimals }: Props) {
  const formattedValue = formatUnits(value, decimals);
  const formattedToDisplay = formatNumberForDisplay(formattedValue);

  return <>{formattedToDisplay}</>;
}
