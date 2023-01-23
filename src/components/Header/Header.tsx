import { ConnectButton } from "@rainbow-me/rainbowkit";
import Logo from "public/assets/logo.svg";
import styled from "styled-components";
import { Nav } from "./Nav";

export function Header() {
  return (
    <Wrapper>
      <HomeButton>
        <LogoIcon />
      </HomeButton>
      <Nav />
      <ConnectButton />
    </Wrapper>
  );
}

const Wrapper = styled.div``;

const LogoIcon = styled(Logo)``;

const HomeButton = styled.button``;
