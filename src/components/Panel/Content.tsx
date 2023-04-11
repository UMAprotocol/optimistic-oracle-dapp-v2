import { tabletAndUnder } from "@/constants";
import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef } from "react";
import { FocusOn } from "react-focus-on";
import styled from "styled-components";

interface Props {
  children: ReactNode;
  panelOpen: boolean;
  closePanel: () => void;
}
export function Content({ children, panelOpen, closePanel }: Props) {
  const contentRef = useRef<HTMLDivElement>(null);

  // Scroll to top when panel opens
  useEffect(() => {
    if (panelOpen) {
      contentRef?.current?.scrollTo({ top: 0 });
    }
  }, [panelOpen]);

  return (
    <FocusOn enabled={panelOpen} onEscapeKey={closePanel} focusLock={false}>
      <Wrapper
        ref={contentRef}
        role="dialog"
        aria-modal={panelOpen}
        aria-labelledby="panel-title"
        style={
          {
            "--right": panelOpen ? 0 : "var(--panel-width)",
          } as CSSProperties
        }
      >
        {children}
      </Wrapper>
    </FocusOn>
  );
}

const Wrapper = styled.div`
  width: var(--panel-width);
  min-height: 100%;
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  margin: 0;
  padding: 0;
  transform: translateX(var(--right));
  background: var(--white);
  overflow-y: scroll;
  transition: transform 400ms;
  z-index: 1;
  /* Sets inline padding to be used by children */
  --padding-inline: 28px;
  @media ${tabletAndUnder} {
    --padding-inline: var(--page-padding);
  }
`;
