import { mobileAndUnder } from "@/constants";
import { Page } from "@/types";
import styled from "styled-components";
import { NavBar } from "./NavBar";
import { Steps } from "./Steps";
import { Title } from "./Title";
import { VoteTicker } from "./VoteTicker";

export function Header({ page }: { page: Page }) {
  return (
    <OuterWrapper>
      <InnerWrapper>
        <VoteTicker />
        <NavBar />
        <Title page={page} />
        {page !== "settled" && <Steps page={page} />}
      </InnerWrapper>
    </OuterWrapper>
  );
}

const OuterWrapper = styled.header`
  min-height: var(--header-height);
  background: var(--blue-grey-700);
  padding-inline: var(--page-padding);
  padding-top: 16px;
  padding-bottom: 40px;
`;

const InnerWrapper = styled.div`
  display: grid;
  gap: 36px;
  max-width: var(--page-width);
  margin-inline: auto;

  @media ${mobileAndUnder} {
    gap: 24px;
  }
`;
