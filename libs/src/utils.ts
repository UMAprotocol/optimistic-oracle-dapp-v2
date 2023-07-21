import assert from "assert";
import type { Contract } from "ethers";
import { BigNumber, ethers } from "ethers";
import sortedLastIndexBy from "lodash/sortedLastIndexBy";
import zip from "lodash/zip";
import type Multicall2 from "./multicall2";

export type BigNumberish = number | string | BigNumber;
// check if a value is not null or undefined, useful for numbers which could be 0.
// "is" syntax: https://stackoverflow.com/questions/40081332/what-does-the-is-keyword-do-in-typescript
/* eslint-disable-next-line @typescript-eslint/ban-types */
export function exists<T>(
  value: T | null | undefined
): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

// useful for maintaining balances from events
export type Balances = { [key: string]: string };
export function Balances(balances: Balances = {}) {
  function create(id: string, amount = "0") {
    assert(!has(id), "balance already exists");
    return set(id, amount);
  }
  function has(id: string) {
    return exists(balances[id]);
  }
  function set(id: string, amount: string) {
    balances[id] = amount;
    return amount;
  }
  function add(id: string, amount: BigNumberish) {
    return set(id, BigNumber.from(amount).add(getOrCreate(id)).toString());
  }
  function sub(id: string, amount: BigNumberish) {
    return set(id, BigNumber.from(getOrCreate(id)).sub(amount).toString());
  }
  function get(id: string) {
    assert(has(id), "balance does not exist");
    return balances[id];
  }
  function getOrCreate(id: string) {
    if (has(id)) return get(id);
    return create(id);
  }
  return { create, add, sub, get, balances, set, has, getOrCreate };
}

// Copied from common, but modified for ethers Bignumber
export const ConvertDecimals = (fromDecimals: number, toDecimals: number) => {
  assert(fromDecimals >= 0, "requires fromDecimals as an integer >= 0");
  assert(toDecimals >= 0, "requires toDecimals as an integer >= 0");
  // amount: string, BN, number - integer amount in fromDecimals smallest unit that want to convert toDecimals
  // returns: string with toDecimals in smallest unit
  return (amount: BigNumberish): string => {
    assert(exists(amount), "must provide an amount to convert");
    amount = BigNumber.from(amount);
    if (amount.isZero()) return amount.toString();
    const diff = fromDecimals - toDecimals;
    if (diff == 0) return amount.toString();
    if (diff > 0) return amount.div(BigNumber.from("10").pow(diff)).toString();
    return amount.mul(BigNumber.from("10").pow(-1 * diff)).toString();
  };
};

// async sleep
export const sleep = (delay = 0) =>
  new Promise((res) => setTimeout(res, delay));

// Loop forever but wait until execution is finished before starting next timer. Throw an error to break this
// or add another utlity function if you need it to end on condition.
export async function loop(
  fn: (...args: unknown[]) => unknown,
  delay: number,
  ...args: unknown[]
) {
  do {
    await fn(...args);
    await sleep(delay);
    /* eslint-disable-next-line no-constant-condition */
  } while (true);
}

export type Call = [string, ...BigNumberish[]];
export type Calls = Call[];
export type BatchReadWithErrorsType = ReturnType<
  ReturnType<typeof BatchReadWithErrors>
>;
export const BatchReadWithErrors =
  (multicall2: Multicall2) =>
  (contract: Contract) =>
  async <R>(calls: Calls): Promise<R> => {
    // multicall batch takes array of {method} objects
    const results = await multicall2
      .batch(
        contract,
        calls.map(([method, ...args]) => ({ method, args }))
      )
      .readWithErrors();
    // convert results of multicall, an array of responses, into an object keyed by contract method
    return Object.fromEntries(
      zip(calls, results).map(([call, result]) => {
        if (call == null) return [];
        const [method] = call;
        if (!result?.result) return [method, undefined];
        return [method, result.result[0] || result.result];
      })
    ) as R;
  };

/**
 * @notice Return average block-time for a period.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/require-await
export async function averageBlockTimeSeconds(
  lookbackSeconds?: number,
  networkId?: number
): Promise<number> {
  // TODO: Call an external API to get this data. Currently this value is a hard-coded estimate
  // based on the data from https://etherscan.io/chart/blocktime. ~13.5 seconds has been the average
  // since April 2016, although this value seems to spike periodically for a relatively short period of time.
  const defaultBlockTimeSeconds = 13.5;
  if (!defaultBlockTimeSeconds) {
    throw "Missing default block time value";
  }

  switch (networkId) {
    // Source: https://polygonscan.com/chart/blocktime
    case 137:
      return 2.5;
    case 1:
      return defaultBlockTimeSeconds;
    default:
      return defaultBlockTimeSeconds;
  }
}

export async function estimateBlocksElapsed(
  seconds: number,
  cushionPercentage = 0.0
): Promise<number> {
  const cushionMultiplier = cushionPercentage + 1.0;
  const averageBlockTime = await averageBlockTimeSeconds();
  return Math.floor((seconds * cushionMultiplier) / averageBlockTime);
}

/**
 * eventKey. Make a unique and sortable identifier string for an event
 *
 * @param {Event} event
 * @returns {string} - the unique id
 */
