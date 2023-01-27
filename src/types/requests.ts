import { supportedChains } from "@/constants";
import { BigNumber } from "ethers";

/** I'm using this type to represent the data that the UI expects.
 * A lot of this data will need to be parsed out of ancillary data when we get to wiring this up.
 */
export type Request = {
  title: string;
  time: BigNumber;
  project: Project;
  chain: Chain;
  type: Type;
  status: Status;
  challengePeriodEnd: BigNumber;
  proposal: string | undefined;
  settledAs: string | undefined;
  bond: BigNumber;
  reward: BigNumber;
  oracle: Oracle;
};

export type Project =
  | "UMA"
  | "Polygon"
  | "Sherlock"
  | "Stake.com"
  | "Cozy Finance"
  | undefined;

export type Chain = (typeof supportedChains)[number]["name"];

export type Type = "Event-Based" | "Time-Based";

export type Status = "verify" | "propose" | "settled";

export type Oracle =
  | "Optimistic Asserter"
  | "Optimistic Oracle"
  | "Optimistic Oracle V2"
  | "Skinny Optimistic Oracle";
