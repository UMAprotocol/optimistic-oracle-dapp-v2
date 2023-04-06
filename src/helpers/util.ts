import { mobileAndUnder, tabletAndUnder } from "@/constants";
import type { OracleQueryList } from "@/contexts";
import type { OracleQueryUI } from "@/types";
import { capitalize, words } from "lodash";
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

export function capitalizeFirstLetter(str: string | undefined | null) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
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

/**
 * Hides content on tablet and under
 */
export const hideOnTabletAndUnder = css`
  @media ${tabletAndUnder} {
    display: none;
  }
`;

/**
 * Hides content on mobile and under
 */
export const hideOnMobileAndUnder = css`
  @media ${mobileAndUnder} {
    display: none;
  }
`;

/**
 * Hides content by default, and shows it on tablet and under.
 * Defaults to display: block, but can be overridden with the --display variable.
 */
export const showOnTabletAndUnder = css`
  display: none;

  @media ${tabletAndUnder} {
    display: var(--display, block);
  }
`;

/**
 * Hides content by default, and shows it on mobile and under.
 * Defaults to display: block, but can be overridden with the --display variable.
 */
export const showOnMobileAndUnder = css`
  display: none;

  @media ${mobileAndUnder} {
    display: var(--display, block);
  }
`;

export function makeFilterTitle(filterName: string) {
  return capitalize(words(filterName)[0]);
}

export function sortQueriesByDate({
  verify,
  propose,
  settled,
}: {
  verify: OracleQueryList;
  propose: OracleQueryList;
  settled: OracleQueryList;
}) {
  return {
    verify: verify.sort(
      (a, b) => (b.timeMilliseconds || 0) - (a.timeMilliseconds || 0)
    ),
    propose: propose.sort(
      (a, b) => (b.timeMilliseconds || 0) - (a.timeMilliseconds || 0)
    ),
    settled: settled.sort(
      (a, b) => (b.timeMilliseconds || 0) - (a.timeMilliseconds || 0)
    ),
  };
}

export function makeUrlParamsForQuery({
  requestHash,
  requestLogIndex,
  assertionHash,
  assertionLogIndex,
}: OracleQueryUI) {
  const isRequest = !!requestHash && !!requestLogIndex;

  const queryParams = {
    transactionHash: isRequest ? requestHash : assertionHash,
    eventIndex: isRequest ? requestLogIndex : assertionLogIndex,
  };

  return queryParams;
}

export function getPageForQuery({ actionType }: OracleQueryUI) {
  switch (actionType) {
    case "propose":
      return "propose";
    case "dispute":
    case "settle":
      return "verify";
    default:
      return "settled";
  }
}
