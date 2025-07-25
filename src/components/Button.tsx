import { isExternalLink } from "@/helpers";
import NextLink from "next/link";
import type { CSSProperties, ReactNode } from "react";
import styled from "styled-components";

interface Props {
  /**
   * use `primary` for the most important UI element on the page, `secondary` for the second most, and so on
   */
  variant?: "primary" | "secondary" | "tertiary";
  /**
   * button contents
   */
  children: ReactNode;
  /**
   * optional click handler
   */
  onClick?: () => void;
  /**
   * optional link
   */
  href?: string;
  /**
   * disables the button
   */
  disabled?: boolean;
  /**
   * optionally override the width
   */
  width?: CSSProperties["width"];
  /**
   * optionally override the height
   */
  height?: CSSProperties["height"];
  /**
   * optionally override the font size
   */
  fontSize?: number;
  /**
   * use type = "submit" for when used with a <form>
   */
  type?: "submit" | "button" | "link";
}
export function Button({
  variant = "tertiary",
  children,
  onClick,
  href,
  width = 200,
  height = 50,
  fontSize,
  disabled,
  type = "button",
}: Props) {
  width = typeof width === "string" ? width : `${width}px`;
  height = typeof height === "string" ? height : `${height}px`;

  const styles = {
    primary: {
      "--display": "grid",
      "--place-items": "center",
      "--color": "var(--white)",
      "--background-color": "var(--red-500)",
      "--hover-background-color": "var(--red-600)",
      "--width": width,
      "--height": height,
      "--border-radius": "4px",
      "--font-size": `${fontSize ? fontSize : 18}px`,
    } as CSSProperties,
    secondary: {
      "--display": "grid",
      "--place-items": "center",
      "--color": "var(--red-500)",
      "--background-color": "var(white)",
      "--hover-background-color": "var(--red-100)",
      "--width": width,
      "--height": height,
      "--border-radius": "4px",
      "--border": `1px solid ${"var(--red-500)"}`,
      "--font-size": `${fontSize ? fontSize : 18}px`,
    } as CSSProperties,
    tertiary: {
      "--color": "var(--red-500)",
      "--background-color": "transparent",
      "--font-size": `${fontSize ? fontSize : 16}px`,
    } as CSSProperties,
  };

  const style = styles[variant];

  return (
    <>
      {href ? (
        <_Link href={href} style={style}>
          {children}
        </_Link>
      ) : null}
      {type === "button" || type === "submit" ? (
        <_Button
          onClick={onClick}
          style={style}
          disabled={disabled}
          type={type}
        >
          {children}
        </_Button>
      ) : null}
    </>
  );
}

interface LinkProps {
  href: string;
  children: ReactNode;
  style: CSSProperties;
}
function _Link({ href, children, style }: LinkProps) {
  return (
    <Link
      href={href}
      style={style}
      target={isExternalLink(href) ? "_blank" : undefined}
    >
      {children}
    </Link>
  );
}

const Link = styled(NextLink)`
  display: var(--display);
  place-items: var(--place-items);
  width: var(--width);
  height: var(--height);
  text-decoration: none;
  color: var(--color);
  background-color: var(--background-color);
  border: var(--border);
  border-radius: var(--border-radius);
  font: var(--body-md);
  font-size: var(--font-size);

  &:hover {
    background-color: var(--hover-background-color);
  }

  transition: background-color var(--animation-duration);
`;

interface ButtonProps {
  onClick?: () => void;
  children: ReactNode;
  style: CSSProperties;
  disabled?: boolean;
  type?: "submit" | "button";
}
function _Button({ onClick, children, style, disabled, type }: ButtonProps) {
  return (
    <__Button onClick={onClick} style={style} disabled={disabled} type={type}>
      {children}
    </__Button>
  );
}

const __Button = styled.button`
  display: var(--display);
  place-items: var(--place-items);
  width: var(--width);
  height: var(--height);
  color: var(--color);
  background-color: var(--background-color);
  border: var(--border);
  border-radius: var(--border-radius);
  font: var(--body-md);
  font-size: var(--font-size);
  white-space: nowrap;

  &:hover {
    &:not(:disabled) {
      background-color: var(--hover-background-color);
    }
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.25;
  }

  transition:
    opacity,
    background-color var(--animation-duration);
`;
