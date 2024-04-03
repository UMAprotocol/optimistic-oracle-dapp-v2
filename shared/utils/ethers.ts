import { parseFixed } from "@ethersproject/bignumber";
import type { ChainId } from "@shared/types";
import { BigNumber, ethers } from "ethers";

// Blacklisted price identifiers that will not automatically display on voter clients.
export const IDENTIFIER_BLACKLIST = { SOME_IDENTIFIER: ["1596666977"] };

// Price identifiers that should resolve prices to non 18 decimal precision. Any identifiers
// not on this list are assumed to resolve to 18 decimals.
export const IDENTIFIER_NON_18_PRECISION = {
  USDBTC: 8,
  "STABLESPREAD/USDC": 6,
  "STABLESPREAD/BTC": 8,
  "ELASTIC_STABLESPREAD/USDC": 6,
  BCHNBTC: 8,
  AMPLUSD: 6,
  "COMPUSDC-APR-FEB28/USDC": 6,
  "COMPUSDC-APR-MAR28/USDC": 6,
  // The following identifiers are used in local test environments only:
  TEST8DECIMALS: 8,
  TEST8DECIMALSANCIL: 8,
  TEST6DECIMALS: 6,
  TEST6DECIMALSANCIL: 6,
};

type IdentifierNon18Precision = keyof typeof IDENTIFIER_NON_18_PRECISION;

function isNon18Precision(
  identifier: string
): identifier is IdentifierNon18Precision {
  return identifier in IDENTIFIER_NON_18_PRECISION;
}

export const getPrecisionForIdentifier = (identifier: string): number => {
  return isNon18Precision(identifier)
    ? IDENTIFIER_NON_18_PRECISION[identifier]
    : 18;
};

export function parsePriceStringWithPrecision(
  vote: string,
  decodedIdentifier: string
) {
  // check the precision to use from our table of precisions
  const identifierPrecision = BigNumber.from(
    getPrecisionForIdentifier(decodedIdentifier)
  ).toString();
  return parseFixed(vote, identifierPrecision).toString();
}

export const formatEther = ethers.utils.formatEther;

export const formatUnits = ethers.utils.formatUnits;

export const parseEther = ethers.utils.parseEther;

export const commify = ethers.utils.commify;

/**
 * Formats a number for display.
 * Commas are added to the number, and it is truncated to a certain number of decimals.
 * @param number - the number to format
 * @param options.decimals - the number of decimals to truncate to, defaults to 2
 * @param options.isFormatEther - whether to format the number as ether, defaults to false
 * @returns the formatted number
 */
export function formatNumberForDisplay(
  number: bigint | string | undefined,
  options?: { decimals?: number; isFormatEther?: boolean }
) {
  if (!number) return "0.0";
  const { decimals = 2, isFormatEther = false } = options || {};
  const _number = isFormatEther ? formatEther(number) : number.toString();
  return truncateDecimals(commify(_number), decimals);
}

/**
 * Truncates a number to a certain number of decimals
 * @param number - the number to truncate
 * @param decimals - the number of decimals to truncate to
 * @returns the truncated number
 */
export function truncateDecimals(number: string | number, decimals: number) {
  const [whole, decimal] = number.toString().split(".");
  if (!decimal) return number.toString();
  if (decimals === 0) return whole.toString();
  const truncated = decimal.slice(0, decimals);
  // if the truncated value is just 0, return the whole number
  if (Number(truncated) === 0) return whole.toString();
  return `${whole}.${truncated}`;
}

/**
 * Converts a float string to a BigNumber.
 * Truncates the float string to 18 decimals to avoid overflow.
 * @param value - the float string to convert
 * @returns the BigNumber
 */
export function bigNumberFromFloatString(value: string | undefined) {
  if (!value) return BigNumber.from(0);
  const truncated = truncateDecimals(value, 18);
  return BigNumber.from(parseEther(truncated));
}

function getBlockExplorerUrlForChain(chainId: ChainId) {
  switch (chainId) {
    case 0:
      return;
    case 1:
      return "https://etherscan.io";
    case 5:
      return "https://goerli.etherscan.io";
    case 10:
      return "https://optimistic.etherscan.io";
    case 100:
      return "https://gnosisscan.io";
    case 137:
      return "https://polygonscan.com";
    case 288:
      return "https://bobascan.com";
    case 416:
      return "https://explorer.sx.technology";
    case 1116:
      return "https://scan.coredao.org";
    case 8353: 
      return "https://basescan.org"
    case 43114:
      return "https://snowtrace.io";
    case 42161:
      return "https://arbiscan.io";
    case 80001:
      return "https://mumbai.polygonscan.com";
    case 11155111:
      return "https://sepolia.etherscan.io";
  }
}

export function getBlockExplorerNameForChain(chainId: ChainId) {
  switch (chainId) {
    case 0:
      return;
    case 1 || 5 || 11155111:
      return "Etherscan";
    case 10:
      return "Etherscan";
    case 100:
      return "Gnosisscan";
    case 137 || 80001:
      return "Polygonscan";
    case 288:
      return "Bobascan";
    case 416:
      return "SX Explorer";
    case 1116:
      return "Core Scan";
    case 8353: 
      return "Base Scan"
    case 43114:
      return "Snowtrace";
    case 42161:
      return "Arbiscan";
    default:
      return "Block Explorer";
  }
}

export function makeBlockExplorerLink(
  hash: string,
  chainId: ChainId,
  type: "tx" | "address" | "block"
) {
  const url = getBlockExplorerUrlForChain(chainId);

  if (!url) return "";

  return `${url}/${type}/${hash}`;
}
