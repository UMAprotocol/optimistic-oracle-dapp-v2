import { mobileAndUnder, tabletAndUnder } from "@/constants";
import React from "react";
import styled from "styled-components";

export type BannerProps = {
  children: React.ReactNode;
  className?: string;
};

export function Banner({ children, className }: BannerProps) {
  return (
    <BannerWrapper className={className}>
      <InnerBannerWrapper>{children}</InnerBannerWrapper>
    </BannerWrapper>
  );
}

export const BannerWrapper = styled.div`
  background: var(--red-500);
  max-width: 100vw;
  color: var(--light-text);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-block: 16px;
  padding-inline: var(--page-padding);

  @media ${mobileAndUnder} {
    padding-block: 8px;
  }
`;

export const InnerBannerWrapper = styled.div`
  width: 100%;
  max-width: var(--page-width);
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding-block: 4px;
  &:not(:last-child) {
    margin-bottom: 4px;
  }

  @media ${tabletAndUnder} {
    padding-inline: 0;
  }
`;
