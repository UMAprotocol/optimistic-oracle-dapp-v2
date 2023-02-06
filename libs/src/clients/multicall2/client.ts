import {
  Multicall2Ethers,
  Multicall2Ethers__factory,
} from "@uma/contracts-frontend";
import type { SignerOrProvider } from "@libs/types";

export type Instance = Multicall2Ethers;
const Factory = Multicall2Ethers__factory;

export function connect(address: string, provider: SignerOrProvider): Instance {
  return Factory.connect(address, provider);
}
