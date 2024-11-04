import { mobileAndUnder, tabletAndUnder } from "@/constants/styles/breakpoints";
import type { OracleQueryList } from "@/contexts";
import type { DropdownItem, OracleQueryUI } from "@/types";
import { chainsById, oracleTypes } from "@shared/constants";
import type { ChainId, OracleType } from "@shared/types";
import { capitalize, orderBy, partition, words, sortedIndexBy } from "lodash";
import type { ReadonlyURLSearchParams } from "next/navigation";
import { css } from "styled-components";
import type { Address } from "wagmi";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { isEarlyVote } from "@/constants";

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
  return (
    options?.find(({ value }) => value === valueText)?.label ??
    (isEarlyVote(valueText) ? "Early Request" : valueText)
  );
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

export function isTransactionHash(hash: string | undefined) {
  return !!hash && hash.startsWith("0x") && hash.length === 66;
}

export function isValidChainId(
  chainId: number | undefined,
): chainId is ChainId {
  return !!chainId && chainId in chainsById;
}

export function isValidOracleType(
  oracleType: string | undefined,
): oracleType is OracleType {
  return !!oracleType && oracleType in oracleTypes;
}

export function isWagmiAddress(
  maybeAddress: string | undefined,
): maybeAddress is Address {
  if (!maybeAddress) return false;
  return "0x" == maybeAddress.slice(0, 2);
}

export function assertWagmiAddress(
  maybeAddress: string,
): asserts maybeAddress is Address {
  if (!isWagmiAddress(maybeAddress))
    throw new Error(`${maybeAddress} is not a valid address.`);
}

/**
 * Replaces cryptic revert or error messages
 */
export function sanitizeErrorMessage(errorMessage: string) {
  if (errorMessage.toLowerCase().includes("cannot estimate gas")) {
    return "Transaction Failed";
  }
  if (errorMessage.toLowerCase().includes("rejected the request")) {
    return "Transaction Rejected";
  }
  if (
    alreadyDisputedV2([new Error(errorMessage)]) ||
    alreadyDisputedV3([new Error(errorMessage)])
  ) {
    return "Already Disputed";
  }
  if (alreadyProposed([new Error(errorMessage)])) {
    return "Already Proposed";
  }
  if (
    alreadySettledV2([new Error(errorMessage)]) ||
    alreadySettledV3([new Error(errorMessage)])
  ) {
    return "Already Settled";
  }

  return errorMessage;
}

export function errorsContain(
  errors: (Error | null)[],
  message: string,
): boolean {
  return errors.some((e) => {
    return (
      e?.message && e.message.toLowerCase().includes(message.toLowerCase())
    );
  });
}

export function alreadyDisputedV2(errors: (Error | null)[]) {
  return errorsContain(errors, "disputePriceFor: Disputed"); // v2
}

export function alreadyDisputedV3(errors: (Error | null)[]) {
  return errorsContain(errors, "already disputed"); // v3
}

export function alreadyProposed(errors: (Error | null)[]) {
  return errorsContain(errors, "proposePriceFor: Requested"); // v2
}

export function alreadySettledV2(errors: (Error | null)[]) {
  return errorsContain(errors, "_settle: not settleable"); // v2
}

export function alreadySettledV3(errors: (Error | null)[]) {
  return errorsContain(errors, "already settled"); // v3
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateAddress(address: Address | undefined) {
  if (address) {
    return `${address.slice(0, 5)}...${address.slice(-5)}`;
  }
}

export type SortableOracleQuery = {
  livenessEndsMilliseconds?: number | null | undefined;
  timeMilliseconds?: number | null | undefined;
  disputeHash?: string | null | undefined;
};

export function compareOracleQuery(
  a: SortableOracleQuery,
  b: SortableOracleQuery,
): number {
  const now = Date.now();

  const aInLiveness =
    (a.livenessEndsMilliseconds ?? 0) > now && a.disputeHash === undefined;
  const bInLiveness =
    (b.livenessEndsMilliseconds ?? 0) > now && b.disputeHash === undefined;

  if (aInLiveness && !bInLiveness) return -1;
  if (!aInLiveness && bInLiveness) return 1;

  if (aInLiveness && bInLiveness) {
    // Both are in liveness, compare by livenessEndsMilliseconds
    return (
      (a.livenessEndsMilliseconds ?? 0) - (b.livenessEndsMilliseconds ?? 0)
    );
  } else {
    if (
      (b.timeMilliseconds === null || b.timeMilliseconds === undefined) &&
      (a.timeMilliseconds === null || a.timeMilliseconds === undefined)
    ) {
      return 0;
    }
    if (b.timeMilliseconds === null || b.timeMilliseconds === undefined) {
      return 1;
    }
    if (a.timeMilliseconds === null || a.timeMilliseconds === undefined) {
      return -1;
    }
    // Neither are in liveness, compare by timeMilliseconds in descending order
    return a.timeMilliseconds - b.timeMilliseconds;
  }
}
type Comparator<T> = (a: T, b: T) => number;
type MergeFunction<T> = (existing: T, newEntry: T) => T;
type GetIdFunction<T> = (element: T) => string;

export class SortedList<T> {
  public list: T[] = [];
  private comparator: Comparator<T>;
  private mergeFn: MergeFunction<T>;
  private getIdFn: GetIdFunction<T>;
  private idMap: Map<string, number> = new Map();
  public updateCount = 0;

  constructor(
    comparator: Comparator<T>,
    mergeFn: MergeFunction<T>,
    getIdFn: GetIdFunction<T>,
  ) {
    this.comparator = comparator;
    this.mergeFn = mergeFn;
    this.getIdFn = getIdFn;
  }

  upsert = (value: T): void => {
    const id = this.getIdFn(value);
    if (this.idMap.has(id)) {
      const index = this.idMap.get(id)!;
      const existingValue = this.list[index];
      const mergedValue = this.mergeFn(existingValue, value);
      this.list[index] = mergedValue;
    } else {
      const insertIndex = sortedIndexBy(this.list, value, (item) => item);
      this.list.splice(insertIndex, 0, value);
      this.idMap.set(id, insertIndex);

      for (let i = insertIndex + 1; i < this.list.length; i++) {
        this.idMap.set(this.getIdFn(this.list[i]), i);
      }
      this.updateCount++;
    }
  };
  set = (value: T): void => {
    const id = this.getIdFn(value);
    if (this.idMap.has(id)) {
      throw new Error(`Element with id ${id} already exists.`);
    }
    const insertIndex = sortedIndexBy(this.list, value, (item) => item);
    this.list.splice(insertIndex, 0, value);
    this.idMap.set(id, insertIndex);
    for (let i = insertIndex + 1; i < this.list.length; i++) {
      this.idMap.set(this.getIdFn(this.list[i]), i);
    }
    this.updateCount++;
  };

  has = (id: string): boolean => {
    return this.idMap.has(id);
  };

  get = (id: string): T | undefined => {
    const index = this.idMap.get(id);
    return index !== undefined ? this.list[index] : undefined;
  };

  delete = (id: string): boolean => {
    if (!this.idMap.has(id)) {
      return false;
    }
    const index = this.idMap.get(id)!;
    this.list.splice(index, 1);
    this.idMap.delete(id);

    for (let i = index; i < this.list.length; i++) {
      this.idMap.set(this.getIdFn(this.list[i]), i);
    }
    this.updateCount++;
    return true;
  };

  size(): number {
    return this.list.length;
  }

  toSortedArray(): T[] {
    return [...this.list];
  }
}
