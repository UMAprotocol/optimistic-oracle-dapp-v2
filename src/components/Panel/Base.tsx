import { Root as Portal } from "@radix-ui/react-portal";
import { ReactNode } from "react";
import { useIsClient } from "usehooks-ts";
import { Content } from "./Content";
import { Overlay } from "./Overlay";

interface Props {
  children: ReactNode;
  panelOpen: boolean;
  closePanel: () => void;
}
export function Base({ children, panelOpen, closePanel }: Props) {
  const isClient = useIsClient();

  if (!isClient) return null;

  return (
    <Portal>
      <Overlay panelOpen={panelOpen} closePanel={closePanel} />
      <Content panelOpen={panelOpen} closePanel={closePanel}>
        {children}
      </Content>
    </Portal>
  );
}
