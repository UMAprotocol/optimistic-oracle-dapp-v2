import { smallMobileAndUnder } from "@/constants";
import NextLink from "next/link";
import styled from "styled-components";

export const Text = styled.p`
  font: var(--body-sm);
  @media ${smallMobileAndUnder} {
    font: var(--body-xs);
  }
`;

export const Link = styled(NextLink)`
  font: var(--body-sm);
  font-size: inherit;
  text-decoration: none;
  color: var(--red-500);
  transition: opacity var(--animation-duration);
  word-break: break-all;

  &:hover {
    opacity: 0.75;
  }
`;

// we don't want to word-break the link in the message text
export const MessageLink = styled(Link)`
  word-break: normal;
`;

export const SectionTitleWrapper = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
`;

export const SectionTitle = styled.h2`
  font: var(--body-md);
  font-weight: 700;

  span {
    font-weight: 400;
  }
`;
