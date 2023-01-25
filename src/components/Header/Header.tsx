import styled from "styled-components";
import { NavBar } from "./NavBar";
import { VoteTicker } from "./VoteTicker";

export function Header() {
  return (
    <OuterWrapper>
      <InnerWrapper>
        <VoteTicker />
        <NavBar />
      </InnerWrapper>
    </OuterWrapper>
  );
}

const OuterWrapper = styled.header`
  min-height: var(--header-height);
  background: var(--blue-grey-700);
`;

const InnerWrapper = styled.div`
  max-width: var(--page-width);
  margin-inline: auto;
`;
