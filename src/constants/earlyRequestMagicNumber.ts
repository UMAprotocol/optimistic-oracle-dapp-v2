import { isBigNumberish } from "@ethersproject/bignumber/lib/bignumber";
import { bigNumberFromFloatString } from "@shared/utils";

export const earlyRequestMagicNumber =
  "-57896044618658097711785492504343953926634992332820282019728.792003956564819968";
export const earlyRequestMagicNumberWei =
  "-57896044618658097711785492504343953926634992332820282019728792003956564819968";

/**
 * Description
 * @param {string} value this string is most likely formatted as localeString (includes commas, to a precision of 2)
 * This function compares only the integer part of earlyRequestMagicNumber and param "value"
 */
export function isEarlyVote(value: string | undefined | null): boolean {
  if (!value || !isBigNumberish(value)) return false;

  const asBigInt = takeIntegerAsBigNumber(value)
 return [earlyRequestMagicNumber, earlyRequestMagicNumberWei].map(takeIntegerAsBigNumber).some(num => num.eq(asBigInt))
}

function takeIntegerAsBigNumber(value: string) {
  // remove commas, if present, remove decimals, take only integer
  return bigNumberFromFloatString(value.replace(/,/g, "").split(".")[0])
}

