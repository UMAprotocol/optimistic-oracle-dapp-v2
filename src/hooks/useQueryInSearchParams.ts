import type { OracleQueryUI } from "@/types";
import { exists } from "@libs/utils";
import { castDraft } from "immer";
import { filter, find } from "lodash";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useImmer } from "use-immer";
import { useEffectOnce } from "usehooks-ts";
import { usePanelContext } from "./contexts";
import { useQueries } from "./queries";
import { useUrlBar } from "./useUrlBar";

type State = {
  transactionHash: string | undefined;
  eventIndex: string | undefined;
  query: OracleQueryUI | undefined;
};

export function useQueryInSearchParams() {
  const { openPanel, setQueryId } = usePanelContext();
  const { all: queries } = useQueries();
  const { searchParams } = useUrlBar();
  const router = useRouter();
  const [state, setState] = useImmer<State>({
    transactionHash: undefined,
    eventIndex: undefined,
    query: undefined,
  });
  const isHashAndIndex =
    exists(state.transactionHash) && exists(state.eventIndex);

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

  useEffect(() => {
    if (state.query) {
      setQueryId(state.query.id);
    }
  }, [setQueryId, state.query]);

  useEffect(() => {
    if (isHashAndIndex) {
      openPanel();
    }
  }, [isHashAndIndex, openPanel]);

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
}
