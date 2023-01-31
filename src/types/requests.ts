import { BigNumber } from "ethers";

/** I'm using this type to represent the data that the UI expects.
 * A lot of this data will need to be parsed out of ancillary data when we get to wiring this up.
 * We also need to identify which fields are present for verify, propose and settled.
 */
export type Request = {
  id: ID;
  ancillaryData: string;
  identifier: string;
  decodedAncillaryData: string;
  decodedIdentifier: string;
  title: string | undefined;
  time: BigNumber;
  project: Project;
  chain: string;
  type: Type;
  status: Status;
  challengePeriodEnd: BigNumber;
  proposal: string | undefined;
  settledAs: string | undefined;
  bond: BigNumber;
  reward: BigNumber;
  oracle: Oracle;
  asserterAddress: string;
  proposerAddress: string;
  umip: number;
};

/** Formed like so: [decodedIdentifier]-[time]-[ancillaryData] */
export type ID = string;

export type Project =
  | "UMA"
  | "Polymarket"
  | "Stake.com"
  | "Cozy Finance"
  | undefined;

export type Type = "Event-Based" | "Time-Based";

export type Status = "verify" | "propose" | "settled";

export type Oracle =
  | "Optimistic Asserter"
  | "Optimistic Oracle"
  | "Optimistic Oracle V2"
  | "Skinny Optimistic Oracle";
