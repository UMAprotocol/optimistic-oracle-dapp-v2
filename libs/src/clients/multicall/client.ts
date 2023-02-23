import type { MulticallEthers } from "@uma/contracts-frontend";
import { MulticallEthers__factory } from "@uma/contracts-frontend";
import type { SignerOrProvider } from "@libs/types";

export type Instance = MulticallEthers;
const Factory = MulticallEthers__factory;

export function connect(address: string, provider: SignerOrProvider): Instance {
  return Factory.connect(address, provider);
}
