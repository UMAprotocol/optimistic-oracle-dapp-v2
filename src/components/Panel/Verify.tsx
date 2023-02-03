import { Button } from "@/components";
import USDC from "public/assets/icons/currencies/usdc.svg";
import Info from "public/assets/icons/info.svg";
import Pencil from "public/assets/icons/pencil.svg";
import styled from "styled-components";

export function Verify() {
  return (
    <>
      <DetailsWrapper>
        <SectionTitleWrapper>
          <PencilIcon />
          <SectionTitleText>
            <strong>Assertion</strong> (proposal)
          </SectionTitleText>
        </SectionTitleWrapper>
        <ValueWrapper>
          <ValueText>True</ValueText>
        </ValueWrapper>
        <DetailsInnerWrapper>
          <DetailWrapper>
            <DetailText>
              Dispute Bond
              <InfoIcon />
            </DetailText>
            <DetailText>
              <USDCIcon />
              $500
            </DetailText>
          </DetailWrapper>
          <DetailWrapper>
            <DetailText>
              Dispute Reward
              <InfoIcon />
            </DetailText>
            <DetailText>
              <USDCIcon />
              $500
            </DetailText>
          </DetailWrapper>
          <DetailWrapper>
            <DetailText>
              Challenge period left
              <InfoIcon />
            </DetailText>
            <DetailText>53 min 11 sec</DetailText>
          </DetailWrapper>
        </DetailsInnerWrapper>
        <ActionButtonWrapper>
          <Button
            variant="primary"
            onClick={() => alert("action")}
            width="100%"
          >
            Dispute
          </Button>
        </ActionButtonWrapper>
      </DetailsWrapper>
    </>
  );
}

const DetailsWrapper = styled.div`
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

const DetailsInnerWrapper = styled.div`
  margin-bottom: 16px;
`;

const DetailWrapper = styled.div`
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

const DetailText = styled.p`
  display: flex;
  align-items: center;
`;

const USDCIcon = styled(USDC)`
  display: inline-block;
  margin-right: 8px;
`;

const ActionButtonWrapper = styled.div``;
