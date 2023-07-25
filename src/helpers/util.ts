import { mobileAndUnder, tabletAndUnder } from "@/constants/styles/breakpoints";
import type { OracleQueryList } from "@/contexts";
import type { DropdownItem, OracleQueryUI } from "@/types";
import { capitalize, orderBy, partition, words } from "lodash";
import type { ReadonlyURLSearchParams } from "next/navigation";
import { css } from "styled-components";

/**
 * Adds an opacity value to an hsl string
 * @param color - a css color string or variable
 * @param opacity - a number between 0 and 1
 * @returns a color-mix css color with transparency added
 */
export function addOpacityToColor(color: string, opacity: number) {
  const alpha = 100 - opacity * 100;
  return `color-mix(in srgb, transparent ${alpha}%, ${color})`;
}

/**
 * Scales the lightness of an hsla string
 * @param hsla - a string in the format of hsla(0, 0%, 0%, 0)
 * @param scale - a number to scale the lightness by
 * @returns a string in the format of hsla(0, 0%, 0%, 0)
 */

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

export function sortQueries({
  verify,
  propose,
  settled,
}: {
  verify: OracleQueryList;
  propose: OracleQueryList;
  settled: OracleQueryList;
}) {
  // propose and settled are sorted by the time the query was created
  // verify is sorted by when the liveness ends, so that the ones that end soonest are easy to find
  return {
    verify: sortVerifyQueries(verify),
    propose: sortByTimeCreated(propose),
    settled: sortByTimeCreated(settled),
  };
}

function sortByLivenessEnds(queries: OracleQueryUI[]) {
  return orderBy(queries, (query) => query.livenessEndsMilliseconds);
}

function sortByTimeCreated(queries: OracleQueryUI[]) {
  return orderBy(queries, (query) => query.timeMilliseconds, ["desc"]);
}
function sortVerifyQueries(verify: OracleQueryUI[]) {
  const [inLiveness, notInLiveness] = partition(
    verify,
    ({ livenessEndsMilliseconds, disputeHash }) => {
      if (disputeHash !== undefined) return false;
      return (livenessEndsMilliseconds ?? 0) > Date.now();
    },
  );

  return [
    ...sortByLivenessEnds(inLiveness),
    ...sortByTimeCreated(notInLiveness),
  ];
}

export function makeUrlParamsForQuery({
  requestHash,
  requestLogIndex,
  assertionHash,
  assertionLogIndex,
}: OracleQueryUI) {
  const isRequest = !!requestHash && !!requestLogIndex;

  const queryParams = {
    transactionHash: isRequest ? requestHash : assertionHash!,
    eventIndex: isRequest ? requestLogIndex : assertionLogIndex!,
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

export function maybeGetValueTextFromOptions(
  valueText: string | null | undefined,
  options: DropdownItem[] | undefined,
) {
  return options?.find(({ value }) => value === valueText)?.label ?? valueText;
}

/**
 * Creates a new query string by merging with the current URLSearchParams object
 * @param name - the name of the query parameter
 * @param value - the value of the query parameter
 */
export function makeQueryString(
  newParams: Record<string, string | null | undefined>,
  pathname: string | null,
  exitingSearchParams: ReadonlyURLSearchParams | null,
) {
  const params = new URLSearchParams(exitingSearchParams?.toString());
  Object.entries(newParams).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  return `${pathname}?${params.toString()}`;
}

export function hasProperty<Obj extends object>(
  key: PropertyKey,
  obj: Obj,
): key is keyof Obj {
  return key in obj;
}
