import { darkText, white } from "@/constants";
import Close from "public/assets/icons/close.svg";
import styled, { CSSProperties } from "styled-components";

interface Props {
  onClick: () => void;
  size?: CSSProperties["width"];
  variant?: "light" | "dark";
  className?: string;
}
export function CloseButton({
  onClick,
  size = 14,
  variant = "light",
  className,
}: Props) {
  const style = {
    "--size": typeof size === "number" ? `${size}px` : size,
    "--fill": variant === "light" ? white : darkText,
  } as CSSProperties;

  return (
    <Button
      onClick={onClick}
      style={style}
      aria-label="Close"
      className={className}
    >
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
