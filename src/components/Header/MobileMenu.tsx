import { CloseButton, PanelBase } from "@/components";
import { navLinks, red500, socialLinks } from "@/constants";
import { isActiveRoute, isExternalLink } from "@/helpers";
import NextLink from "next/link";
import { useRouter } from "next/router";
import ExternalLink from "public/assets/icons/external-link.svg";
import Discord from "public/assets/icons/social/discord.svg";
import Discourse from "public/assets/icons/social/discourse.svg";
import Github from "public/assets/icons/social/github.svg";
import Medium from "public/assets/icons/social/medium.svg";
import Twitter from "public/assets/icons/social/twitter.svg";
import Logo from "public/assets/logo.svg";
import styled, { CSSProperties } from "styled-components";
import { MobileMenuConnectButton } from "./MobileMenuConnectButton";

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
    <PanelBase panelOpen={panelOpen} closePanel={closePanel}>
      <AccountWrapper>
        <AccountTitleWrapper>
          <AccountTitle>Account</AccountTitle>
          <CloseButton onClick={closePanel} variant="dark" />
        </AccountTitleWrapper>
        <MobileMenuConnectButton />
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
          <SocialLink
            href={href}
            target="_blank"
            key={href}
            aria-label={`${label} link`}
          >
            {socialIcons[label]}
          </SocialLink>
        ))}
      </SocialLinksWrapper>
      <PoweredByUmaWrapper>
        <PoweredByUmaText>
          Powered by <LogoIcon />
        </PoweredByUmaText>
      </PoweredByUmaWrapper>
    </PanelBase>
  );
}

const AccountWrapper = styled.div`
  background: var(--grey-400);
  padding-block: 20px;
  padding-inline: 16px;
`;

const AccountTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const AccountTitle = styled.h1`
  font: var(--body-sm);
  font-weight: 700;
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

const SocialLink = styled(NextLink)`
  transition: opacity var(--animation-duration);

  &:hover {
    opacity: 0.75;
  }
`;

const ExternalLinkIcon = styled(ExternalLink)``;

const SocialLinksWrapper = styled.div`
  display: flex;
  gap: 32px;
  justify-content: center;
  margin-top: 72px;
`;

const PoweredByUmaWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
`;

const PoweredByUmaText = styled.p`
  font: var(--body-xs);
  color: var(--red-500);
`;

const LogoIcon = styled(Logo)`
  display: inline-block;
  width: 34px;
  margin-left: 2px;
  path {
    fill: var(--red-500);
  }
`;

const DiscordIcon = styled(Discord)``;

const DiscourseIcon = styled(Discourse)``;

const GithubIcon = styled(Github)``;

const MediumIcon = styled(Medium)``;

const TwitterIcon = styled(Twitter)``;
