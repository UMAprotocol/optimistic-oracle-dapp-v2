import { tabletAndUnder } from "@/constants";
import type { PageName } from "@shared/types";
import styled from "styled-components";
import { Step } from "./Step";

export function Steps({ page }: { page: Exclude<PageName, "settled"> }) {
  const stepsForPages = {
    verify: [
      "Proposers post a bond to assert that a piece of data is correct.",
      "During the challenge period, data proposals are verified and can be disputed.",
      "If correctly disputed, the data is not used and the challenger receives a reward.",
    ],
    propose: [
      "Data consumers post reward bounties in return for data.",
      "Proposers can post a bond to answer a data request.",
      "If a proposal goes unchallenged, the proposer receives the reward after liveness.",
    ],
  };

  const steps = stepsForPages[page];

  return (
    <Wrapper>
      {steps.map((text, index) => (
        <Step key={text} number={index} text={text} />
      ))}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-inline: 32px;
  padding-block: 24px;
  background: linear-gradient(
    180deg,
    var(--blue-grey-600) 0%,
    transparent 100%
  );
  border: 1px solid var(--blue-grey-500);
  border-radius: 4px;

  @media ${tabletAndUnder} {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding: 20px 30px 12px 16px;
  }
`;
