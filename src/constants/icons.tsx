import { hasProperty } from "@/helpers";
import { chainsById } from "@shared/constants";
import type { ChainId } from "@shared/types";
// chains
import Arbitrum from "public/assets/icons/chains/arbitrum.svg";
import Boba from "public/assets/icons/chains/boba.svg";
import Ethereum from "public/assets/icons/chains/ethereum.svg";
import Optimism from "public/assets/icons/chains/optimism.svg";
import Polygon from "public/assets/icons/chains/polygon.svg";
import SX from "public/assets/icons/chains/sx.svg";
import Story from "public/assets/icons/chains/story.svg";
// currencies
import DAI from "public/assets/icons/currencies/dai.svg";
import ETH from "public/assets/icons/currencies/eth.svg";
import UMA from "public/assets/icons/currencies/uma.svg";
import USDC from "public/assets/icons/currencies/usdc.svg";
import USDB from "public/assets/icons/currencies/usdb.svg";
import IP from "public/assets/icons/currencies/ip.svg";
// projects
import Across from "public/assets/icons/projects/across.svg";
import Cozy from "public/assets/icons/projects/cozy.svg";
import OSnap from "public/assets/icons/projects/osnap.svg";
import Polymarket from "public/assets/icons/projects/polymarket.svg";
import PolyBet from "public/assets/icons/projects/polybet.svg";
import Sherlock from "public/assets/icons/projects/sherlock.svg";
import Rated from "public/assets/icons/projects/rated.svg";
import Unknown from "public/assets/icons/projects/unknown.svg";
import PredictFun from "public/assets/icons/projects/predict-fun.svg";
import InfiniteGames from "public/assets/icons/projects/infinite-games.svg";
import Prognoze from "public/assets/icons/projects/prognoze.svg";
import MetaMarket from "public/assets/icons/projects/meta-market.svg";
import Probable from "public/assets/icons/projects/probable.svg";
// Social Icons
import Discord from "public/assets/icons/social/discord.svg";
import Discourse from "public/assets/icons/social/discourse.svg";
import Github from "public/assets/icons/social/github.svg";
import Medium from "public/assets/icons/social/medium.svg";
import Twitter from "public/assets/icons/social/twitter.svg";
import type { ProjectName } from "@/projects";

export const projectIcons: Record<
  ProjectName,
  React.FC<React.SVGProps<HTMLOrSVGElement>>
> = {
  Unknown,
  "Cozy Finance": Cozy,
  PolyBet,
  Polymarket,
  Across,
  Sherlock,
  OSnap,
  Rated,
  "Predict.Fun": PredictFun,
  "Infinite Games": InfiniteGames,
  Prognoze,
  MetaMarket,
  Probable,
};

// symbol => icon
export const currencyIcons = {
  USDC,
  UMA,
  DAI,
  WETH: ETH,
  USDB,
  IP,
  WIP: IP,
};

export const chainIcons = {
  Ethereum,
  Goerli: ETH,
  Optimism,
  Polygon,
  Mumbai: Polygon,
  Amoy: Polygon,
  Boba,
  SX,
  Arbitrum,
  Story,
};

export const socialIcons = {
  Discord,
  Discourse,
  Github,
  Medium,
  Twitter,
} as const;

export function getProjectIcon(project: ProjectName | null | undefined) {
  if (!project || !hasProperty(project, projectIcons))
    return projectIcons.Unknown;
  return projectIcons[project];
}

export function getCurrencyIcon(currency: string | null | undefined) {
  if (!currency || !hasProperty(currency, currencyIcons)) return;
  return currencyIcons[currency];
}

export function getChainIcon(chainId: ChainId | undefined) {
  if (!chainId) return;
  const chain = chainsById[chainId];
  if (!chain || !hasProperty(chain, chainIcons)) return;
  return chainIcons[chain];
}

export function getSocialIcon(name?: keyof typeof socialIcons) {
  if (!name) return;
  return socialIcons[name];
}
