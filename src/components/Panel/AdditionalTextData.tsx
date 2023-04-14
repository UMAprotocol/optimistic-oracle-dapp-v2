import { smallMobileAndUnder } from "@/constants";
import type { OracleQueryUI } from "@/types";
import Chevron from "public/assets/icons/chevron.svg";
import { useState } from "react";
import type { CSSProperties } from "styled-components";
import styled from "styled-components";

export function AdditionalTextData({
  description,
  queryText,
  queryTextHex,
}: OracleQueryUI) {
  const [showBytes, setShowBytes] = useState(false);
  const hasDescription = description !== "" && description !== "0x";
  const hasQueryText = queryText !== "" && queryText !== "0x";
  const hasQueryTextHex = queryTextHex !== "" && queryTextHex !== "0x";
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

const SectionSubTitle = styled.h3`
  font: var(--body-sm);
  font-weight: 600;

  margin-top: 16px;
`;

const Text = styled.p`
  font: var(--body-sm);
  @media ${smallMobileAndUnder} {
    font: var(--body-xs);
  }
`;

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
