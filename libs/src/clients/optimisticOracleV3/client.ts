import type { OptimisticOracleV3InterfaceEthers } from "@uma/contracts-frontend";
import {
  OptimisticOracleV3InterfaceEthers__factory,
  getOptimisticOracleV3InterfaceAbi,
} from "@uma/contracts-frontend";
import type {
  SerializableEvent,
  SignerOrProvider,
  GetEventType,
} from "@libs/types";
import type { BigNumber } from "ethers";
import { utils } from "ethers";

export type Instance = OptimisticOracleV3InterfaceEthers;
const Factory = OptimisticOracleV3InterfaceEthers__factory;

export function connect(address: string, provider: SignerOrProvider): Instance {
  return Factory.connect(address, provider);
}

export const contractInterface = new utils.Interface(
  getOptimisticOracleV3InterfaceAbi()
);

export type AssertionMade = GetEventType<Instance, "AssertionMade">;
export type AssertionDisputed = GetEventType<Instance, "AssertionDisputed">;
export type AssertionSettled = GetEventType<Instance, "AssertionSettled">;
export type AdminPropertiesSet = GetEventType<Instance, "AdminPropertiesSet">;

export type EscalationManagerSettings = {
  arbitrateViaEscalationManager: boolean; // False if the DVM is used as an oracle (EscalationManager on True).
  discardOracle: boolean; // False if Oracle result is used for resolving assertion after dispute.
  validateDisputers: boolean; // True if the EM isDisputeAllowed should be checked on disputes.
  assertingCaller: string; // Stores msg.sender when assertion was made.
  escalationManager: string; // Address of the escalation manager (zero address if not configured).
};
export type Assertion = {
  assertionId: string;
} & Partial<{
  // data exclusively emitted by events
  claim: string;
  disputed: boolean;
  bondRecipient: string;
  assertionCaller: string;
  disputeCaller: string;
  settleCaller: string;
  // defined in assertion state in contract
  escalationManagerSettings: Partial<EscalationManagerSettings>; // Settings related to the escalation manager.
  asserter: string; // Address of the asserter.
  assertionTime: BigNumber; // Time of the assertion.
  settled: boolean; // True if the request is settled.
  currency: string; // ERC20 token used to pay rewards and fees.
  expirationTime: BigNumber; // Unix timestamp marking threshold when the assertion can no longer be disputed.
  settlementResolution: boolean; // Resolution of the assertion (false till resolved).
  domainId: string; // Optional domain that can be used to relate the assertion to others in the escalationManager.
  identifier: string; // UMA DVM identifier to use for price requests in the event of a dispute.
  bond: BigNumber; // Amount of currency that the asserter has bonded.
  callbackRecipient: string; // Address that receives the callback.
  disputer: string; // Address of the disputer.
  // meta data from event block
  assertionTx: string;
  assertionBlockNumber: number;
  assertionLogIndex: number;
  disputeTx: string;
  disputeBlockNumber: number;
  disputeLogIndex: number;
  settleTx: string;
  settleBlockNumber: number;
  settleLogIndex: number;
}>;

export interface EventState {
  assertions?: Record<string, Assertion>;
}

export function reduceEvents(
  state: EventState,
  event: SerializableEvent
): EventState {
  switch (event.event) {
    case "AssertionMade": {
      const typedEvent = event as AssertionMade;
      const {
        assertionId,
        domainId,
        claim,
        asserter,
        callbackRecipient,
        escalationManager,
        caller,
        expirationTime,
        currency,
        bond,
        identifier,
      } = typedEvent.args;
      if (!state.assertions) state.assertions = {};
      const assertion: Assertion = state.assertions[assertionId];
      const escalationManagerSettings: Partial<EscalationManagerSettings> =
        assertion?.escalationManagerSettings || {};
      state.assertions[assertionId] = {
        ...assertion,
        assertionId,
        domainId,
        claim,
        asserter,
        callbackRecipient,
        escalationManagerSettings: {
          ...escalationManagerSettings,
          escalationManager,
        },
        assertionCaller: caller,
        expirationTime,
        currency,
        bond,
        identifier,
        assertionTx: event.transactionHash,
        assertionBlockNumber: event.blockNumber,
        assertionLogIndex: event.logIndex,
      };
      break;
    }
    case "AssertionDisputed": {
      const typedEvent = event as AssertionDisputed;
      const { assertionId, caller, disputer } = typedEvent.args;
      if (!state.assertions) state.assertions = {};
      const assertion: Assertion = state.assertions[assertionId];
      state.assertions[assertionId] = {
        ...assertion,
        assertionId,
        disputeCaller: caller,
        disputer,
        disputeTx: event.transactionHash,
        disputeBlockNumber: event.blockNumber,
        disputeLogIndex: event.logIndex,
      };
      break;
    }
    case "AssertionSettled": {
      const typedEvent = event as AssertionSettled;
      const {
        assertionId,
        bondRecipient,
        disputed,
        settlementResolution,
        settleCaller,
      } = typedEvent.args;
      if (!state.assertions) state.assertions = {};
      const assertion: Assertion = state.assertions[assertionId];
      state.assertions[assertionId] = {
        ...assertion,
        assertionId,
        bondRecipient,
        disputed,
        settlementResolution,
        settleCaller,
        settleTx: event.transactionHash,
        settleBlockNumber: event.blockNumber,
        settleLogIndex: event.logIndex,
      };
      break;
    }
  }
  return state;
}
export function getEventState(
  events: SerializableEvent[],
  eventState: EventState = {}
): EventState {
  return events.reduce(reduceEvents, eventState);
}
