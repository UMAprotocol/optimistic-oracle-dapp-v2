import Chevron from "public/assets/icons/chevron.svg";
import type { ReactNode } from "react";
import { useState } from "react";
import type { CSSProperties } from "styled-components";
import styled from "styled-components";
import { SectionSubTitle, Text } from "./style";

interface Props {
  description: ReactNode;
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
          <Text>{description}</Text>
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
