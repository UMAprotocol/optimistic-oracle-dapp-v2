import { NavBar, VoteTicker } from "@/components";
import { ReactNode } from "react";
import styled from "styled-components";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <Main>
      <VoteTicker />
      <NavBar />
      {children}
    </Main>
  );
}

const Main = styled.main`
  height: 100%;
`;
