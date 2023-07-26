import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { FocusOn } from "react-focus-on";

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
      <div
        className="w-panel-width min-h-full right-0 fixed top-0 bottom-0 m-0 p-0 bg-white overflow-y-scroll transition-transform z-10"
        ref={contentRef}
        role="dialog"
        aria-modal={panelOpen}
        aria-labelledby="panel-title"
        style={{
          transform: `translateX(${panelOpen ? "0" : "var(--panel-width)"})`,
        }}
      >
        {children}
      </div>
    </FocusOn>
  );
}
