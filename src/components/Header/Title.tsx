import { Page } from "@/types";
import Box from "public/assets/box.svg";
import styled from "styled-components";

export function Title({ page }: { page: Page }) {
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
      <BoxIcon />
      <TitleText>{pageTitle}</TitleText>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 22px;
`;

const BoxIcon = styled(Box)``;

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
