import { Button } from "@/components/Button";
import { capitalizeFirstLetter } from "@/helpers";
import type { ActionState } from "@/hooks";
import styled from "styled-components";

export function PrimaryActionButton({ action, disabled, title }: ActionState) {
  return (
    <Wrapper>
      <Button
        variant="primary"
        onClick={action}
        disabled={disabled}
        width="min(100%, var(--panel-content-width))"
      >
        {capitalizeFirstLetter(title)}
      </Button>
    </Wrapper>
  );
}

const Wrapper = styled.div``;
