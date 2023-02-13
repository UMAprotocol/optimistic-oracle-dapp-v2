import { Page } from "@/types";
import Propose from "public/assets/icons/pages/propose.svg";
import Settled from "public/assets/icons/pages/settled.svg";
import Verify from "public/assets/icons/pages/verify.svg";
import styled from "styled-components";

export function Title({ page }: { page: Page }) {
  const icons = {
    verify: <VerifyIcon />,
    propose: <ProposeIcon />,
    settled: <SettledIcon />,
  };

  const icon = icons[page];

  // todo: get these values from the sdk when implemented
  const numVerifyStatements = 19;
  const numProposeRequests = 256;
  const numSettledStatements = 123456;

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
      {icon}
      <TextWrapper>
        <TitleText>{pageTitle}</TitleText>
        {page === "settled" && (
          <SubTitle>
            A short explanation what this page is about and what the user can
            expect lorem ipsum text
          </SubTitle>
        )}
      </TextWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 22px;
`;

const VerifyIcon = styled(Verify)``;

const ProposeIcon = styled(Propose)``;

const SettledIcon = styled(Settled)``;

const TextWrapper = styled.div``;

const TitleText = styled.h1`
  font: var(--header-md);
  font-size: 52px;
  line-height: 72px;
  color: var(--white);

  strong {
    font-weight: inherit;
    color: var(--red-500);
  }
`;

const SubTitle = styled.h2`
  font: var(--body-sm);
  color: var(--white);
  max-width: 592px;
  margin-top: 4px;
  margin-left: 4px;
`;
