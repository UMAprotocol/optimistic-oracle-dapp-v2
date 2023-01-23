import { Button } from "@/components";
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
      <Button
        variant="primary"
        onClick={() => console.log("clicked")}
        label="Connect wallet"
      />
    </Wrapper>
  );
}

const Wrapper = styled.div``;

const LogoIcon = styled(Logo)``;

const HomeButton = styled.button``;
