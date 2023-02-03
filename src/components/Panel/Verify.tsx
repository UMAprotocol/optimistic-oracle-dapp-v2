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
          <IconWrapper>
            <PencilIcon />
          </IconWrapper>
          <SectionTitleText>Assertion (proposal)</SectionTitleText>
        </SectionTitleWrapper>
        <ValueWrapper>
          <ValueText>True</ValueText>
        </ValueWrapper>
        <DetailWrapper>
          <DetailText>
            Dispute Bond
            <InfoIcon />
          </DetailText>
          <DetailValue>
            <USDCIcon />
            $500
          </DetailValue>
          <DetailText>
            Dispute Reward
            <InfoIcon />
          </DetailText>
          <DetailValue>
            <USDCIcon />
            $500
          </DetailValue>
          <DetailText>
            Challenge period left
            <InfoIcon />
          </DetailText>
          <DetailValue>
            <USDCIcon />
            53 min 11 sec
          </DetailValue>
          <ActionButtonWrapper>
            <Button variant="primary">Dispute</Button>
          </ActionButtonWrapper>
        </DetailWrapper>
      </DetailsWrapper>
    </>
  );
}

const DetailsWrapper = styled.div``;

const SectionTitleWrapper = styled.div``;

const IconWrapper = styled.div``;

const PencilIcon = styled(Pencil)``;

const SectionTitleText = styled.h2``;

const ValueWrapper = styled.div``;

const ValueText = styled.p``;

const DetailWrapper = styled.div``;

const InfoIcon = styled(Info)``;

const DetailText = styled.p``;

const USDCIcon = styled(USDC)``;

const DetailValue = styled.p``;

const ActionButtonWrapper = styled.div``;
