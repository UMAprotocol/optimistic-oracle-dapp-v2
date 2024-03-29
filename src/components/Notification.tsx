"use client";

import { LoadingSpinner } from "@/components";
import { mobile, smallMobile, tablet } from "@/constants";
import type { Notification, UniqueId } from "@/types";
import {
  getBlockExplorerNameForChain,
  makeBlockExplorerLink,
} from "@shared/utils";
import NextLink from "next/link";
import Close from "public/assets/icons/close.svg";
import Failure from "public/assets/icons/failure.svg";
import Success from "public/assets/icons/success.svg";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useWindowSize } from "usehooks-ts";

export function Notification({
  message,
  id,
  chainId,
  transactionHash,
  type,
  dismiss,
  style,
}: Notification & {
  style: {
    opacity: number;
  };
  dismiss: (id: UniqueId) => void;
}) {
  const [iconSize, setIconSize] = useState(32);
  const { width } = useWindowSize();

  useEffect(() => {
    if (!width) return;

    if (width <= smallMobile) {
      setIconSize(16);
      return;
    }

    if (width <= mobile) {
      setIconSize(20);
      return;
    }

    if (width <= tablet) {
      setIconSize(28);
      return;
    }

    setIconSize(32);
  }, [width]);

  return (
    <Wrapper
      style={
        {
          ...style,
          "--icon-size": `${iconSize}px`,
        } as CSSProperties
      }
    >
      <IndicatorWrapper>
        {type === "pending" && (
          <LoadingSpinner variant="black" width={iconSize} height={iconSize} />
        )}
        {type === "error" && (
          <IconWrapper>
            <Failure />
          </IconWrapper>
        )}
        {type === "success" && (
          <IconWrapper>
            <Success />
          </IconWrapper>
        )}
      </IndicatorWrapper>
      <TextWrapper>
        <Message>{message}</Message>
        {transactionHash && chainId && (
          <Link
            href={makeBlockExplorerLink(transactionHash, chainId, "tx")}
            target="_blank"
          >
            View on {getBlockExplorerNameForChain(chainId)}
          </Link>
        )}
      </TextWrapper>
      <CloseButton onClick={() => dismiss(id)}>
        <CloseIconWrapper>
          <CloseIcon />
        </CloseIconWrapper>
      </CloseButton>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  display: flex;
  gap: calc(var(--icon-size) / 2);
  align-items: center;
  width: min(100%, 320px);
  min-height: 90px;
  padding: calc(var(--icon-size) / 2);
  padding-right: 20px;
  font: var(--body-sm);
  color: var(--dark-text);
  background: var(--white);
  border: 1px solid var(--blue-grey-700);
  border-radius: 5px;
  box-shadow: var(--shadow-3);
`;

const IndicatorWrapper = styled.div``;

const IconWrapper = styled.div`
  width: var(--icon-size);
`;

const TextWrapper = styled.div`
  display: grid;
  gap: 8px;
`;

const Message = styled.div``;

const Link = styled(NextLink)`
  color: var(--red-500);
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const CloseIconWrapper = styled.div``;

const CloseIcon = styled(Close)`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 12px;
  height: 12px;
  path {
    fill: var(--dark-text);
  }
`;
const CloseButton = styled.button`
  background: transparent;
`;
