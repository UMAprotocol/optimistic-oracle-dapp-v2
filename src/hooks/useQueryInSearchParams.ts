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

function getOracleType(oracleType: string | undefined): OracleType | undefined {
  switch (oracleType) {
    case "Optimistic":
      return "Optimistic Oracle V1";
    case "OptimisticV2":
      return "Optimistic Oracle V2";
    case "Skinny":
      return "Skinny Optimistic Oracle";
    case "Managed Optimistic Oracle V2":
      return "Managed Optimistic Oracle V2";
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
              "Error fetching tx by hash in useQueryInSearchParams",
              err,
            ),
          );
      });
      const hasEventIndex = searchParams?.has("eventIndex");
      setState((draft) => {
        draft.transactionHash = transactionHash!;
        const eventIndex = searchParams.get("eventIndex");
        if (
          hasEventIndex &&
          eventIndex &&
          Number.isInteger(Number(eventIndex))
        ) {
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
      }) => {
        return [
          requestHash,
          proposalHash,
          disputeHash,
          settlementHash,
          assertionHash,
        ].includes(state.transactionHash);
      },
    );

    // adding this because sometimes event indexes are not exact
    function eventDistanceScore(value: number, target: number) {
      const distance = Math.abs(value - target);
      if (distance === 0) return 4;
      const maxDistance = Math.max(distance, 10);
      return -(maxDistance / 10);
    }
    function score(a: OracleQueryUI) {
      let score = 0;
      if (a.requestHash === state.transactionHash) {
        score += 4;
        if (exists(state.eventIndex) && exists(a.requestLogIndex)) {
          score += eventDistanceScore(
            Number(a.requestLogIndex),
            Number(state.eventIndex),
          );
        }
      }
      if (a.proposalHash === state.transactionHash) {
        score += 3;
        if (exists(state.eventIndex) && exists(a.proposalLogIndex)) {
          score += eventDistanceScore(
            Number(a.proposalLogIndex),
            Number(state.eventIndex),
          );
        }
      }
      if (a.disputeHash === state.transactionHash) {
        score += 2;
        if (exists(state.eventIndex) && exists(a.disputeLogIndex)) {
          score += eventDistanceScore(
            Number(a.disputeLogIndex),
            Number(state.eventIndex),
          );
        }
      }
      if (a.settlementHash === state.transactionHash) {
        score += 1;
        if (exists(state.eventIndex) && exists(a.settlementLogIndex)) {
          score += eventDistanceScore(
            Number(a.settlementLogIndex),
            Number(state.eventIndex),
          );
        }
      }
      if (a.assertionHash === state.transactionHash) {
        score += 4;
        if (exists(state.eventIndex) && exists(a.assertionLogIndex)) {
          score += eventDistanceScore(
            Number(a.assertionLogIndex),
            Number(state.eventIndex),
          );
        }
      }
      return score;
    }
    // sort these by highest score. this is in case we get into a situation where we have
    // a matches dispute tx, b matchs request tx. always prefer request tx match, so we score
    // those higher. so that when we match event ids, we take the higher score tx automatically.
    forTx.sort((a, b) => {
      return score(b) - score(a);
    });
    const query = forTx[0];
    const query2 = forTx[1];
    // only update if we have a score above 0, and theres no tie between first and second, otherwise lets not show a match
    if (
      query &&
      score(query) > 0 &&
      ((query && !query2) || (query && query2 && score(query) > score(query2)))
    ) {
      setState((draft) => {
        draft.query = castDraft(query);
      });
      return; // Exit early if we found a match via transaction hash
    }

    // Fallback to legacy request details matching only if transaction hash matching failed
    if (!isLegacyRequestDetails) return;

    const {
      chainId,
      oracleType,
      requester,
      timestamp,
      identifier,
      ancillaryData,
    } = state;

    const legacyQuery = find<OracleQueryUI>(queries, {
      chainId: chainId as ChainId,
      identifier,
      requester: lowerCase(requester),
      oracleType: getOracleType(oracleType),
      timeUNIX: Number(timestamp),
      queryTextHex: ancillaryData,
    });

    setState((draft) => {
      draft.query = castDraft(legacyQuery);
    });
  }, [
    isHashAndIndex,
    isLegacyRequestDetails,
    queries,
    setState,
    state.eventIndex,
    state.transactionHash,
  ]);
}
