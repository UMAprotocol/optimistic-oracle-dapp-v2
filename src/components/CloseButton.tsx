import { darkText, white } from "@/constants";
import Close from "public/assets/icons/close.svg";
import type { CSSProperties } from "styled-components";
import styled from "styled-components";

interface Props {
  onClick: () => void;
  size?: CSSProperties["width"];
  variant?: "light" | "dark";
  ariaLabel?: string;
}
/**
 * A close button component — shows an X icon.
 * @param onClick A callback function that is called when the button is clicked.
 * @param size The size of the button.
 * @param variant The color variant of the button (light or dark).
 */
export function CloseButton({
  onClick,
  size = 14,
  variant = "light",
  ariaLabel = "close",
}: Props) {
  const style = {
    "--size": typeof size === "number" ? `${size}px` : size,
    "--fill": variant === "light" ? white : darkText,
  } as CSSProperties;

  return (
    <Button onClick={onClick} style={style} aria-label={ariaLabel}>
      <CloseIcon />
    </Button>
  );
}

const CloseIcon = styled(Close)`
  width: var(--size);
  height: var(--size);

  path {
    fill: var(--fill);
  }
`;

const Button = styled.button`
  background: transparent;
`;
