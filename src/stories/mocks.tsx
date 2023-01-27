import { Oracle, Project, Status, Type } from "@/types";
import { MockConnector } from "@wagmi/core/connectors/mock";
import { BigNumber, Wallet } from "ethers";
import { Chain, createClient } from "wagmi";
import { chains, provider } from "../pages/_app";

export const mockAddress =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

export const mockWallet = new Wallet(mockAddress);

export const mockWagmiClient = createClient({
  autoConnect: true,
  provider,
  connectors: [
    new MockConnector({
      chains,
      options: {
        signer: mockWallet,
        chainId: 1,
      },
    }),
  ],
});

const mockProjects = [
  "UMA",
  "Polygon",
  "Sherlock",
  "Stake.com",
  "Cozy Finance",
];

const mockTypes = ["Event-Based", "Time-Based"];

const mockStatuses = ["verify", "propose", "settled"];

const mockOracles = [
  "Optimistic Asserter",
  "Optimistic Oracle",
  "Optimistic Oracle V2",
  "Skinny Optimistic Oracle",
];

const mockChains = ["Ethereum", "Polygon", "Optimism"];

type MockRequestInput = {
  index: number;
  _identifier?: string;
  _ancillaryData?: string;
  _decodedIdentifier?: string;
  _decodedAncillaryData?: string;
  _time?: BigNumber;
  _title?: string;
  _project?: Project;
  _chain?: Chain;
  _type?: Type;
  _status?: Status;
  _challengePeriodEnd?: BigNumber;
  _proposal?: string;
  _settledAs?: string;
  _bond?: BigNumber;
  _reward?: BigNumber;
  _oracle?: Oracle;
  _asserterAddress?: string;
  _oracleAddress?: string;
};
export function makeMockRequest({
  index,
  _identifier,
  _decodedIdentifier,
  _ancillaryData,
  _decodedAncillaryData,
  _time,
  _title,
  _project,
  _chain,
  _type,
  _status,
  _challengePeriodEnd,
  _proposal,
  _settledAs,
  _bond,
  _reward,
  _oracle,
  _asserterAddress,
  _oracleAddress,
}: MockRequestInput) {
  const identifier = _identifier ?? `0x${index}`;
  const ancillaryData = _ancillaryData ?? `0x${index}`;
  const decodedIdentifier = _decodedIdentifier ?? `IDENTIFIER_${index}`;
  const decodedAncillaryData =
    _decodedAncillaryData ?? `ANCILLARY_DATA_${index}`;
  const time = _time ?? BigNumber.from(Date.now() / 1000).add(index);
  const title = _title ?? `TITLE_${index}`;
  const project = _project ?? mockProjects[index % mockProjects.length];
  const chain = _chain ?? mockChains[index % mockChains.length];
  const type = _type ?? mockTypes[index % mockTypes.length];
  const status = _status ?? mockStatuses[index % mockStatuses.length];
  const challengePeriodEnd = _challengePeriodEnd ?? time.add(1000);
  const proposal = _proposal ?? `PROPOSAL_${index}`;
  const settledAs = _settledAs ?? `SETTLED_AS_${index}`;
  const bond = _bond ?? BigNumber.from(1000).add(index);
  const reward = _reward ?? BigNumber.from(1000).add(index);
  const oracle = _oracle ?? mockOracles[index % mockOracles.length];
  const asserterAddress = _asserterAddress ?? `0x${index}`;
  const oracleAddress = _oracleAddress ?? `0x${index}`;

  return {
    identifier,
    ancillaryData,
    decodedIdentifier,
    decodedAncillaryData,
    time,
    title,
    project,
    chain,
    type,
    status,
    challengePeriodEnd,
    proposal,
    settledAs,
    bond,
    reward,
    oracle,
    asserterAddress,
    oracleAddress,
  };
}

export function makeMockRequests(count: number) {
  return Array.from({ length: count }, (_, index) =>
    makeMockRequest({ index })
  );
}
