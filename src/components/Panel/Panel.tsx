import { PanelBase } from "@/components";
import { makeUrlParamsForQuery } from "@/helpers";
import { usePanelContext, useQueryWithId } from "@/hooks";
import { useRouter } from "next/router";
import { useEffect } from "react";
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
  const { id, panelOpen, closePanel } = usePanelContext();
  const query = useQueryWithId(id);
  const router = useRouter();
  function close() {
    void router.push({ query: {} }, undefined, { scroll: false });
    void closePanel();
  }

  useEffect(() => {
    if (!query || !panelOpen) return;

    const routerQuery = makeUrlParamsForQuery(query);

    void router.push({ query: routerQuery }, undefined, { scroll: false });
  }, [query, router, panelOpen]);

  const props =
    query !== undefined
      ? {
          query,
          ...query,
          close,
          isLoading: false,
        }
      : undefined;

  return (
    <PanelBase panelOpen={panelOpen} closePanel={close}>
      {!!props ? (
        <>
          <Title {...props} />
          <Actions {...props} />
          <InfoIcons {...props} />
          <Details {...props} />
        </>
      ) : (
        <>
          <Title isLoading={true} close={close} />
        </>
      )}
    </PanelBase>
  );
}
