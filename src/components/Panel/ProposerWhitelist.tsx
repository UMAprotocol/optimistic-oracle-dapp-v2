import type { OracleQueryUI } from "@/types";
import { SectionSubTitle } from "./style";
import { useState } from "react";
import { useProposerWhitelist } from "@/hooks/useProposerWhitelist";
import Chevron from "public/assets/icons/chevron.svg";

export function ProposerWhitelist({ query }: { query: OracleQueryUI }) {
  const { data } = useProposerWhitelist(query);
  const whitelist = data?.allowedProposers;

  const [showWhitelist, setShowWhitelist] = useState(false);
  function toggleShowBytes() {
    setShowWhitelist((prev) => !prev);
  }
  if (!whitelist || !whitelist.length) return null;

  return (
    <>
      <SectionSubTitle>
        <button className="flex items-center bg-none" onClick={toggleShowBytes}>
          Proposer Whitelist{" "}
          <Chevron
            className="w-3 ml-2 transition-[transform] [&>path]:stroke-dark"
            style={{
              transform: `rotate(${showWhitelist ? 0 : 180}deg)`,
            }}
          />
        </button>
      </SectionSubTitle>
      {showWhitelist &&
        whitelist.map((address) => (
          <p className="text-xs sm:text-base break-words" key={address}>
            {address}
          </p>
        ))}
    </>
  );
}
