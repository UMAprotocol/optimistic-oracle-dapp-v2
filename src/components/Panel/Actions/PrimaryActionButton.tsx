"use client";
import { Button } from "@/components/Button";
import {
  earlyProposalKey,
  ProposalModal,
} from "@/components/Modals/ProposalModal";
import { Tooltip } from "@/components/Tooltip";
import { propose } from "@/constants";
import { capitalizeFirstLetter } from "@/helpers";
import type { ActionState } from "@/hooks";
import { useState, type ReactNode } from "react";
import { useLocalStorage } from "usehooks-ts";

export function PrimaryActionButton({
  action,
  title,
  disabled,
  disabledReason,
}: ActionState) {
  const [showWarning] = useLocalStorage(earlyProposalKey, true);
  const [showWarningModal, setShowWarningModal] = useState(false);

  function handleAction() {
    // make this more generic if we plan on showing warnings/confirmation for other actions
    if (title !== propose || !showWarning) {
      action?.();
    } else {
      setShowWarningModal(true);
    }
  }

  return (
    <div>
      <InnerWrapper disabled={disabled} disabledReason={disabledReason}>
        <Button
          variant="primary"
          onClick={handleAction}
          disabled={disabled}
          width="100%"
        >
          {capitalizeFirstLetter(title)}
        </Button>
      </InnerWrapper>

      <ProposalModal
        onOpenChange={setShowWarningModal}
        open={showWarningModal}
        onContinue={action}
      />
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
