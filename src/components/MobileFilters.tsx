import { ReactNode } from "react";
import styled from "styled-components";
import { Button } from "./Button";
import { CloseButton } from "./CloseButton";
import { Base } from "./Panel/Base";

interface Props {
  children: ReactNode;
  panelOpen: boolean;
  closePanel: () => void;
  resetCheckedFilters: () => void;
}
export function MobileFilters({
  children,
  panelOpen,
  closePanel,
  resetCheckedFilters,
}: Props) {
  return (
    <Base panelOpen={panelOpen} closePanel={closePanel}>
      <TitleWrapper>
        <Title>Filters</Title>
        <CloseButton onClick={closePanel} />
      </TitleWrapper>
      <InnerWrapper>
        {children}
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
    </Base>
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
