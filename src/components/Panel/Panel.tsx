import { LoadingSpinner, PanelBase } from "@/components";
import { addOpacityToColor, makeUrlParamsForQuery } from "@/helpers";
import { usePanelContext, useQueryWithId } from "@/hooks";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { LoadingSkeleton } from "../LoadingSkeleton";
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
          <div className="bg-grey-400 px-page-padding lg:px-7 pt-5 pb-6">
            <div className="flex gap-2 items-end mb-4">
              <LoadingSkeleton
                height={24}
                width={24}
                borderRadius="50%"
                baseColor={addOpacityToColor("var(--red-500)", 0.1)}
                highlightColor={addOpacityToColor("var(--red-500)", 0.2)}
              />{" "}
              <LoadingSkeleton height={16} width="200px" />
            </div>
            <div className="w-full h-[44px] rounded-sm bg-white flex items-center pl-2">
              <LoadingSkeleton width={80} height={18} />
            </div>
            <div className="mt-6">
              <div className="flex justify-between">
                <LoadingSkeleton width={80} />
                <LoadingSkeleton width={80} />
              </div>
              <div className="flex justify-between">
                <LoadingSkeleton width={100} />
                <LoadingSkeleton width={80} />
              </div>
              <div className="flex justify-between">
                <LoadingSkeleton width={120} />
                <LoadingSkeleton width={80} />
              </div>
            </div>
          </div>
          <div className="pt-16 px-page-padding lg:px-7 grid place-items-center">
            <LoadingSpinner variant="black" size={32} />
          </div>
        </>
      )}
    </PanelBase>
  );
}
