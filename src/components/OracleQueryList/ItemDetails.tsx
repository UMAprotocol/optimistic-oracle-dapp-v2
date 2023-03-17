import { useTokenInfo } from "@/hooks/tokenInfo";
import type { OracleQueryUI } from "@/types";
import type { PageName } from "@shared/types";
import { Currency } from "../Currency";
import { LivenessProgressBar } from "../LivenessProgressBar";
import {
  ItemDetailsInnerWrapper,
  ItemDetailsText,
  ItemDetailsWrapper,
} from "./style";

export function ItemDetails({
  page,
  item,
}: {
  item: OracleQueryUI;
  page: PageName;
}) {
  const {
    timeMilliseconds,
    livenessEndsMilliseconds,
    formattedBond,
    formattedReward,
    valueText,
  } = item;
  const { token } = useTokenInfo(item);

  const hasBond = formattedBond !== null;
  const hasReward = formattedReward !== null;

  const verifyDetails = (
    <ItemDetailsWrapper>
      <ItemDetailsInnerWrapper>
        <ItemDetailsText>Proposal/Assertion</ItemDetailsText>
        <ItemDetailsText>{valueText}</ItemDetailsText>
      </ItemDetailsInnerWrapper>
      {livenessEndsMilliseconds !== null && (
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

  const proposeDetails =
    hasBond || hasReward ? (
      <ItemDetailsWrapper>
        {hasBond && (
          <ItemDetailsInnerWrapper>
            <ItemDetailsText>Bond</ItemDetailsText>
            <ItemDetailsText>
              <Currency formattedAmount={formattedBond} token={token} />
            </ItemDetailsText>
          </ItemDetailsInnerWrapper>
        )}
        {hasReward && (
          <ItemDetailsInnerWrapper>
            <ItemDetailsText>Reward</ItemDetailsText>
            <ItemDetailsText>
              <Currency formattedAmount={formattedReward} token={token} />
            </ItemDetailsText>
          </ItemDetailsInnerWrapper>
        )}
      </ItemDetailsWrapper>
    ) : null;

  const settledDetails = (
    <ItemDetailsWrapper>
      <ItemDetailsInnerWrapper>
        <ItemDetailsText>Settled As</ItemDetailsText>
        <ItemDetailsText>{valueText}</ItemDetailsText>
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
