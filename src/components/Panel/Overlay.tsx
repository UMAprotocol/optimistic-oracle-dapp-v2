import { blueGrey700 } from "@/constants";
import { addOpacityToHsl } from "@/helpers";
import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";

interface Props {
  panelOpen: boolean;
  closePanel: () => void;
}
export function Overlay({ panelOpen, closePanel }: Props) {
  const overlayVisibleColor = addOpacityToHsl(blueGrey700, 0.75);
  const overlayHiddenColor = addOpacityToHsl(blueGrey700, 0);

  return (
    <AnimatePresence>
      {panelOpen && (
        <StyledOverlay
          onClick={closePanel}
          initial={{ backgroundColor: overlayHiddenColor }}
          animate={{ backgroundColor: overlayVisibleColor }}
          exit={{ backgroundColor: overlayHiddenColor }}
        />
      )}
    </AnimatePresence>
  );
}

const AnimatedOverlay = motion.div;

const StyledOverlay = styled(AnimatedOverlay)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  z-index: 1;
`;