export function eventKey(event: {
  blockNumber: BigNumberish;
  transactionIndex: BigNumberish;
  logIndex: BigNumberish;
}): string {
  return [
    // we pad these because numbers of varying lengths will not sort correctly, ie "10" will incorrectly sort before "9", but "09" will be correct.
    event.blockNumber.toString().padStart(16, "0"),
    event.transactionIndex.toString().padStart(16, "0"),
    event.logIndex?.toString().padStart(16, "0"),
    // ~ is the last printable ascii char, so it does not interfere with sorting
  ].join("~");
}
/**
 * insertOrdered. Inserts items in an array maintaining sorted order, in this case lowest to highest. Does not check duplicates.
 * Mainly used for caching all known events, in order of oldest to newest.
 *
 * @param {T[]} array
 * @param {T} element
 * @param {Function} orderBy
 */
export function insertOrderedAscending<T>(
  array: T[],
  element: T,
  orderBy: (element: T) => string | number
): T[] {
  const index = sortedLastIndexBy(array, element, orderBy);
  array.splice(index, 0, element);
  return array;
}
export function isUnique<T>(
  array: T[],
  element: T,
  id: (element: T) => string | number
): boolean {
  const elementId = id(element);
  const found = array.find((next: T) => {
    return id(next) === elementId;
  });
  return found === undefined;
}

export function parseIdentifier(identifier: string | null | undefined): string {
  if (!identifier) return "";

  const utf8 = ethers.utils.isBytesLike(identifier)
    ? ethers.utils.toUtf8String(identifier)
    : identifier;

  // replace non ascii chars
  return utf8.replace(/[^\x20-\x7E]+/g, "");
}

// This state is meant for adjusting a start/end block when querying events. Some apis will fail if the range
// is too big, so the following functions will adjust range dynamically.
export type RangeState = {
  startBlock: number;
  endBlock: number;
  maxRange: number;
  currentRange: number;
  currentStart: number; // This is the start value you want for your query.
  currentEnd: number; // this is the end value you want for your query.
  done: boolean; // Signals we successfully queried the entire range.
  multiplier?: number; // Multiplier increases or decreases range by this value, depending on success or failure
};

/**
 * rangeStart. This starts a new range query and sets defaults for state.  Use this as the first call before starting your queries
 *
 * @param {Pick} state
 * @returns {RangeState}
 */
export function rangeStart(
  state: Pick<RangeState, "startBlock" | "endBlock" | "multiplier"> & {
    maxRange?: number;
  }
): RangeState {
  const { startBlock, endBlock, multiplier = 2 } = state;
  if (state.maxRange && state.maxRange > 0) {
    const range = endBlock - startBlock;
    assert(range > 0, "End block must be higher than start block");
    const currentRange = Math.min(state.maxRange, range);
    const currentStart = endBlock - currentRange;
    const currentEnd = endBlock;
    return {
      done: false,
      startBlock,
      endBlock,
      maxRange: state.maxRange,
      currentRange,
      currentStart,
      currentEnd,
      multiplier,
    };
  } else {
    // the largest range we can have, since this is the users query for start and end
    const maxRange = endBlock - startBlock;
    assert(maxRange > 0, "End block must be higher than start block");
    const currentStart = startBlock;
    const currentEnd = endBlock;
    const currentRange = maxRange;

    return {
      done: false,
      startBlock,
      endBlock,
      maxRange,
      currentRange,
      currentStart,
      currentEnd,
      multiplier,
    };
  }
}
/**
 * rangeSuccessDescending. We have 2 ways of querying events, from oldest to newest, or newest to oldest. Typically we want them in order, from
 * oldest to newest, but for this particular case we want them newest to oldest, ie descending ( larger timestamp to smaller timestamp).
 * This function will increase the range between start/end block and return a new start/end to use since by calling this you are signalling
 * that the last range ended in a successful query.
 *
 * @param {RangeState} state
 * @returns {RangeState}
 */
export function rangeSuccessDescending(state: RangeState): RangeState {
  const {
    startBlock,
    currentStart,
    maxRange,
    currentRange,
    multiplier = 2,
  } = state;
  // we are done if we succeeded querying where the currentStart matches are initial start block
  const done = currentStart <= startBlock;
  // increase range up to max range for every successful query
  const nextRange = Math.min(Math.ceil(currentRange * multiplier), maxRange);
  // move our end point to the previously successful start, ie moving from newest to oldest
  const nextEnd = currentStart;
  // move our start block to the next range down
  const nextStart = Math.max(nextEnd - nextRange, startBlock);
  return {
    ...state,
    currentStart: nextStart,
    currentEnd: nextEnd,
    currentRange: nextRange,
    done,
  };
}
/**
 * rangeFailureDescending. Like the previous function, this will decrease the range between start/end for your query, because you are signalling
 * that the last query failed. It will also keep the end of your range the same, while moving the start range up. This is why
 * its considered descending, it will attempt to move from end to start, rather than start to end.
 *
 * @param {RangeState} state
 * @returns {RangeState}
 */
export function rangeFailureDescending(state: RangeState): RangeState {
  const { startBlock, currentEnd, currentRange, multiplier = 2 } = state;
  const nextRange = Math.floor(currentRange / multiplier);
  // this will eventually throw an error if you keep calling this function, which protects us against re-querying a broken api in a loop
  assert(nextRange > 0, "Range must be above 0");
  // we stay at the same end block
  const nextEnd = currentEnd;
  // move our start block closer to the end block, shrinking the range
  const nextStart = Math.max(nextEnd - nextRange, startBlock);
  return {
    ...state,
    currentStart: nextStart,
    currentEnd: nextEnd,
    currentRange: nextRange,
  };
}
