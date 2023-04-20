import { Button } from "@/components/Button";
import { Tooltip } from "@/components/Tooltip";
import { capitalizeFirstLetter } from "@/helpers";
import type { ActionState } from "@/hooks";
import type { ReactNode } from "react";
import styled from "styled-components";

export function PrimaryActionButton({
  action,
  title,
  disabled,
  disabledReason,
}: ActionState) {
  return (
    <OuterWrapper>
      <InnerWrapper disabled={disabled} disabledReason={disabledReason}>
        <Button
          variant="primary"
          onClick={action}
          disabled={disabled}
          width="min(100%, var(--panel-content-width))"
        >
          {capitalizeFirstLetter(title)}
        </Button>
      </InnerWrapper>
    </OuterWrapper>
  );
}

function InnerWrapper({
  children,
  disabled,
  disabledReason,
}: {
  children: ReactNode;
  disabled: boolean | undefined;
  disabledReason: string | undefined;
}) {
  if (disabled && disabledReason) {
    return <Tooltip content={disabledReason}>{children}</Tooltip>;
  }
  return <>{children}</>;
}

const OuterWrapper = styled.div``;
