import type { OracleType } from "./oracle2/types";
import { ethers } from "ethers";

const getAddress = ethers.utils.getAddress;
type ContractType = OracleType | "Erc20";
type ContractInfo = {
  chainId: number;
  address: string;
  type: ContractType;
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
    // arbitrum
    type: "Optimistic Oracle V1",
    chainId: 42161,
    address: getAddress("0x031A7882cE3e8b4462b057EBb0c3F23Cd731D234"),
  },
  // v2
  {
    type: "Optimistic Oracle V2",
    chainId: 1,
    address: getAddress("0xA0Ae6609447e57a42c51B50EAe921D701823FFAe"),
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
    // arbitrum
    type: "Optimistic Oracle V2",
    chainId: 42161,
    address: getAddress("0x88Ad27C41AD06f01153E7Cd9b10cBEdF4616f4d5"),
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
    // arbitrum
    type: "Optimistic Oracle V3",
    chainId: 42161,
    address: getAddress("0xa6147867264374F324524E30C02C331cF28aa879"),
  },
];
export function getContractInfo(params: {
  chainId: number;
  type: string;
}): ContractInfo {
  const found = ContractInfoList.find(
    ({ chainId, type }) => chainId === params.chainId && type === params.type
  );
  if (!found)
    throw new Error(
      `Unable to find contract info for ${params.type} on chain ${params.chainId}`
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
