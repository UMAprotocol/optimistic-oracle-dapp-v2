import { navLinks } from "@/constants";
import { isExternalLink } from "@/helpers";
import NextLink from "next/link";
import ExternalLink from "public/assets/icons/external-link.svg";
import styled from "styled-components";

export function Nav() {
  // todo: add closePanel on routeChangeStart once panel is implemented
  return (
    <Wrapper>
      <NavItems>
        {navLinks.map(({ title, href }) => (
          <NavItem key={href}>
            <Link
              href={href}
              target={isExternalLink(href) ? "_blank" : undefined}
            >
              {title} {isExternalLink(href) && <ExternalLinkIcon />}
            </Link>
          </NavItem>
        ))}
      </NavItems>
    </Wrapper>
  );
}

const Wrapper = styled.nav``;

const NavItems = styled.ul`
  list-style: none;
`;

const NavItem = styled.li``;

const Link = styled(NextLink)``;

const ExternalLinkIcon = styled(ExternalLink)``;
