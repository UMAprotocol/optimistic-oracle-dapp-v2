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

  return (
    <PanelBase panelOpen={panelOpen} closePanel={close}>
      {!!content && (
        <>
          <Title {...content} close={close} />
          <Actions query={content} />
          <InfoIcons {...content} />
          <Details {...content} />
        </>
      )}
    </PanelBase>
  );
}
