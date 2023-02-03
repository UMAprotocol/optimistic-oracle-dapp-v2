import { Button } from "@/components";
import USDC from "public/assets/icons/currencies/usdc.svg";
import Info from "public/assets/icons/info.svg";
import Pencil from "public/assets/icons/pencil.svg";
import styled from "styled-components";

export function Verify() {
  return (
    <>
      <ActionsWrapper>
        <SectionTitleWrapper>
          <PencilIcon />
          <SectionTitleText>
            <strong>Assertion</strong> (proposal)
          </SectionTitleText>
        </SectionTitleWrapper>
        <ValueWrapper>
          <ValueText>True</ValueText>
        </ValueWrapper>
        <ActionsInnerWrapper>
          <ActionWrapper>
            <ActionText>
              Dispute Bond
              <InfoIcon />
            </ActionText>
            <ActionText>
              <USDCIcon />
              $500
            </ActionText>
          </ActionWrapper>
          <ActionWrapper>
            <ActionText>
              Dispute Reward
              <InfoIcon />
            </ActionText>
            <ActionText>
              <USDCIcon />
              $500
            </ActionText>
          </ActionWrapper>
          <ActionWrapper>
            <ActionText>
              Challenge period left
              <InfoIcon />
            </ActionText>
            <ActionText>53 min 11 sec</ActionText>
          </ActionWrapper>
        </ActionsInnerWrapper>
        <ActionButtonWrapper>
          <Button
            variant="primary"
            onClick={() => alert("action")}
            width="100%"
          >
            Dispute
          </Button>
        </ActionButtonWrapper>
      </ActionsWrapper>
    </>
  );
}

const ActionsWrapper = styled.div`
  background: var(--grey-400);
  padding-inline: 28px;
  padding-top: 20px;
  padding-bottom: 24px;
`;

const SectionTitleWrapper = styled.div`
  display: flex;
  gap: 12px;
`;

const PencilIcon = styled(Pencil)``;

const SectionTitleText = styled.h2`
  font: var(--body-md);
  strong {
    font-weight: 700;
  }
`;

const ValueWrapper = styled.div`
  display: grid;
  align-items: center;
  min-height: 44px;
  margin-top: 16px;
  margin-bottom: 20px;
  padding-inline: 16px;
  border-radius: 4px;
  background: var(--white);
`;

const ValueText = styled.p`
  font: var(--body-md);
  font-weight: 600;
`;

const ActionsInnerWrapper = styled.div`
  margin-bottom: 16px;
`;

const ActionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  font: var(--body-sm);
  &:not(:last-child) {
    margin-bottom: 4px;
  }
`;

const InfoIcon = styled(Info)`
  display: inline-block;
  margin-left: 8px;
`;

const ActionText = styled.p`
  display: flex;
  align-items: center;
`;

const USDCIcon = styled(USDC)`
  display: inline-block;
  margin-right: 8px;
`;

const ActionButtonWrapper = styled.div``;
