import { erc20 } from "@libs/clients";
import type { JsonRpcProvider, JsonRpcSigner } from "./types";

export type Config = {
  provider: JsonRpcProvider;
  tokenAddress: string;
};

export function TokenClient(config: Config) {
  const { tokenAddress, provider } = config;
  const contract = erc20.connect(tokenAddress, provider);

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
  async function balanceOf(params: { account: string }): Promise<string> {
    const amount = await contract.balanceOf(params.account);
    return amount.toString();
  }
  async function allowance(params: {
    account: string;
    spender: string;
  }): Promise<string> {
    const amount = await contract.allowance(params.account, params.spender);
    return amount.toString();
  }
  async function approve(params: {
    signer: JsonRpcSigner;
    spender: string;
    amount: string;
  }) {
    const contract = erc20.connect(tokenAddress, params.signer);
    return contract.approve(params.spender, params.amount);
  }

  return {
    props,
    balanceOf,
    allowance,
    approve,
  };
}
export type TokenClient = ReturnType<typeof TokenClient>;
