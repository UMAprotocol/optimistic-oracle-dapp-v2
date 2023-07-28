import Warning from "public/assets/icons/warning.svg";
import { ErrorWrapper } from "../style";

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
          <Warning />
          <p className="text-xs sm:text-base text-red-500">{message}</p>
        </ErrorWrapper>
      ))}
    </>
  );
}
