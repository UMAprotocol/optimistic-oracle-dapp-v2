import { isBigNumberish } from "@ethersproject/bignumber/lib/bignumber";
import { isDefined } from "@libs/utils";

export const earlyRequestMagicNumber =
  "-57896044618658097711785492504343953926634992332820282019728.792003956564819968";
export const earlyRequestMagicNumberWei =
  "-57896044618658097711785492504343953926634992332820282019728792003956564819968";
export const earlyRequestMagicNumberRounded =
  "-57896044618658097711785492504343953926634992332820282019728";

const magicNumberIntegerParts = [
  earlyRequestMagicNumber,
  earlyRequestMagicNumberWei,
  earlyRequestMagicNumberRounded,
].map(takeInteger);

/**
 * Description
 * @param {string} value this string is most likely formatted as localeString (includes commas, to a precision of 2)
 * This function compares only the integer part of earlyRequestMagicNumber and param "value"
 */
export function isEarlyVote(value: string | undefined | null): boolean {
  if (!isDefined(value)) return false;

  // Extract just the integer part of the input value
  const integerPart = takeInteger(value);
  if (!isBigNumberish(integerPart)) {
    return false;
  }

  // Direct string comparison of integer parts
  return magicNumberIntegerParts.includes(integerPart);
}

function takeInteger(value: string) {
  return value.replace(/,/g, "").split(".")[0];
}
