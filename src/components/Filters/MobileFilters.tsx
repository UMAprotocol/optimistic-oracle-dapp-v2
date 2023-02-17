import { Button, CheckboxList, CloseButton, PanelBase } from "@/components";
import type { FilterOnCheckedChange, Filters } from "@/types";
import styled from "styled-components";

interface Props {
  panelOpen: boolean;
  closePanel: () => void;
  filters: Filters;
  onCheckedChange: FilterOnCheckedChange;
  resetCheckedFilters: () => void;
}
/**
 * A mobile filters component — shows a panel with filters.
 * @param panelOpen Whether the panel is open or not.
 * @param closePanel A callback function that is called when the panel is closed.
 * @param resetCheckedFilters A callback function that is called when the filters are reset.
 */
export function MobileFilters({
  panelOpen,
  closePanel,
  filters,
  onCheckedChange,
  resetCheckedFilters,
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
          <Button
            variant="secondary"
            width="100%"
            onClick={resetCheckedFilters}
          >
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
