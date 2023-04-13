import { tabletAndUnder } from "@/constants";
import type { PageName } from "@shared/types";
import styled from "styled-components";
import { Step } from "./Step";

export function Steps({ page }: { page: Exclude<PageName, "settled"> }) {
  const stepsForPages = {
    verify: [
      "Check if the queries and statements are correct",
      "During the challenge period you can dispute and some more text.",
      "Get rewarded if dispute gets voted in your favor maybe more text.",
    ],
    propose: [
      "Check if the queries and statements are correct and some more text maybe.",
      "During the challenge period you can dispute and some more text.",
      "Get rewarded if dispute gets voted in your favor maybe more text.",
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
