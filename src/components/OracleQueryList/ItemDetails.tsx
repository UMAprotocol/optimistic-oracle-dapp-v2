import { getValueText } from "@/helpers";
import type { OracleQueryUI, Page } from "@/types";
import { Currency } from "../Currency";
import { LivenessProgressBar } from "../LivenessProgressBar";
import {
  ItemDetailsInnerWrapper,
  ItemDetailsText,
  ItemDetailsWrapper,
} from "./style";

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
    <ItemDetailsWrapper>
      <ItemDetailsInnerWrapper>
        <ItemDetailsText>Proposal/Assertion</ItemDetailsText>
        <ItemDetailsText>{getValueText({ price, assertion })}</ItemDetailsText>
      </ItemDetailsInnerWrapper>
      {livenessEndsMilliseconds !== undefined && (
        <ItemDetailsInnerWrapper>
          <ItemDetailsText>Challenge Period Left</ItemDetailsText>
          <LivenessProgressBar
            startTime={timeMilliseconds}
            endTime={livenessEndsMilliseconds}
            fontSize={12}
            marginBottom={0}
          />
        </ItemDetailsInnerWrapper>
      )}
    </ItemDetailsWrapper>
  );

  const proposeDetails = (
    <ItemDetailsWrapper>
      <ItemDetailsInnerWrapper>
        <ItemDetailsText>Bond</ItemDetailsText>
        <ItemDetailsText>
          <Currency amount={formattedBond} currency={currency} />
        </ItemDetailsText>
      </ItemDetailsInnerWrapper>
      <ItemDetailsInnerWrapper>
        <ItemDetailsText>Reward</ItemDetailsText>
        <ItemDetailsText>
          <Currency amount={formattedReward} currency={currency} />
        </ItemDetailsText>
      </ItemDetailsInnerWrapper>
    </ItemDetailsWrapper>
  );

  const settledDetails = (
    <ItemDetailsWrapper>
      <ItemDetailsInnerWrapper>
        <ItemDetailsText>Settled As</ItemDetailsText>
        <ItemDetailsText>{getValueText({ price, assertion })}</ItemDetailsText>
      </ItemDetailsInnerWrapper>
    </ItemDetailsWrapper>
  );

  const detailsForPage = {
    verify: verifyDetails,
    propose: proposeDetails,
    settled: settledDetails,
  };

  const details = detailsForPage[page];

  return details;
}
