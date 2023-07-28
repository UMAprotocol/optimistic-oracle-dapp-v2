import { smallMobileAndUnder } from "@/constants";
import { addOpacityToColor } from "@/helpers";
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

  &:hover {
    opacity: 0.75;
  }
`;

// we don't want to word-break the link in the message text
export const WordBreakLink = styled(Link)`
  word-break: break-all;
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

export const SectionSubTitle = styled.h3`
  font: var(--body-sm);
  font-weight: 600;

  margin-top: 16px;
`;

export const ErrorWrapper = styled.div`
  width: min(100%, var(--panel-content-width));
  min-height: 48px;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 20px;
  padding-inline: 16px;
  background: ${addOpacityToColor("var(--red-500)", 0.05)};
  border: 1px solid var(--red-500);
  border-radius: 2px;
`;
