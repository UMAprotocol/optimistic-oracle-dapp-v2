"use client";

import { PanelBase } from "@/components";
import { usePanelContext } from "@/hooks";
import { useCallback } from "react";
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
  const { query, panelOpen, closePanel } = usePanelContext();

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
