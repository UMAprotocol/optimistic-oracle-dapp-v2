import { addOpacityToColor } from "@/helpers";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  panelOpen: boolean;
  closePanel: () => void;
}
export function Overlay({ panelOpen, closePanel }: Props) {
  const overlayVisibleColor = addOpacityToColor("var(--blue-grey-700)", 0.75);
  const overlayHiddenColor = addOpacityToColor("var(--blue-grey-700)", 0);

  return (
    <AnimatePresence>
      {panelOpen && (
        <motion.div
          className="fixed top-0 left-0 right-0 bottom-0 w-full h-full z-10"
          onClick={closePanel}
          initial={{ backgroundColor: overlayHiddenColor }}
          animate={{ backgroundColor: overlayVisibleColor }}
          exit={{ backgroundColor: overlayHiddenColor }}
        />
      )}
    </AnimatePresence>
  );
}
