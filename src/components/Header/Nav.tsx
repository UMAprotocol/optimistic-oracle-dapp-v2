import { grey400, navLinks, white } from "@/constants";
import { isExternalLink } from "@/helpers";
import NextLink from "next/link";
import ExternalLink from "public/assets/external-link.svg";
import styled from "styled-components";
import { useIsClient } from "usehooks-ts";

export function Nav() {
  // todo: add closePanel on routeChangeStart once panel is implemented

  const isClient = useIsClient();

  function isActive(href: string) {
    if (!isClient) return false;
    return window.location.href.includes(href);
  }
  return (
    <Wrapper>
      <NavItems>
        {navLinks.map(({ title, href }) => (
          <NavItem key={href}>
            <Link
              href={href}
              target={isExternalLink(href) ? "_blank" : undefined}
              style={{ "--color": isActive(href) ? white : grey400 }}
            >
              {title} {isExternalLink(href) && <ExternalLinkIcon />}
            </Link>
          </NavItem>
        ))}
      </NavItems>
    </Wrapper>
  );
}

const Wrapper = styled.nav`
  display: flex;
  align-items: center;
`;

const NavItems = styled.ul`
  list-style: none;
  display: flex;
  align-items: center;
  gap: 32px;
`;

const NavItem = styled.li``;

const Link = styled(NextLink)`
  display: flex;
  align-items: center;
  gap: 4px;
  text-decoration: none;
  transition: opacity var(--animation-duration);
  font: var(--body-md);
  color: var(--color);

  &:hover {
    opacity: 0.8;
  }
`;

const ExternalLinkIcon = styled(ExternalLink)`
  path {
    stroke: var(--color);
  }
`;
