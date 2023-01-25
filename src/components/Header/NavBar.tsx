import { ConnectButton } from "@/components";
import Logo from "public/assets/logo.svg";
import styled from "styled-components";
import { Nav } from "./Nav";

export function NavBar() {
  return (
    <Wrapper>
      <HomeButton>
        <LogoIcon />
        <HomeButtonText>ORACLE</HomeButtonText>
      </HomeButton>
      <Nav />
      <ConnectButton />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  height: var(--nav-bar-height);
  display: flex;
  justify-content: space-between;
  background: var(--blue-grey-700);
  font: var(--body-sm);
  font-size: 14px;
  color: var(--white);
`;

const LogoIcon = styled(Logo)``;

const HomeButton = styled.button`
  display: flex;
  align-items: center;
  gap: 18px;
  background: none;
  border: none;
  transition: opacity var(--animation-duration);

  &:hover {
    opacity: 0.8;
  }
`;

const HomeButtonText = styled.span``;
