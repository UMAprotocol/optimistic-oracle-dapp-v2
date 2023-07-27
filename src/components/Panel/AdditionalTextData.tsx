import Chevron from "public/assets/icons/chevron.svg";
import type { CSSProperties } from "react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import styled from "styled-components";
import { SectionSubTitle, Text } from "./style";

interface Props {
  description: string | undefined;
  queryText: string | undefined;
  queryTextHex: string | undefined;
}
export function AdditionalTextData({
  description,
  queryText,
  queryTextHex,
}: Props) {
  const [showBytes, setShowBytes] = useState(false);
  const hasDescription = !!description && description !== "0x";
  const hasQueryText = !!queryText && queryText !== "0x";
  const hasQueryTextHex = !!queryTextHex && queryTextHex !== "0x";
  const chevronRotation = showBytes ? 0 : 180;

  function toggleShowBytes() {
    setShowBytes((prev) => !prev);
  }

  return (
    <>
      {hasDescription && (
        <>
          <SectionSubTitle>Description</SectionSubTitle>
          <Text as="div">
            <ReactMarkdown
              components={{
                a: (props) => <A {...props} target="_blank" />,
              }}
            >
              {description}
            </ReactMarkdown>
          </Text>
        </>
      )}
      {hasQueryText && (
        <>
          <SectionSubTitle>String</SectionSubTitle>
          <Text>{queryText}</Text>
        </>
      )}
      {hasQueryTextHex && (
        <>
          <SectionSubTitle>
            <ToggleShowBytesButton onClick={toggleShowBytes}>
              Bytes{" "}
              <ChevronIcon
                style={
                  {
                    "--rotation": `${chevronRotation}deg`,
                  } as CSSProperties
                }
              />
            </ToggleShowBytesButton>
          </SectionSubTitle>
          {showBytes && <Text>{queryTextHex}</Text>}
        </>
      )}
    </>
  );
}

const ChevronIcon = styled(Chevron)`
  width: 12px;
  margin-left: 8px;
  transform: rotate(var(--rotation));
  transition: transform var(--animation-duration);
  path {
    stroke: var(--dark-text);
  }
`;

const ToggleShowBytesButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
`;

const A = styled.a`
  color: var(--red-500);
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;
