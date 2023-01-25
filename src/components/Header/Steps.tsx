import { Page } from "@/types";
import styled from "styled-components";
import { Step } from "./Step";

export function Steps({ page }: { page: Exclude<Page, "settled"> }) {
  const stepsForPages = {
    verify: [
      "Check if the queries and statements are correct and some more text maybe.",
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
`;
