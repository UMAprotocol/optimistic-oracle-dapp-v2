import ETH from "public/assets/icons/currencies/eth.svg";
import USDC from "public/assets/icons/currencies/usdc.svg";
import Cozy from "public/assets/icons/projects/cozy.svg";
import Polymarket from "public/assets/icons/projects/polymarket.svg";
import UMA from "public/assets/icons/projects/uma.svg";

export const projectIcons: Record<string, JSX.Element> = {
  UMA: <UMA />,
  "Cozy Finance": <Cozy />,
  Polymarket: <Polymarket />,
};

export const currencyIcons: Record<string, JSX.Element> = {
  USDC: <USDC />,
  ETH: <ETH />,
};
