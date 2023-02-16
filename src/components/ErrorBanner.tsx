import { CloseButton, ErrorMessage } from "@/components";
import { mobileAndUnder, tabletAndUnder } from "@/constants";
import { useErrorContext } from "@/hooks";
import Warning from "public/assets/icons/warning.svg";
import styled from "styled-components";

export function ErrorBanner() {
  const { errorMessages, removeErrorMessage } = useErrorContext();

  if (!errorMessages.length) return null;

  const uniqueErrorMessages = errorMessages.filter(
    (errorMessage, index) =>
      errorMessages.findIndex((error) => error.text === errorMessage.text) ===
      index
  );

  return (
    <Wrapper>
      {uniqueErrorMessages.map((errorMessage) => (
        <ErrorMessageWrapper key={errorMessage.text}>
          <WarningIcon />
          <ErrorMessage {...errorMessage} />
          <_CloseButton onClick={() => removeErrorMessage(errorMessage)} />
        </ErrorMessageWrapper>
      ))}
    </Wrapper>
  );
}

export const Wrapper = styled.div`
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

export const ErrorMessageWrapper = styled.div`
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

export const WarningIcon = styled(Warning)`
  path {
    fill: var(--white);
    stroke: var(--red-500);
  }

  --icon-size: 24px;
  width: var(--icon-size);

  @media ${tabletAndUnder} {
    --icon-size: 20px;
  }

  @media ${mobileAndUnder} {
    --icon-size: 16px;
  }
`;

const _CloseButton = styled(CloseButton)`
  margin-left: auto;
`;
