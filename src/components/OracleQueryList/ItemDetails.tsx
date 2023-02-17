import { getValueText } from "@/helpers";
import type { OracleQueryUI, Page } from "@/types";
import styled from "styled-components";
import { Currency } from "../Currency";
import { LivenessProgressBar } from "../LivenessProgressBar";

export function ItemDetails({
  page,
  timeMilliseconds,
  livenessEndsMilliseconds,
  currency,
  formattedBond,
  formattedReward,
  price,
  assertion,
}: OracleQueryUI & { page: Page }) {
  const verifyDetails = (
    <Wrapper>
      <InnerWrapper>
        <Text>Proposal/Assertion</Text>
        <Text>{getValueText({ price, assertion })}</Text>
      </InnerWrapper>
      {livenessEndsMilliseconds !== undefined && (
        <InnerWrapper>
          <Text>Challenge Period Left</Text>
          <LivenessProgressBar
            startTime={timeMilliseconds}
            endTime={livenessEndsMilliseconds}
            fontSize={12}
            marginBottom={0}
          />
        </InnerWrapper>
      )}
    </Wrapper>
  );

  const proposeDetails = (
    <Wrapper>
      <InnerWrapper>
        <Text>Bond</Text>
        <Text>
          <Currency amount={formattedBond} currency={currency} />
        </Text>
      </InnerWrapper>
      <InnerWrapper>
        <Text>Reward</Text>
        <Text>
          <Currency amount={formattedReward} currency={currency} />
        </Text>
      </InnerWrapper>
    </Wrapper>
  );

  const settledDetails = (
    <Wrapper>
      <InnerWrapper>
        <Text>Settled As</Text>
        <Text>{getValueText({ price, assertion })}</Text>
      </InnerWrapper>
    </Wrapper>
  );

  const detailsForPage = {
    verify: verifyDetails,
    propose: proposeDetails,
    settled: settledDetails,
  };

  const details = detailsForPage[page];

  return details;
}

const Wrapper = styled.div``;

const InnerWrapper = styled.div`
  min-height: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--grey-500);
`;

const Text = styled.p`
  font: var(--body-xs);
`;
