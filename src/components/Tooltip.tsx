import * as RadixTooltip from "@radix-ui/react-tooltip";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  content: ReactNode;
}
export function Tooltip({ children, content }: Props) {
  return (
    <RadixTooltip.Provider>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>
          <span>{children}</span>
        </RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content>
            {content}
            <RadixTooltip.Arrow />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}
