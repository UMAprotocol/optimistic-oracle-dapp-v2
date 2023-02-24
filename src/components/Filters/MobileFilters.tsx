import { Button, CheckboxList, CloseButton, PanelBase } from "@/components";
import type { CheckboxItemsByFilterName, CheckedChangePayload } from "@/types";
import styled from "styled-components";

interface Props {
  panelOpen: boolean;
  closePanel: () => void;
  filters: CheckboxItemsByFilterName;
  onCheckedChange: (payload: CheckedChangePayload) => void;
  reset: () => void;
}

export function MobileFilters({
  panelOpen,
  closePanel,
  filters,
  onCheckedChange,
  reset,
}: Props) {
  return (
    <PanelBase panelOpen={panelOpen} closePanel={closePanel}>
      <TitleWrapper>
        <Title>Filters</Title>
        <CloseButton onClick={closePanel} />
      </TitleWrapper>
      <InnerWrapper>
        <CheckboxList filters={filters} onCheckedChange={onCheckedChange} />
        <ButtonsWrapper>
          <Button variant="primary" width="100%" onClick={closePanel}>
            Confirm
          </Button>
          <Button variant="secondary" width="100%" onClick={reset}>
            Reset filters
          </Button>
        </ButtonsWrapper>
      </InnerWrapper>
    </PanelBase>
  );
}

const TitleWrapper = styled.div`
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-inline: 16px;
  background: var(--blue-grey-700);
`;

const Title = styled.h1`
  font: var(--body-sm);
  font-weight: 700;
  color: var(--light-text);
`;

const InnerWrapper = styled.div`
  margin-top: 12px;
  padding-inline: var(--page-padding);
  padding-bottom: 32px;
`;

const ButtonsWrapper = styled.div`
  display: grid;
  gap: 16px;
`;
