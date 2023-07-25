"use client";

import { PanelBase } from "@/components";
import { makeUrlParamsForQuery } from "@/helpers";
import { usePanelContext, useQueryById, useUrlBarContext } from "@/hooks";
import type { OracleQueryUI } from "@/types";
import { useCallback, useEffect } from "react";
import { Actions } from "./Actions";
import { Details } from "./Details";
import { InfoIcons } from "./InfoIcons";
import { Title } from "./Title";

/**
 * A panel that slides in from the right.
 * The panel adapts to the page it is used on.
 * @see `PanelContext`
 */
export function Panel() {
  const { queryId, panelOpen, closePanel } = usePanelContext();
  const query = useQueryById(queryId);
  const { addSearchParams, removeSearchParams } = useUrlBarContext();

  const addHashAndIndexToUrl = useCallback(
    (query: OracleQueryUI) => {
      const searchParams = makeUrlParamsForQuery(query);
      addSearchParams(searchParams);
    },
    [addSearchParams],
  );

  const removeHashAndIndexFromUrl = useCallback(() => {
    removeSearchParams("transactionHash", "eventIndex");
  }, [removeSearchParams]);

  useEffect(() => {
    if (query && panelOpen) {
      addHashAndIndexToUrl(query);
    } else {
      removeHashAndIndexFromUrl();
    }
  }, [addHashAndIndexToUrl, query, panelOpen, removeHashAndIndexFromUrl]);

  const close = useCallback(() => {
    closePanel();
  }, [closePanel]);

  const props = query
    ? {
        query,
        ...query,
        close,
      }
    : undefined;

  return (
    <PanelBase panelOpen={panelOpen} closePanel={close}>
      {props ? (
        <>
          <Title {...props} />
          <Actions {...props} />
          <InfoIcons {...props} />
          <Details {...props} />
        </>
      ) : (
        <div>loading...</div>
      )}
    </PanelBase>
  );
}
