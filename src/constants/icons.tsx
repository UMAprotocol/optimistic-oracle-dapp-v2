import ETH from "public/assets/icons/currencies/eth.svg";
import USDC from "public/assets/icons/currencies/usdc.svg";
import Cozy from "public/assets/icons/projects/cozy.svg";
import Polymarket from "public/assets/icons/projects/polymarket.svg";
import UMA from "public/assets/icons/projects/uma.svg";
import Across from "public/assets/icons/projects/across.svg";

export const projectIcons: Record<string, JSX.Element> = {
  UMA: <UMA />,
  "Cozy Finance": <Cozy />,
  Polymarket: <Polymarket />,
  Across: <Across />,
};

export const currencyIcons: Record<string, JSX.Element> = {
  USDC: <USDC />,
  ETH: <ETH />,
};

export function getProjectIcon(project: string | null | undefined) {
  if (!project || !(project in projectIcons)) return <UMA />;
  return projectIcons[project];
}

export function getCurrencyIcon(currency: string | null | undefined) {
  if (!currency || !(currency in currencyIcons)) return;
  return currencyIcons[currency];
}
