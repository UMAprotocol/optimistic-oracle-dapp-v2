import { BigNumber } from "ethers";

export function handleGraphqlStringOrBytes(
  stringOrBytes: string,
  isNullable = false
) {
  if (isNullable && stringOrBytes === null) {
    return undefined;
  }
  return stringOrBytes;
}

export function handleGraphqlBigInt(bigInt: string, isNullable = false) {
  if (isNullable && bigInt === null) {
    return undefined;
  }
  return BigNumber.from(bigInt);
}

export function handleGraphqlBoolean(boolean: boolean, isNullable = false) {
  if (isNullable && boolean === null) {
    return undefined;
  }
  return boolean;
}
