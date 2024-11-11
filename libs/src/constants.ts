import type { OracleType } from "@shared/types";
import { ethers } from "ethers";

const getAddress = ethers.utils.getAddress;
type ContractType = OracleType | "Erc20";
type ContractInfo = {
  chainId: number;
  address: string;
  type: ContractType;
  deployBlock?: number;
};
type ContractInfoList = ContractInfo[];
export const ContractInfoList: ContractInfoList = [
  // v1
  {
    type: "Optimistic Oracle V1",
    chainId: 1,
    address: getAddress("0xc43767f4592df265b4a9f1a398b97ff24f38c6a6"),
  },
  {
    // goerli
    type: "Optimistic Oracle V1",
    chainId: 5,
    address: getAddress("0x6f26Bf09B1C792e3228e5467807a900A503c0281"),
  },
  {
    // optimism
    type: "Optimistic Oracle V1",
    chainId: 10,
    address: getAddress("0x56e2d1b8C7dE8D11B282E1b4C924C32D91f9102B"),
  },
  {
    // polygon
    type: "Optimistic Oracle V1",
    chainId: 137,
    address: getAddress("0xBb1A8db2D4350976a11cdfA60A1d43f97710Da49"),
  },
  {
    // boba
    type: "Optimistic Oracle V1",
    chainId: 288,
    address: getAddress("0x7da554228555C8Bf3748403573d48a2138C6b848"),
  },
  {
    // core
    type: "Optimistic Oracle V1",
    chainId: 1116,
    address: getAddress("0x6999526e507Cc3b03b180BbE05E1Ff938259A874"),
  },
  {
    // arbitrum
    type: "Optimistic Oracle V1",
    chainId: 42161,
    address: getAddress("0x031A7882cE3e8b4462b057EBb0c3F23Cd731D234"),
  },
  {
    // mumbai
    type: "Optimistic Oracle V1",
    chainId: 80001,
    address: getAddress("0xAB75727d4e89A7f7F04f57C00234a35950527115"),
  },
  {
    // amoy
    type: "Optimistic Oracle V1",
    chainId: 80002,
    address: getAddress("0x3baD7AD0728f9917d1Bf08af5782dCbD516cDd96"),
  },
  {
    // sepolia
    type: "Optimistic Oracle V1",
    chainId: 11155111,
    address: getAddress("0x18Ca744fd1960d9Dda0Af5E22CC5C92aD75901E8"),
  },
  {
    // sepolia
    type: "Optimistic Oracle V1",
    chainId: 11155111,
    address: getAddress("0x18Ca744fd1960d9Dda0Af5E22CC5C92aD75901E8"),
  },
  {
    // blast
    type: "Optimistic Oracle V1",
    chainId: 81457,
    address: getAddress("0x3CA11702f7c0F28e0b4e03C31F7492969862C569"),
  },
  // v2
  {
    type: "Optimistic Oracle V2",
    chainId: 1,
    address: getAddress("0x004395edb43EFca9885CEdad51EC9fAf93Bd34ac"),
  },
  {
    // goerli
    type: "Optimistic Oracle V2",
    chainId: 5,
    address: getAddress("0xA5B9d8a0B0Fa04Ba71BDD68069661ED5C0848884"),
  },
  {
    // optimism
    type: "Optimistic Oracle V2",
    chainId: 10,
    address: getAddress("0x255483434aba5a75dc60c1391bB162BCd9DE2882"),
  },
  {
    // polygon
    type: "Optimistic Oracle V2",
    chainId: 137,
    address: getAddress("0xee3afe347d5c74317041e2618c49534daf887c24"),
  },
  {
    // boba
    type: "Optimistic Oracle V2",
    chainId: 288,
    address: getAddress("0xb2b5C1b17B19d92CC4fC1f026B2133259e3ccd41"),
  },
  {
    // core
    type: "Optimistic Oracle V2",
    chainId: 1116,
    address: getAddress("0xd85630E361cEbBC4c7f13e6eEd3587050fB81B86"),
  },
  {
    // arbitrum
    type: "Optimistic Oracle V2",
    chainId: 42161,
    address: getAddress("0x88Ad27C41AD06f01153E7Cd9b10cBEdF4616f4d5"),
  },
  {
    // mumbai
    type: "Optimistic Oracle V2",
    chainId: 80001,
    address: getAddress("0x60E6140330F8FE31e785190F39C1B5e5e833c2a9"),
  },
  {
    // amoy
    type: "Optimistic Oracle V2",
    chainId: 80002,
    address: getAddress("0x38fAc33bD20D4c4Cce085C0f347153C06CbA2968"),
  },
  {
    // sepolia
    type: "Optimistic Oracle V2",
    chainId: 11155111,
    address: getAddress("0x9f1263B8f0355673619168b5B8c0248f1d03e88C"),
  },
  {
    // sepolia
    type: "Optimistic Oracle V2",
    chainId: 11155111,
    address: getAddress("0x9f1263B8f0355673619168b5B8c0248f1d03e88C"),
  },
  {
    // blast
    type: "Optimistic Oracle V2",
    chainId: 81457,
    address: getAddress("0x4e8E101924eDE233C13e2D8622DC8aED2872d505"),
  },
  {
    // blast sepolia
    type: "Optimistic Oracle V2",
    chainId: 168587773,
    address: getAddress("0xD8c6dD978a3768F7DDfE3A9aAD2c3Fd75Fa9B6Fd"),
    deployBlock: 8274989,
  },
  // v3
  {
    type: "Optimistic Oracle V3",
    chainId: 1,
    address: getAddress("0xfb55F43fB9F48F63f9269DB7Dde3BbBe1ebDC0dE"),
  },
  {
    // goerli
    type: "Optimistic Oracle V3",
    chainId: 5,
    address: getAddress("0x9923D42eF695B5dd9911D05Ac944d4cAca3c4EAB"),
  },
  {
    // optimism
    type: "Optimistic Oracle V3",
    chainId: 10,
    address: getAddress("0x072819Bb43B50E7A251c64411e7aA362ce82803B"),
  },
  {
    // polygon
    type: "Optimistic Oracle V3",
    chainId: 137,
    address: getAddress("0x5953f2538F613E05bAED8A5AeFa8e6622467AD3D"),
  },
  {
    // boba
    type: "Optimistic Oracle V3",
    chainId: 288,
    address: getAddress("0xe1C2587C1789f7D00F22931D4DBAD537405DFe1f"),
  },
  {
    // core
    type: "Optimistic Oracle V3",
    chainId: 1116,
    address: getAddress("0xD84ACa67d683aF7702705141b3C7E57e4e5e7726"),
  },
  {
    // arbitrum
    type: "Optimistic Oracle V3",
    chainId: 42161,
    address: getAddress("0xa6147867264374F324524E30C02C331cF28aa879"),
  },
  {
    // mumbai
    type: "Optimistic Oracle V3",
    chainId: 80001,
    address: getAddress("0x263351499f82C107e540B01F0Ca959843e22464a"),
  },
  {
    // amoy
    type: "Optimistic Oracle V3",
    chainId: 80002,
    address: getAddress("0xd8866E76441df243fc98B892362Fc6264dC3ca80"),
  },
  {
    // sepolia
    type: "Optimistic Oracle V3",
    chainId: 11155111,
    address: getAddress("0xFd9e2642a170aDD10F53Ee14a93FcF2F31924944"),
  },
  {
    // sepolia
    type: "Optimistic Oracle V3",
    chainId: 11155111,
    address: getAddress("0xFd9e2642a170aDD10F53Ee14a93FcF2F31924944"),
  },
  {
    // blast
    type: "Optimistic Oracle V3",
    chainId: 81457,
    address: getAddress("0xE8FF2a3d5Cc19DDcBd93328371E1Dd8995e7AfAA"),
  },
  {
    // blast sepolia
    type: "Optimistic Oracle V3",
    chainId: 168587773,
    address: getAddress("0xad5503B3C7e35EAF0E88df80b4B626eD0C0404A0"),
    deployBlock: 1115239,
  },
  // skinny
  {
    // mainnet
    type: "Skinny Optimistic Oracle",
    chainId: 1,
    address: getAddress("0xeE3Afe347D5C74317041E2618C49534dAf887c24"),
  },
  {
    type: "Skinny Optimistic Oracle",
    chainId: 5,
    address: getAddress("0xeDc52A961B5Ca2AC7B2e0bc36714dB60E5a115Ab"),
  },
  {
    type: "Skinny Optimistic Oracle",
    chainId: 11155111,
    address: getAddress("0xc0a072E45751Bb8a814bF1A357311c6963F9019A"),
  },
  {
    type: "Skinny Optimistic Oracle V2",
    chainId: 5,
    address: getAddress("0x5a9Ed5DaC741e20cA6587d0c5C39C0992Db305C1"),
  },
  {
    // sepolia
    type: "Skinny Optimistic Oracle",
    chainId: 11155111,
    address: getAddress("0x255483434aba5a75dc60c1391bB162BCd9DE2882"),
  },
  // base contracts
  {
    type: "Optimistic Oracle V1",
    chainId: 8453,
    address: getAddress("0x1037A21a30aEfF90c269b01c3933eB9a5285d9b8"),
  },
  {
    type: "Optimistic Oracle V2",
    chainId: 8453,
    address: getAddress("0x880d041D67aaB3B062995d11d4aD9c1018A3b02f"),
  },
  {
    type: "Optimistic Oracle V3",
    chainId: 8453,
    address: getAddress("0x2aBf1Bd76655de80eDB3086114315Eec75AF500c"),
  },
  // story odyssey
  {
    type: "Optimistic Oracle V3",
    chainId: 1516,
    address: getAddress("0x3CA11702f7c0F28e0b4e03C31F7492969862C569"),
    deployBlock: 298453,
  },
];
export function getContractInfo(params: {
  chainId: number;
  type: string;
}): ContractInfo {
  const found = ContractInfoList.find(
    ({ chainId, type }) => chainId === params.chainId && type === params.type,
  );
  if (!found)
    throw new Error(
      `Unable to find contract info for ${params.type} on chain ${params.chainId}`,
    );
  return found;
}
export function getContractAddress(params: {
  chainId: number;
  type: string;
}): string {
  return getContractInfo(params).address;
}
export const erc20Abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
];
export const MaxInt256 = ethers.constants.MaxInt256;
