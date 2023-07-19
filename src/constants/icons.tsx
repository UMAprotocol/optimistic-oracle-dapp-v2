import { isIn } from "@/helpers";
import { chainsById } from "@shared/constants";
import type { ChainId } from "@shared/types";
import Arbitrum from "public/assets/icons/chains/arbitrum.svg";
import Avalanche from "public/assets/icons/chains/avax.svg";
import Boba from "public/assets/icons/chains/boba.svg";
import Ethereum from "public/assets/icons/chains/ethereum.svg";
import Gnosis from "public/assets/icons/chains/gnosis.svg";
import Optimism from "public/assets/icons/chains/optimism.svg";
import Polygon from "public/assets/icons/chains/polygon.svg";
import SX from "public/assets/icons/chains/sx.svg";
import DAI from "public/assets/icons/currencies/dai.svg";
import ETH from "public/assets/icons/currencies/eth.svg";
import UMA from "public/assets/icons/currencies/uma.svg";
import USDC from "public/assets/icons/currencies/usdc.svg";
import Across from "public/assets/icons/projects/across.svg";
import Cozy from "public/assets/icons/projects/cozy.svg";
import OSnap from "public/assets/icons/projects/osnap.svg";
import Polymarket from "public/assets/icons/projects/polymarket.svg";
import Sherlock from "public/assets/icons/projects/sherlock.svg";
import Unknown from "public/assets/icons/projects/unknown.svg";

export const projectIcons = {
  Unknown,
  "Cozy Finance": Cozy,
  Polymarket,
  Across,
  Sherlock,
  OSnap,
};

export const currencyIcons = {
  USDC,
  UMA,
  DAI,
  WETH: ETH,
};

export const chainIcons = {
  Ethereum,
  Goerli: Ethereum,
  Optimism,
  Gnosis,
  Polygon,
  Mumbai: Polygon,
  Boba,
  SX,
  Avalanche,
  Arbitrum,
};

export function getProjectIcon(project: string | null | undefined) {
  if (!project || !isIn(project, projectIcons)) return Unknown;
  return projectIcons[project];
}

export function getCurrencyIcon(currency: string | null | undefined) {
  if (!currency || !isIn(currency, currencyIcons)) return;
  return currencyIcons[currency];
}

export function getChainIcon(chainId: ChainId | undefined) {
  if (!chainId) return;
  const chain = chainsById[chainId];
  if (!chain || !isIn(chain, chainIcons)) return;
  return chainIcons[chain];
}
