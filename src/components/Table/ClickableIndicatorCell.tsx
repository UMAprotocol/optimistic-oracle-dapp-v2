import Clickable from "public/assets/icons/clickable.svg";
import styled from "styled-components";
import { TD } from "./style";

/**
 * Let's the user know that the row is clickable.
 * Is not clickable itself, but changes color when hovered to indicate that clicking is possible.
 */
export function ClickableIndicatorCell() {
  return (
    <TD>
      <ClickableIcon />
    </TD>
  );
}

const ClickableIcon = styled(Clickable)``;
