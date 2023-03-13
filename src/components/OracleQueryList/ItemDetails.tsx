import { useComputed } from "@/hooks";
import type { OracleQueryUI } from "@/types";
import type { PageName } from "@shared/types";
import { useEffect } from "react";
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
  const { token, fetchCurrencyTokenInfo } = useComputed(item);

  useEffect(() => {
    !!fetchCurrencyTokenInfo && fetchCurrencyTokenInfo();
  }, [fetchCurrencyTokenInfo]);

  const hasBond = formattedBond !== undefined;
  const hasReward = formattedReward !== undefined;

  const verifyDetails = (
    <ItemDetailsWrapper>
      <ItemDetailsInnerWrapper>
        <ItemDetailsText>Proposal/Assertion</ItemDetailsText>
        <ItemDetailsText>{valueText}</ItemDetailsText>
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
