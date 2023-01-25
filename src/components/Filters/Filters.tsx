import styled from "styled-components";
import { Search } from "./Search";

export function Filters() {
  return (
    <Wrapper>
      <Search />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  min-height: 96px;
  display: flex;
  align-items: center;
  background: var(--white);
`;
