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
  oSnap: {
    safe: {
      safeName: string;
      safeAddress: string;
      network: string;
      moduleAddress: string;
      transactions: Transaction[];
    };
  };
};

export type PluginTypes = "safeSnap" | null | OsnapPluginData["oSnap"];

export function isSafeSnapProposalPluginData(proposalData: unknown): boolean {
  if (typeof proposalData === "object" && proposalData !== null) {
    return !!(proposalData as Record<"safeSnap", unknown>)?.safeSnap;
  }
  return false;
}

// type guard for checking safe data stored on ipfs by snapshot
export function isOsnapProposalPluginData(
  proposalData: unknown,
): proposalData is OsnapPluginData {
  if (typeof proposalData === "object" && proposalData !== null) {
    const hasOsnapData = !!(proposalData as OsnapPluginData)?.oSnap?.safe;
    return hasOsnapData;
  }
  return false;
}
