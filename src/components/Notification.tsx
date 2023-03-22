import { LoadingSpinner } from "@/components";
import type { Notification, UniqueId } from "@/types";
import NextLink from "next/link";
import Close from "public/assets/icons/close.svg";
import Failure from "public/assets/icons/failure.svg";
import Success from "public/assets/icons/success.svg";
import styled from "styled-components";

export function Notification({
  message,
  id,
  link,
  type,
  dismiss,
  style,
}: Notification & {
  style: {
    opacity: number;
  };
  dismiss: (id: UniqueId) => void;
}) {
  return (
    <Wrapper style={style}>
      <IndicatorWrapper>
        {type === "pending" && <LoadingSpinner variant="black" size={32} />}
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
        {link && (
          <Link href={link} target="_blank">
            View on Etherscan
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
  gap: 18px;
  align-items: center;
  width: 320px;
  min-height: 90px;
  padding: 20px;
  font: var(--body-sm);
  color: var(--dark-text);
  background: var(--white);
  border: 1px solid var(--blue-grey-700);
  border-radius: 5px;
  box-shadow: var(--shadow-3);
`;

const IndicatorWrapper = styled.div``;

const IconWrapper = styled.div`
  width: 32px;
  height: 32px;
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

const CloseIconWrapper = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 12px;
  height: 12px;
`;

const CloseIcon = styled(Close)`
  path {
    fill: var(--dark-text);
  }
`;
const CloseButton = styled.button`
  background: transparent;
`;
