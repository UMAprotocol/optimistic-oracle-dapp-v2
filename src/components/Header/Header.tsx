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
        {page === "settled" ? (
          <Text>
            A short explanation what this page is about and what the user can
            expect lorem ipsum text
          </Text>
        ) : (
          <Steps page={page} />
        )}
      </InnerWrapper>
    </OuterWrapper>
  );
}

const OuterWrapper = styled.header`
  min-height: var(--header-height);
  background: var(--blue-grey-700);
  padding-top: 16px;
  padding-bottom: 40px;
`;

const InnerWrapper = styled.div`
  display: grid;
  gap: 36px;
  max-width: var(--page-width);
  margin-inline: auto;
`;

const Text = styled.p`
  font: var(--body-sm);
  color: var(--white);
  max-width: 592px;
`;
