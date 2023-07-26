import Chevron from "public/assets/icons/chevron.svg";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
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
          <div className="text-xs sm:text-base">
            <ReactMarkdown
              components={{
                a: (props) => (
                  <a
                    className="text-red-500 hover:underline"
                    {...props}
                    target="_blank"
                  />
                ),
              }}
            >
              {description}
            </ReactMarkdown>
          </div>
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
            <button
              className="flex items-center bg-none"
              onClick={toggleShowBytes}
            >
              Bytes{" "}
              <Chevron
                className="w-3 ml-2 transition-[transform] [&>path]:stroke-dark"
                style={{
                  transform: `rotate(${chevronRotation}deg)`,
                }}
              />
            </button>
          </SectionSubTitle>
          {showBytes && <Text>{queryTextHex}</Text>}
        </>
      )}
    </>
  );
}
