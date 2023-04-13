import Warning from "public/assets/icons/warning.svg";
import styled from "styled-components";
import { ErrorWrapper, Text } from "../style";

interface Props {
  errors: string[];
}
export function Errors({ errors }: Props) {
  const isError = errors.length > 0;

  if (!isError) return null;

  return (
    <>
      {errors.map((message) => (
        <ErrorWrapper key={message}>
          <WarningIcon />
          <ErrorText>{message}</ErrorText>
        </ErrorWrapper>
      ))}
    </>
  );
}

const ErrorText = styled(Text)`
  color: var(--red-500);
`;

const WarningIcon = styled(Warning)``;
