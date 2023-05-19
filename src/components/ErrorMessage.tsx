import { mobileAndUnder } from "@/constants";
import type { ErrorMessage as ErrorMessageType } from "@shared/types";
import NextLink from "next/link";
import styled from "styled-components";

export function ErrorMessage({ text, link }: ErrorMessageType) {
  return (
    <Wrapper>
      <span>
        {text}.{" "}
        {link && (
          <Link href={link.href} target="_blank">
            {link.text}.
          </Link>
        )}
      </span>
    </Wrapper>
  );
}

export const Wrapper = styled.p`
  font: var(--text-md);
  color: var(--light-text);

  span {
    font: inherit;
    color: inherit;
  }

  @media ${mobileAndUnder} {
    font: var(--body-xs);
  }
`;

const Link = styled(NextLink)`
  font: inherit;
  color: inherit;
  text-decoration: underline;
  transition: opacity var(--animation-duration);

  &:hover {
    opacity: 0.75;
  }
`;
