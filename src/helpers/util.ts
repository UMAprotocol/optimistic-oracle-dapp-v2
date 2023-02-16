import { mobileAndUnder, tabletAndUnder } from "@/constants";
import { commify, formatEther, parseEther } from "@/helpers";
import { BigNumber } from "ethers";
import { css } from "styled-components";

/**
 * Adds an opacity value to an hsl string
 * @param hsl - a string in the format of hsl(0, 0%, 0%)
 * @param opacity - a number between 0 and 1
 * @returns a string in the format of hsla(0, 0%, 0%, 0)
 */
export function addOpacityToHsla(hsla: string, opacity: number) {
  const betweenParens = hsla.match(/\(([^)]+)\)/)?.[1];
  const [h, s, l] = betweenParens?.split(",") ?? [];
  return `hsla(${h}, ${s}, ${l}, ${opacity})`;
}

/**
 * Scales the lightness of an hsla string
 * @param hsla - a string in the format of hsla(0, 0%, 0%, 0)
 * @param scale - a number to scale the lightness by
 * @returns a string in the format of hsla(0, 0%, 0%, 0)
 */
export function scaleLightnessHsla(hsla: string, scale: number) {
  const betweenParens = hsla.match(/\(([^)]+)\)/)?.[1];
  const [h, s, l, a] = betweenParens?.split(",") ?? [];
  const newLightness = Number(l.replace("%", "")) * scale;
  return `hsl(${h}, ${s}, ${newLightness}%, ${a})`;
}

/**
 * Determines if a link is external or internal
 * @param href - the href of the link
 * @returns true if the link is external, false if it is internal
 */
export const isExternalLink = (href: string) => !href.startsWith("/");

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function determinePage(pathname: string) {
  if (pathname === "/propose") return "propose";
  if (pathname === "/settled") return "settled";
  return "verify";
}

/**
 * Formats a number for display.
 * Commas are added to the number, and it is truncated to a certain number of decimals.
 * @param number - the number to format
 * @param options.decimals - the number of decimals to truncate to, defaults to 2
 * @param options.isFormatEther - whether to format the number as ether, defaults to true
 * @returns the formatted number
 */
export function formatNumberForDisplay(
  number: BigNumber | undefined,
  options?: { decimals?: number; isFormatEther?: boolean }
) {
  if (!number) return "0.0";
  const { decimals = 2, isFormatEther = true } = options || {};
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

/**
 * Returns a display value for a given price or assertion.
 * React does not show boolean values, so we must convert assertions to strings.
 * Otherwise we return the price as a number.
 */
export function getValueText({
  price,
  assertion,
}: {
  price?: string;
  assertion?: boolean;
}) {
  if (assertion !== undefined) return assertion ? "True" : "False";
  return price;
}

/**
 * Determines if a route is active.
 * @param pathname - the current pathname
 * @param href - the route to check
 * @returns true if the route is active, false otherwise
 */
export function isActiveRoute(pathname: string, href: string) {
  return pathname === href;
}

export const hideOnTabletAndUnder = css`
  @media ${tabletAndUnder} {
    display: none;
  }
`;

export const hideOnMobileAndUnder = css`
  @media ${mobileAndUnder} {
    display: none;
  }
`;

export const showOnTabletAndUnder = css`
  display: none;

  @media ${tabletAndUnder} {
    display: block;
  }
`;

export const showOnMobileAndUnder = css`
  display: none;

  @media ${mobileAndUnder} {
    display: block;
  }
`;
