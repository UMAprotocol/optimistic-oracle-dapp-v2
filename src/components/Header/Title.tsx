import { mobileAndUnder } from "@/constants";
import { useOracleDataContext } from "@/hooks";
import type { PageName } from "@shared/types";
import Propose from "public/assets/icons/pages/propose.svg";
import Settled from "public/assets/icons/pages/settled.svg";
import Verify from "public/assets/icons/pages/verify.svg";
import styled from "styled-components";

export function Title({ page }: { page: PageName }) {
  const icons = {
    verify: <VerifyIcon />,
    propose: <ProposeIcon />,
    settled: <SettledIcon />,
  };

  const icon = icons[page];

  const { verify, propose, settled } = useOracleDataContext();

  const numVerifyStatements = verify?.length ?? 0;
  const numProposeRequests = propose?.length ?? 0;
  const numSettledStatements = settled?.length ?? 0;

  const pageTitles = {
    verify: (
      <>
        Verify <strong>{numVerifyStatements}</strong> statements
      </>
    ),
    propose: (
      <>
        Propose answers to <strong>{numProposeRequests}</strong> requests
      </>
    ),
    settled: (
      <>
        View <strong>{numSettledStatements}</strong> settled statements
      </>
    ),
  };

  const pageTitle = pageTitles[page];

  return (
    <Wrapper>
      <IconWrapper>{icon}</IconWrapper>
      <TextWrapper>
        <TitleText>{pageTitle}</TitleText>
        {page === "settled" && (
          <SubTitle>Recently settled UMA oracle requests</SubTitle>
        )}
      </TextWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: clamp(0.5rem, calc(0.17rem + 1.63vw), 1.5rem);
`;

const IconWrapper = styled.div`
  --icon-size: 54px;
  width: var(--icon-size);
  height: var(--icon-size);
`;

const VerifyIcon = styled(Verify)``;

const ProposeIcon = styled(Propose)``;

const SettledIcon = styled(Settled)``;

const TextWrapper = styled.div``;

const TitleText = styled.h1`
  color: var(--white);
  font: var(--header-md);
  font-size: clamp(2.5rem, 2rem + 2.5vw, 4rem);

  strong {
    font-weight: inherit;
    color: var(--red-500);
  }

  @media ${mobileAndUnder} {
    font-size: clamp(2rem, 1.8rem + 0.8vw, 2.5rem);
    line-height: clamp(3.4rem, 3rem + 1.8vw, 4.5rem);
  }
`;

const SubTitle = styled.h2`
  font: var(--body-sm);
  color: var(--white);
  max-width: 592px;
  margin-top: 4px;
  margin-left: 4px;
`;
