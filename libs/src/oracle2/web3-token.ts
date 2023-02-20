import { erc20 } from "@libs/clients";
import type { JsonRpcProvider, JsonRpcSigner } from "./types";

export type Config = {
  provider: JsonRpcProvider;
  address: string;
};

export function TokenClient(config: Config) {
  const { address, provider } = config;
  const contract = erc20.connect(address, provider);

  async function props(): Promise<{
    symbol: string;
    name: string;
    decimals: number;
  }> {
    return {
      symbol: await contract.callStatic.symbol(),
      name: await contract.callStatic.name(),
      decimals: await contract.callStatic.decimals(),
    };
  }
  async function balanceOf(address: string): Promise<string> {
    const amount = await contract.balanceOf(address);
    return amount.toString();
  }
  async function allowance(address: string, spender: string): Promise<string> {
    const amount = await contract.allowance(address, spender);
    return amount.toString();
  }
  async function approve(
    signer: JsonRpcSigner,
    spender: string,
    amount: string
  ) {
    const contract = erc20.connect(address, signer);
    return contract.approve(spender, amount);
  }

  return {
    props,
    balanceOf,
    allowance,
    approve,
  };
}
export type TokenClient = ReturnType<typeof TokenClient>;
