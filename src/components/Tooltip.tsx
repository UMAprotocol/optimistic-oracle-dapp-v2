import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  content: ReactNode;
}
export function Tooltip({ children, content }: Props) {
  return (
    <div>
      {children}
      {content}
    </div>
  );
}
