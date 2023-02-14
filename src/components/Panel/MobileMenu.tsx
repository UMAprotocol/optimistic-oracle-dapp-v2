import { navLinks, socialLinks } from "@/constants";
import { isExternalLink } from "@/helpers";
import NextLink from "next/link";
import Close from "public/assets/icons/close.svg";
import Discord from "public/assets/icons/social/discord.svg";
import Discourse from "public/assets/icons/social/discourse.svg";
import Github from "public/assets/icons/social/github.svg";
import Medium from "public/assets/icons/social/medium.svg";
import Twitter from "public/assets/icons/social/twitter.svg";
import Logo from "public/assets/logo.svg";
import styled from "styled-components";
import { ConnectButton } from "../ConnectButton";
import { Base } from "./Base";

interface Props {
  panelOpen: boolean;
  closePanel: () => void;
}
export function MobileMenu({ panelOpen, closePanel }: Props) {
  const socialIcons = {
    Discord: DiscordIcon,
    Discourse: DiscourseIcon,
    Github: GithubIcon,
    Medium: MediumIcon,
    Twitter: TwitterIcon,
  };

  return (
    <Base panelOpen={panelOpen} closePanel={closePanel}>
      <AccountWrapper>
        <AccountTitle>Account</AccountTitle>
        <AddressWrapper>0x12345678910111213</AddressWrapper>
        <ConnectButton />
        <CloseButton>
          <CloseIcon />
        </CloseButton>
      </AccountWrapper>
      <Nav>
        <UL>
          {navLinks.map(({ href, label }) => (
            <LI key={href}>
              <Link
                href={href}
                target={isExternalLink(href) ? "_blank" : undefined}
              >
                {label}
              </Link>
            </LI>
          ))}
        </UL>
      </Nav>
      <SocialLinksWrapper>
        {socialLinks.map(({ href, label }) => (
          <Link href={href} target="_blank" key={href}>
            {socialIcons[label]}
          </Link>
        ))}
      </SocialLinksWrapper>
      <PoweredByUmaWrapper>
        <PoweredByUmaText>Powered by</PoweredByUmaText>
        <LogoIcon />
      </PoweredByUmaWrapper>
    </Base>
  );
}

const AccountWrapper = styled.div``;

const AccountTitle = styled.h1``;

const AddressWrapper = styled.div``;

const CloseButton = styled.button`
  background: transparent;
  margin-top: 6px;
`;

const CloseIcon = styled(Close)``;

const Nav = styled.nav``;

const UL = styled.ul``;

const LI = styled.li``;

const Link = styled(NextLink)``;

const SocialLinksWrapper = styled.div``;

const PoweredByUmaWrapper = styled.div``;

const PoweredByUmaText = styled.p``;

const LogoIcon = styled(Logo)``;

const DiscordIcon = styled(Discord)``;

const DiscourseIcon = styled(Discourse)``;

const GithubIcon = styled(Github)``;

const MediumIcon = styled(Medium)``;

const TwitterIcon = styled(Twitter)``;
