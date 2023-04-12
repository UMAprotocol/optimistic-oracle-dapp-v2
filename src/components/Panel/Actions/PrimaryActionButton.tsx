import { Button } from "@/components/Button";
import { capitalizeFirstLetter } from "@/helpers";
import type { ActionState } from "@/hooks";
import styled from "styled-components";

export function PrimaryActionButton({ action, disabled, title }: ActionState) {
  return (
    <ActionButtonWrapper>
      <Button
        variant="primary"
        onClick={action}
        disabled={disabled}
        width="min(100%, 512px)"
      >
        {capitalizeFirstLetter(title)}
      </Button>
    </ActionButtonWrapper>
  );
}

const ActionButtonWrapper = styled.div``;
