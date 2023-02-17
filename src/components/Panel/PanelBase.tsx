import { Root as Portal } from "@radix-ui/react-portal";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { useIsClient } from "usehooks-ts";
import { Content } from "./Content";
import { Overlay } from "./Overlay";

interface Props {
  children: ReactNode;
  panelOpen: boolean;
  closePanel: () => void;
}
export function PanelBase({ children, panelOpen, closePanel }: Props) {
  const router = useRouter();
  const isClient = useIsClient();

  useEffect(() => {
    router.events.on("routeChangeStart", closePanel);

    return () => {
      router.events.off("routeChangeStart", closePanel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
