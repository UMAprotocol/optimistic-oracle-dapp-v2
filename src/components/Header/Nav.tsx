import { blueGrey400, navLinks, white } from "@/constants";
import { isActiveRoute, isExternalLink } from "@/helpers";
import NextLink from "next/link";
import { useRouter } from "next/router";
import ExternalLink from "public/assets/icons/external-link.svg";
import type { CSSProperties } from "styled-components";
import styled from "styled-components";

export function Nav() {
  const router = useRouter();

  return (
    <Wrapper>
      <NavItems>
        {navLinks.map(({ label, href }) => (
          <NavItem key={href}>
            <Link
              href={href}
              target={isExternalLink(href) ? "_blank" : undefined}
              style={
                {
                  "--color": isActiveRoute(router.pathname, href)
                    ? white
                    : blueGrey400,
                } as CSSProperties
              }
            >
              {label} {isExternalLink(href) && <ExternalLinkIcon />}
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
