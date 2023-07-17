import { addOpacityToColor, makeUrlParamsForQuery } from "@/helpers";
import type { OracleQueryUI } from "@/types";
import type { PageName } from "@shared/types";
import Warning from "public/assets/icons/warning.svg";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { ErrorWrapper, Link, Text } from "../style";

interface Props {
  query: OracleQueryUI;
  page: PageName;
  alreadySettled: boolean;
  alreadyProposed: boolean;
}
export function Message({
  query,
  page,
  alreadyProposed,
  alreadySettled,
}: Props) {
  const [message, setMessage] = useState<ReactNode>("");

  const hasMessage = message !== "";

  useEffect(() => {
    setMessage("");
    if (page === "settled") return;

    if (!alreadyProposed && !alreadySettled) return;

    const message = (
      <>
        This query has already been {alreadyProposed ? "proposed" : "settled"}.
        View it{" "}
        <Link
          href={{
            pathname: alreadyProposed ? "/" : "/settled",
            query: makeUrlParamsForQuery(query),
          }}
        >
          here.
        </Link>
      </>
    );

    setMessage(message);
  }, [page, query, alreadyProposed, alreadySettled]);

  if (!hasMessage) return null;

  return (
    <Wrapper>
      <WarningIcon />
      <MessageText>{message}</MessageText>
    </Wrapper>
  );
}

const Wrapper = styled(ErrorWrapper)`
  background: ${addOpacityToColor("var(--blue-grey-500)", 0.05)};
  border: 1px solid var(--blue-grey-500);
`;

const MessageText = styled(Text)`
  color: var(--blue-grey-500);
`;

const WarningIcon = styled(Warning)`
  path {
    fill: var(--blue-grey-500);
  }
`;
