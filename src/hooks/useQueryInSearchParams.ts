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
  const isHashAndIndex =
    isTransactionHash(state.transactionHash) && exists(state.eventIndex);
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
    const hasEventIndex = searchParams?.has("eventIndex");

    if (hasHash && hasEventIndex) {
      setState((draft) => {
        draft.transactionHash = searchParams.get("transactionHash")!;
        draft.eventIndex = searchParams.get("eventIndex")!;
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
        return (
          requestHash === state.transactionHash ||
          proposalHash === state.transactionHash ||
          disputeHash === state.transactionHash ||
          settlementHash === state.transactionHash ||
          assertionHash === state.transactionHash
        );
      },
    );

    const hasMultipleForTx = forTx.length > 1;

    const query =
      hasMultipleForTx && exists(state.eventIndex)
        ? find<OracleQueryUI>(
            forTx,
            ({
              requestLogIndex,
              proposalLogIndex,
              disputeLogIndex,
              settlementLogIndex,
              assertionLogIndex,
            }) => {
              return (
                requestLogIndex === state.eventIndex ||
                proposalLogIndex === state.eventIndex ||
                disputeLogIndex === state.eventIndex ||
                settlementLogIndex === state.eventIndex ||
                assertionLogIndex === state.eventIndex
              );
            },
          )
        : forTx[0];
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
