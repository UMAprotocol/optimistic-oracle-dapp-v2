import { navLinks } from "@/constants";
import { isActiveRoute, isExternalLink } from "@/helpers";
import NextLink from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import ExternalLink from "public/assets/icons/external-link.svg";
import type { CSSProperties } from "react";
import styled from "styled-components";

export function Nav() {
  const pathname = usePathname()!;
  const searchParams = useSearchParams();

  return (
    <Wrapper>
      <NavItems>
        {navLinks.map(({ label, href }) => (
          <NavItem key={href}>
            <Link
              href={`${href}${
                searchParams ? `/?${searchParams.toString()}` : ""
              }`}
              target={isExternalLink(href) ? "_blank" : undefined}
              style={
                {
                  "--color": isActiveRoute(pathname, href)
                    ? "var(--white)"
                    : "var(--blue-grey-400)",
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
