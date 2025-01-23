import { Button } from "@/components/Button";
import { Tooltip } from "@/components/Tooltip";
import { capitalizeFirstLetter } from "@/helpers";
import type { ActionState } from "@/hooks";
import type { ReactNode } from "react";

export function PrimaryActionButton({
  action,
  title,
  disabled,
  disabledReason,
}: ActionState) {
  return (
    <div>
      <InnerWrapper disabled={disabled} disabledReason={disabledReason}>
        <Button
          variant="primary"
          onClick={action}
          disabled={disabled}
          width="100%"
        >
          {capitalizeFirstLetter(title)}
        </Button>
      </InnerWrapper>
    </div>
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
