import { ethersErrorCodes, mobileAndUnder } from "@/constants";
import type { ErrorMessage as ErrorMessageType } from "@/types";
import NextLink from "next/link";
import styled from "styled-components";

export function ErrorMessage({ text, link }: ErrorMessageType) {
  const isEthersError = ethersErrorCodes.some((code) => text.includes(code));

  const [firstPart, secondPart] = text.split("[");

  const ethersErrorLink = secondPart
    .replace("See:", "")
    .replace("]", "")
    .trim();

  return (
    <Wrapper>
      {isEthersError ? (
        <span>
          {firstPart}.{" "}
          <Link href={ethersErrorLink} target="_blank">
            Learn more.
          </Link>
        </span>
      ) : (
        <span>
          {text}.{" "}
          {link && (
            <Link href={link.href} target="_blank">
              {link.text}
            </Link>
          )}
        </span>
      )}
    </Wrapper>
  );
}

export const Wrapper = styled.p`
  font: var(--text-md);

  @media ${mobileAndUnder} {
    font: var(--text-xs);
  }
`;

const Link = styled(NextLink)`
  font: inherit;
  color: inherit;
  text-decoration: underline;
`;
