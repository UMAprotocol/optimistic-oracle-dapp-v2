"use client";

import { hideOnTabletAndUnder, showOnTabletAndUnder } from "@/helpers";
import NextLink from "next/link";
import Hamburger from "public/assets/icons/hamburger.svg";
import Logo from "public/assets/logo.svg";
import { useState } from "react";
import styled from "styled-components";
import { ConnectButton } from "./ConnectButton";
import { MobileMenu } from "./MobileMenu";
import { Nav } from "./Nav";
import { Modal } from "../Modal";

export function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function openMobileMenu() {
    setMobileMenuOpen(true);
  }

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  return (
    <Wrapper>
      <HomeButton href="/">
        <LogoIcon />
        <HomeButtonText>ORACLE</HomeButtonText>
      </HomeButton>
      <Modal />
      <NavWrapper>
        <Nav />
      </NavWrapper>
      <ConnectButtonWrapper>
        <ConnectButton />
      </ConnectButtonWrapper>
      <MobileMenuWrapper>
        <Button onClick={openMobileMenu} aria-label="open mobile menu">
          <HamburgerIcon />
        </Button>
        <MobileMenu panelOpen={mobileMenuOpen} closePanel={closeMobileMenu} />
      </MobileMenuWrapper>
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

const NavWrapper = styled.div`
  ${hideOnTabletAndUnder}
`;

const ConnectButtonWrapper = styled.div`
  ${hideOnTabletAndUnder}
`;

const MobileMenuWrapper = styled.div`
  ${showOnTabletAndUnder}
`;

const LogoIcon = styled(Logo)``;

const HomeButton = styled(NextLink)`
  display: flex;
  align-items: center;
  gap: 18px;
  background: none;
  border: none;
  text-decoration: none;
  color: var(--white);
  transition: opacity var(--animation-duration);

  &:hover {
    opacity: 0.8;
  }
`;

const HomeButtonText = styled.span``;

const HamburgerIcon = styled(Hamburger)``;

const Button = styled.button`
  background: transparent;
  transition: opacity var(--animation-duration);

  &:hover {
    opacity: 0.75;
  }
`;
