import type { Assertion as GqlAssertion } from "./queries";
import type { Assertion } from "../../../types";

export function convert(
  assertion: GqlAssertion,
  chainId: number,
  oracleAddress: string
): Assertion {
  return {
    chainId,
    oracleType: "Optimistic Oracle V3",
    oracleAddress,
    ...assertion,
  };
}
