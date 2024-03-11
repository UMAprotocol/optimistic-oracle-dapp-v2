// This represents the data we are able to parse from snapshot ipfs proposal
// Actual data could diverge from this, so we make everything partial.
export type SnapshotData = Partial<{
  data: Partial<{
    message: Partial<{
      title: string;
      space: string;
      plugins: string; // stringified Record<string, unknown> but we expect Record<'oSnap', OsnapPluginData>
    }>;
  }>;
  hash: string;
}>;

type BaseTransaction = {
  to: string;
  value: string;
  data: string;
  formatted: [to: string, operation: 0, value: string, data: string];
  isValid?: boolean;
};

type RawTransaction = BaseTransaction & {
  type: "raw";
};

type ContractInteractionTransaction = BaseTransaction & {
  type: "contractInteraction";
  abi?: string;
  methodName?: string;
  parameters?: string[];
};

type TransferNftTransaction = BaseTransaction & {
  type: "transferNFT";
  recipient?: string;
  collectable?: object;
};

type TransferFundsTransaction = BaseTransaction & {
  type: "transferFunds";
  amount?: string;
  recipient?: string;
  token?: object;
};

type Transaction =
  | RawTransaction
  | ContractInteractionTransaction
  | TransferNftTransaction
  | TransferFundsTransaction;

export type OsnapPluginData = {
  safe: {
    safeName: string;
    safeAddress: string;
    network: string;
    moduleAddress: string;
    transactions: Transaction[];
  };
};
// type guard for checking safe data stored on ipfs by snapshot
export function isOsnapProposalPluginData(
  proposalData: unknown
): proposalData is OsnapPluginData {
  return proposalData &&
    typeof proposalData === "object" &&
    "oSnap" in proposalData &&
    proposalData["oSnap"] &&
    typeof proposalData["oSnap"] === "object" &&
    "safe" in proposalData["oSnap"]
    ? true
    : false;
}
