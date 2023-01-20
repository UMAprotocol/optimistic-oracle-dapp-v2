import { clients, Multicall2, utils } from "@uma/sdk";
import {
  Provider,
  Signer,
  BigNumberish,
  TransactionResponse,
} from "../types/ethers";
import { Erc20Props } from "../types/state";

const batchProps: utils.Calls = [
  ["symbol"],
  ["name"],
  ["decimals"],
  ["totalSupply"],
];
export class Erc20 {
  public contract: clients.erc20.Instance;
  constructor(protected provider: Provider, public readonly address: string) {
    this.contract = clients.erc20.connect(address, provider);
  }
  async approve(
    signer: Signer,
    spender: string,
    amount: BigNumberish
  ): Promise<TransactionResponse> {
    const contract = clients.erc20.connect(this.address, signer);
    return contract.approve(spender, amount);
  }
  async getProps(): Promise<Erc20Props> {
    const { contract } = this;
    return {
      address: this.address,
      symbol: await contract.callStatic.symbol(),
      name: await contract.callStatic.name(),
      decimals: await contract.callStatic.decimals(),
      totalSupply: await contract.callStatic.totalSupply(),
    };
  }
}
export class Erc20Multicall extends Erc20 {
  private batchRead: utils.BatchReadWithErrorsType;
  constructor(
    provider: Provider,
    address: string,
    private multicall2: Multicall2
  ) {
    super(provider, address);
    this.batchRead = utils.BatchReadWithErrors(multicall2)(this.contract);
  }
  async getProps(): Promise<Erc20Props> {
    return {
      ...(await this.batchRead<Erc20Props>(batchProps)),
      address: this.address,
    };
  }
}
export function factory(
  provider: Provider,
  address: string,
  multicall2?: Multicall2
): Erc20 {
  if (!multicall2) return new Erc20(provider, address);
  return new Erc20Multicall(provider, address, multicall2);
}
