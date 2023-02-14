import { ConnectButton } from "@/components";
import { navLinks, red500, socialLinks } from "@/constants";
import { isActiveRoute, isExternalLink } from "@/helpers";
import NextLink from "next/link";
import { useRouter } from "next/router";
import Close from "public/assets/icons/close.svg";
import ExternalLink from "public/assets/icons/external-link.svg";
import Discord from "public/assets/icons/social/discord.svg";
import Discourse from "public/assets/icons/social/discourse.svg";
import Github from "public/assets/icons/social/github.svg";
import Medium from "public/assets/icons/social/medium.svg";
import Twitter from "public/assets/icons/social/twitter.svg";
import Logo from "public/assets/logo.svg";
import styled, { CSSProperties } from "styled-components";
import { Base } from "./Base";

interface Props {
  panelOpen: boolean;
  closePanel: () => void;
}
export function MobileMenu({ panelOpen, closePanel }: Props) {
  const router = useRouter();

  const socialIcons = {
    Discord: <DiscordIcon />,
    Discourse: <DiscourseIcon />,
    Github: <GithubIcon />,
    Medium: <MediumIcon />,
    Twitter: <TwitterIcon />,
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
        <NavItems>
          {navLinks.map(({ label, href }) => (
            <NavItem key={href}>
              <Link
                href={href}
                target={isExternalLink(href) ? "_blank" : undefined}
                style={
                  {
                    "--active-indicator-color": isActiveRoute(
                      router.pathname,
                      href
                    )
                      ? red500
                      : "transparent",
                  } as CSSProperties
                }
              >
                {label} {isExternalLink(href) && <ExternalLinkIcon />}
              </Link>
            </NavItem>
          ))}
        </NavItems>
      </Nav>
      <SocialLinksWrapper>
        {socialLinks.map(({ href, label }) => (
          <SocialLink href={href} target="_blank" key={href}>
            {socialIcons[label]}
          </SocialLink>
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

const CloseIcon = styled(Close)`
  path {
    fill: var(--grey-700);
  }
`;

const Nav = styled.nav``;

const NavItems = styled.ul``;

const NavItem = styled.li``;

const Link = styled(NextLink)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding-inline: 16px;
  font: var(--body-sm);
  color: var(--dark-text);
  border-left: 3px solid var(--active-indicator-color);
  border-bottom: 2px solid var(--grey-50);
  text-decoration: none;
  transition: background var(--animation-duration);

  &:hover {
    background: var(--grey-50);
  }
`;

const SocialLink = styled(NextLink)``;

const ExternalLinkIcon = styled(ExternalLink)``;

const SocialLinksWrapper = styled.div``;

const PoweredByUmaWrapper = styled.div``;

const PoweredByUmaText = styled.p``;

const LogoIcon = styled(Logo)``;

const DiscordIcon = styled(Discord)``;

const DiscourseIcon = styled(Discourse)``;

const GithubIcon = styled(Github)``;

const MediumIcon = styled(Medium)``;

const TwitterIcon = styled(Twitter)``;
