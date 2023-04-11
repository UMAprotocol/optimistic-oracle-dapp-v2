import ETH from "public/assets/icons/currencies/eth.svg";
import USDC from "public/assets/icons/currencies/usdc.svg";
import DAI from "public/assets/icons/currencies/dai.svg";
import UMA from "public/assets/icons/currencies/uma.svg";
import Across from "public/assets/icons/projects/across.svg";
import Cozy from "public/assets/icons/projects/cozy.svg";
import Polymarket from "public/assets/icons/projects/polymarket.svg";
import Sherlock from "public/assets/icons/projects/sherlock.svg";
import Unknown from "public/assets/icons/projects/unknown.svg";

export const projectIcons: Record<string, JSX.Element> = {
  Unknown: <Unknown />,
  "Cozy Finance": <Cozy />,
  Polymarket: <Polymarket />,
  Across: <Across />,
  Sherlock: <Sherlock />,
};

export const currencyIcons: Record<string, JSX.Element> = {
  USDC: <USDC />,
  UMA: <UMA />,
  DAI: <DAI />,
  WETH: <ETH />,
};

export function getProjectIcon(project: string | null | undefined) {
  if (!project || !(project in projectIcons)) return <Unknown />;
  return projectIcons[project];
}

export function getCurrencyIcon(currency: string | null | undefined) {
  if (!currency || !(currency in currencyIcons)) return;
  return currencyIcons[currency];
}
