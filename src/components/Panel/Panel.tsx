"use client";

import { PanelBase } from "@/components";
import { usePanelContext } from "@/hooks";
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
  const { content, panelOpen, closePanel } = usePanelContext();

  function close() {
    void closePanel();
  }

  const props = content
    ? {
        query: content,
        ...content,
        close,
      }
    : undefined;

  return (
    <PanelBase panelOpen={panelOpen} closePanel={close}>
      {!!props && (
        <>
          <Title {...props} />
          <Actions {...props} />
          <InfoIcons {...props} />
          <Details {...props} />
        </>
      )}
    </PanelBase>
  );
}
