import { commify, formatEther, parseEther } from "@/helpers";
import { BigNumber } from "ethers";

export function addOpacityToHsl(hsl: string, opacity: number) {
  const betweenParens = hsl.match(/\(([^)]+)\)/)?.[1];
  const [h, s, l] = betweenParens?.split(",") ?? [];
  return `hsla(${h}, ${s}, ${l}, ${opacity})`;
}

export const isExternalLink = (href: string) => !href.startsWith("/");

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function determinePage(pathname: string) {
  if (pathname === "/propose") return "propose";
  if (pathname === "/settled") return "settled";
  return "verify";
}

export function formatNumberForDisplay(
  number: BigNumber | undefined,
  options?: { decimals?: number; isFormatEther?: boolean }
) {
  if (!number) return "0.0";
  const { decimals = 2, isFormatEther = true } = options || {};
  const _number = isFormatEther ? formatEther(number) : number.toString();
  return truncateDecimals(commify(_number), decimals);
}

export function truncateDecimals(number: string | number, decimals: number) {
  const [whole, decimal] = number.toString().split(".");
  if (!decimal) return number.toString();
  if (decimals === 0) return whole.toString();
  const truncated = decimal.slice(0, decimals);
  // if the truncated value is just 0, return the whole number
  if (Number(truncated) === 0) return whole.toString();
  return `${whole}.${truncated}`;
}

export function bigNumberFromFloatString(value: string | undefined) {
  if (!value) return BigNumber.from(0);
  const truncated = truncateDecimals(value, 18);
  return BigNumber.from(parseEther(truncated));
}
