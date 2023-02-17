import type { ReactNode } from "react";
import type { CSSProperties } from "styled-components";

/**
 * Wraps an icon in a span element with a fixed width and height.
 * This is useful for icons that are not square, and for icons that are not absolutely sized for responsiveness.
 * @param width The width of the icon.
 * @param height The height of the icon.
 * @param display The display property of the icon.
 * @param children The icon to wrap.
 * @returns The wrapped icon.
 */
export function IconWrapper({
  width = 15,
  height = 15,
  display = "block",
  children,
}: {
  width?: number;
  height?: number;
  display?: CSSProperties["display"];
  children: ReactNode;
}) {
  return <span style={{ width, height, display }}>{children}</span>;
}
