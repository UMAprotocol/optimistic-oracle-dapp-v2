import * as RadixTooltip from "@radix-ui/react-tooltip";
import type { ReactNode } from "react";
import styled, { keyframes } from "styled-components";

interface Props {
  children: ReactNode;
  content: ReactNode;
}
export function Tooltip({ children, content }: Props) {
  return (
    <RadixTooltip.Provider delayDuration={100}>
      <RadixTooltip.Root>
        <TriggerWrapper asChild>
          <Trigger>{children}</Trigger>
        </TriggerWrapper>
        <RadixTooltip.Portal>
          <Content sideOffset={4} alignOffset={4}>
            {content}
            <Arrow />
          </Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}

const slideRightAndFade = keyframes`
  from {
    opacity: 0;
    transform: translateX(-2px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideUpAndFade = keyframes`
from {
    opacity: 0;
    transform: translateY(2px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideDownAndFade = keyframes`
  from {
    opacity: 0;
    transform: translateY(-2px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideLeftAndFade = keyframes`
  from {
    opacity: 0;
    transform: translateX(2px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const Content = styled(RadixTooltip.Content)`
  max-width: 400px;
  padding: 20px;
  font: var(--body-sm);
  color: var(--dark-text);
  background: var(--white);
  border: 1px solid var(--dark-text);
  border-radius: 4px;
  box-shadow: var(--shadow-3);
  user-select: none;
  animation-duration: var(--animation-duration);
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, opacity;
  &[data-state="delayed-open"][data-side="top"] {
    animation-name: ${slideDownAndFade};
  }
  &[data-state="delayed-open"][data-side="right"] {
    animation-name: ${slideLeftAndFade};
  }
  &[data-state="delayed-open"][data-side="bottom"] {
    animation-name: ${slideUpAndFade};
  }
  &[data-state="delayed-open"][data-side="left"] {
    animation-name: ${slideRightAndFade};
  }
`;

const TriggerWrapper = styled(RadixTooltip.Trigger)``;

const Trigger = styled.span`
  button :is(:disabled) {
    pointer-events: none;
  }
`;

const Arrow = styled(RadixTooltip.Arrow)``;
