import Warning from "public/assets/icons/warning.svg";
import { ErrorWrapper } from "../style";
import { sanitizeErrorMessage } from "@/helpers";

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
          <Warning className="shrink-0 h-4 w-4" />

          <p className="text-xs w-full min-w-0 sm:text-base text-red-500 break-words inline-block">
            {sanitizeErrorMessage(message)}
          </p>
        </ErrorWrapper>
      ))}
    </>
  );
}
