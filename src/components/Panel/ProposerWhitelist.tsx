import type { OracleQueryUI } from "@/types";
import { SectionSubTitle } from "./style";
import { useState } from "react";
import { useProposerWhitelist } from "@/hooks/useProposerWhitelist";
import Chevron from "public/assets/icons/chevron.svg";

export function ProposerWhitelist({ query }: { query: OracleQueryUI }) {
  const { data } = useProposerWhitelist(query);

  const whitelistEnabled = data?.isEnabled === true;

  const [showWhitelist, setShowWhitelist] = useState(false);
  function toggleShowBytes() {
    setShowWhitelist((prev) => !prev);
  }

  if (!data) {
    return null;
  }

  const whitelist = data?.allowedProposers;
  // whitelist DISABLED
  if (!whitelistEnabled) {
    return (
      <>
        <SectionSubTitle>Proposer Whitelist</SectionSubTitle>
        <p>Proposer whitelist disabled. Any address may propose.</p>
      </>
    );
  }
  // whitelist EMPTY
  if (whitelistEnabled && !whitelist?.length) {
    return (
      <>
        <SectionSubTitle>Proposer Whitelist</SectionSubTitle>
        <p>The request manager had disabled all proposals on this request.</p>
      </>
    );
  }

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
