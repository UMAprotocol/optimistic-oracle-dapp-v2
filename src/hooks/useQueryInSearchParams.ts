import {
  isTransactionHash,
  isValidChainId,
  isValidOracleType,
} from "@/helpers";
import type { OracleQueryUI } from "@/types";
import { exists } from "@libs/utils";
import type { ChainId, OracleType } from "@shared/types";
import { isAddress } from "@shared/utils";
import { castDraft } from "immer";
import { filter, find, lowerCase } from "lodash";
import { useEffect } from "react";
import { useImmer } from "use-immer";
import { useEffectOnce } from "usehooks-ts";
import { usePanelContext } from "./contexts";
import { useQueries } from "./queries";
import { useUrlBar } from "./useUrlBar";
import { oracleEthersApiList } from "@/contexts";

function isValidInteger(str: string): boolean {
  const num = parseInt(str, 10);
  return !isNaN(num) && num.toString() === str.trim();
}

function getOracleType(oracleType: string | undefined): OracleType | undefined {
  switch (oracleType) {
    case "Optimistic":
      return "Optimistic Oracle V1";
    case "OptimisticV2":
      return "Optimistic Oracle V2";
    case "Skinny":
      return "Skinny Optimistic Oracle";
    default:
      return undefined;
  }
}

type State = {
  query: OracleQueryUI | undefined;
  transactionHash: string | undefined;
  eventIndex: string | undefined;
  chainId: number | undefined;
  oracleType: string | undefined;
  requester: string | undefined;
  timestamp: string | undefined;
  identifier: string | undefined;
  ancillaryData: string | undefined;
};

export function useQueryInSearchParams() {
  const { openPanel, setQueryId } = usePanelContext();
  const { all: queries } = useQueries();
  const { searchParams } = useUrlBar();
  const [state, setState] = useImmer<State>({
    query: undefined,
    transactionHash: undefined,
    eventIndex: undefined,
    chainId: undefined,
    oracleType: undefined,
    requester: undefined,
    timestamp: undefined,
    identifier: undefined,
    ancillaryData: undefined,
  });
  const isHashAndIndex = isTransactionHash(state.transactionHash);
  const isLegacyRequestDetails =
    isValidChainId(Number(state.chainId)) &&
    isValidOracleType(getOracleType(state.oracleType)) &&
    isAddress(state.requester) &&
    exists(state.timestamp) &&
    exists(state.identifier) &&
    exists(state.ancillaryData);
  useEffectOnce(() => {
    if (!searchParams) return;

    const hasHash = searchParams?.has("transactionHash");

    if (hasHash) {
      const transactionHash = searchParams?.get("transactionHash");

      oracleEthersApiList.forEach(([, api]) => {
        api
          .updateFromTransactionHash?.(transactionHash!)
          .catch((err) =>
            console.error(
              "Error fetching tx by hash in useWueryInSearchParams",
              err,
            ),
          );
      });
      const hasEventIndex = searchParams?.has("eventIndex");
      setState((draft) => {
        draft.transactionHash = transactionHash!;
        const eventIndex = searchParams.get("eventIndex");
        if (hasEventIndex && eventIndex && isValidInteger(eventIndex)) {
          draft.eventIndex = eventIndex;
        } else {
          draft.eventIndex = undefined;
        }
      });
    }
  });

  useEffectOnce(() => {
    if (
      searchParams?.has("chainId") &&
      searchParams?.has("oracleType") &&
      searchParams?.has("requester") &&
      searchParams?.has("timestamp") &&
      searchParams?.has("identifier") &&
      searchParams?.has("ancillaryData")
    ) {
      setState((draft) => {
        draft.chainId = Number(searchParams.get("chainId")!);
        draft.oracleType = searchParams.get("oracleType")!;
        draft.requester = searchParams.get("requester")!;
        draft.timestamp = searchParams.get("timestamp")!;
        draft.identifier = searchParams.get("identifier")!;
        draft.ancillaryData = searchParams.get("ancillaryData")!;
      });
    }
  });

  useEffect(() => {
    if (state.query) {
      setQueryId(state.query.id);
    }
  }, [setQueryId, state.query]);

  useEffect(() => {
    if (isHashAndIndex || isLegacyRequestDetails) {
      openPanel();
    }
  }, [isHashAndIndex, isLegacyRequestDetails, openPanel]);

  useEffect(() => {
    if (!isHashAndIndex) return;

    const forTx = filter<OracleQueryUI>(
      queries,
      ({
        requestHash,
        proposalHash,
        disputeHash,
        settlementHash,
        assertionHash,
        requestLogIndex,
        proposalLogIndex,
        disputeLogIndex,
        settlementLogIndex,
        assertionLogIndex,
      }) => {
        let match = false;
        if (requestHash === state.transactionHash) {
          if (exists(state.eventIndex)) {
            if (requestLogIndex === state.eventIndex) {
              match = true;
            }
          } else {
            match = true;
          }
        } else if (proposalHash === state.transactionHash) {
          if (exists(state.eventIndex)) {
            if (proposalLogIndex === state.eventIndex) {
              match = true;
            }
          } else {
            match = true;
          }
        } else if (disputeHash === state.transactionHash) {
          if (exists(state.eventIndex)) {
            if (disputeLogIndex === state.eventIndex) {
              match = true;
            }
          } else {
            match = true;
          }
        } else if (settlementHash === state.transactionHash) {
          if (exists(state.eventIndex)) {
            if (settlementLogIndex === state.eventIndex) {
              match = true;
            }
          } else {
            match = true;
          }
        } else if (assertionHash === state.transactionHash) {
          if (exists(state.eventIndex)) {
            if (assertionLogIndex === state.eventIndex) {
              match = true;
            }
          } else {
            match = true;
          }
        }
        return match;
      },
    );

    // sort these by highest score. this is in case we get into a situation where we have
    // a matches dispute tx, b matchs request tx. always prefer request tx match, so we score
    // those higher. so that when we match event ids, we take the higher score tx automatically.
    forTx.sort((a, b) => {
      let score = 0;
      if (a.requestHash === state.transactionHash) score -= 4;
      if (b.requestHash === state.transactionHash) score += 4;
      if (a.proposalHash === state.transactionHash) score -= 3;
      if (b.proposalHash === state.transactionHash) score += 3;
      if (a.disputeHash === state.transactionHash) score -= 2;
      if (b.disputeHash === state.transactionHash) score += 2;
      if (a.settlementHash === state.transactionHash) score -= 1;
      if (b.settlementHash === state.transactionHash) score += 1;
      if (a.assertionHash === state.transactionHash) score -= 4;
      if (b.assertionHash === state.transactionHash) score += 4;
      return score;
    });
    const query = forTx[0];
    setState((draft) => {
      draft.query = castDraft(query);
    });
  }, [
    isHashAndIndex,
    queries,
    setState,
    state.eventIndex,
    state.transactionHash,
  ]);

  useEffect(() => {
    if (!isLegacyRequestDetails) return;

    const {
      chainId,
      oracleType,
      requester,
      timestamp,
      identifier,
      ancillaryData,
    } = state;

    const query = find<OracleQueryUI>(queries, {
      chainId: chainId as ChainId,
      identifier,
      requester: lowerCase(requester),
      oracleType: getOracleType(oracleType),
      timeUNIX: Number(timestamp),
      queryTextHex: ancillaryData,
    });

    setState((draft) => {
      draft.query = castDraft(query);
    });
  });
}
