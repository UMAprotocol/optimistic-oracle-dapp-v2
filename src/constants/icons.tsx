import { hasProperty } from "@/helpers";
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
import PolyBet from "public/assets/icons/projects/polybet.svg";
import Sherlock from "public/assets/icons/projects/sherlock.svg";
import Rated from "public/assets/icons/projects/rated.svg";
import Unknown from "public/assets/icons/projects/unknown.svg";
import PredictFun from "public/assets/icons/projects/predict-fun.svg";

export const projectIcons = {
  Unknown,
  "Cozy Finance": Cozy,
  PolyBet,
  Polymarket,
  Across,
  Sherlock,
  OSnap,
  Rated,
  "Predict.Fun": PredictFun,
};

export const currencyIcons = {
  USDC,
  UMA,
  DAI,
  WETH: ETH,
};

export const chainIcons = {
  Ethereum,
  Goerli: ETH,
  Optimism,
  Gnosis,
  Polygon,
  Mumbai: Polygon,
  Amoy: Polygon,
  Boba,
  SX,
  Avalanche,
  Arbitrum,
};

export function getProjectIcon(project: string | null | undefined) {
  if (!project || !hasProperty(project, projectIcons)) return Unknown;
  return projectIcons[project];
}

export function getCurrencyIcon(currency: string | null | undefined) {
  const transformed = narrowSymbol(currency);
  if (!transformed || !hasProperty(transformed, currencyIcons)) return;
  return currencyIcons[transformed];
}

export function getChainIcon(chainId: ChainId | undefined) {
  if (!chainId) return;
  const chain = chainsById[chainId];
  if (!chain || !hasProperty(chain, chainIcons)) return;
  return chainIcons[chain];
}
// some chains have diff symbols for bridged/native usdc, expand this as you add more chains
const BRIDGED_USDC_SYMBOLS = ["USDB", "USDzC"];

function narrowSymbol(token: string | null | undefined) {
  if (!token) return;
  if (BRIDGED_USDC_SYMBOLS.includes(token)) {
    return "USDC";
  }

  return token;
}
