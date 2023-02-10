import { ethersErrorCodes, mobileAndUnder } from "@/constants";
import type { ErrorMessage as ErrorMessageType } from "@/types";
import NextLink from "next/link";
import styled from "styled-components";

export function ErrorMessage({ text, link }: ErrorMessageType) {
  const isEthersError = ethersErrorCodes.some((code) => text.includes(code));

  function ethersErrorLink() {
    if (!isEthersError) return null;

    const [firstPart, secondPart] = text.split("[");

    const ethersErrorLink = secondPart
      .replace("See:", "")
      .replace("]", "")
      .trim();

    return (
      <span>
        {firstPart.trim()}.{" "}
        <Link href={ethersErrorLink} target="_blank">
          Learn more.
        </Link>
      </span>
    );
  }

  return (
    <Wrapper>
      {isEthersError ? (
        <>{ethersErrorLink()}</>
      ) : (
        <span>
          {text}.{" "}
          {link && (
            <Link href={link.href} target="_blank">
              {link.text}.
            </Link>
          )}
        </span>
      )}
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
