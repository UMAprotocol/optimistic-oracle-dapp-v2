import { blueGrey700 } from "@/constants";
import { addOpacityToHsla } from "@/helpers";
import type { OracleQueryUI } from "@/types";
import AncillaryData from "public/assets/icons/ancillary-data.svg";
import Timestamp from "public/assets/icons/timestamp.svg";
import { Fragment } from "react";
import styled from "styled-components";
import { AdditionalTextData } from "./AdditionalTextData";
import { RatedAssertionTextData } from "./RatedAssertionTextData";
import {
  SectionSubTitle,
  SectionTitle,
  SectionTitleWrapper,
  Text,
  WordBreakLink,
} from "./style";

export function Details({
  timeUTC,
  timeUNIX,
  proposalTimeUTC,
  proposalTimeUNIX,
  settlementTimeUTC,
  settlementTimeUNIX,
  disputeTimeUTC,
  disputeTimeUNIX,
  description,
  queryText,
  queryTextHex,
  moreInformation,
  project,
  chainId,
}: OracleQueryUI) {
  const isRated = project === "Rated";

  return (
    <Wrapper>
      <DetailWrapper>
        <SectionTitleWrapper>
          <TimestampIcon />
          <SectionTitle>Timestamp</SectionTitle>
        </SectionTitleWrapper>
        <SectionSubTitle>Requested Time</SectionSubTitle>
        <Text>
          <TimeFormat>UTC</TimeFormat> {timeUTC}
        </Text>
        <Text>
          <TimeFormat>UNIX</TimeFormat> {timeUNIX}
        </Text>
        {!!proposalTimeUTC && !!proposalTimeUNIX && (
          <>
            <SectionSubTitle>Proposed Time</SectionSubTitle>
            <Text>
              <TimeFormat>UTC</TimeFormat> {proposalTimeUTC}
            </Text>
            <Text>
              <TimeFormat>UNIX</TimeFormat> {proposalTimeUNIX}
            </Text>
          </>
        )}
        {!!disputeTimeUTC && !!disputeTimeUNIX && (
          <>
            <SectionSubTitle>Disputed Time</SectionSubTitle>
            <Text>
              <TimeFormat>UTC</TimeFormat> {disputeTimeUTC}
            </Text>
            <Text>
              <TimeFormat>UNIX</TimeFormat> {disputeTimeUNIX}
            </Text>
          </>
        )}
        {!!settlementTimeUTC && !!settlementTimeUNIX && (
          <>
            <SectionSubTitle>Settled Time</SectionSubTitle>
            <Text>
              <TimeFormat>UTC</TimeFormat> {settlementTimeUTC}
            </Text>
            <Text>
              <TimeFormat>UNIX</TimeFormat> {settlementTimeUNIX}
            </Text>
          </>
        )}
      </DetailWrapper>
      <DetailWrapper>
        <SectionTitleWrapper>
          <AncillaryDataIcon />
          <SectionTitle>Additional Text Data</SectionTitle>
        </SectionTitleWrapper>
        {isRated && queryText ? (
          <RatedAssertionTextData queryText={queryText} chainId={chainId} />
        ) : (
          <AdditionalTextData
            description={description}
            queryText={queryText}
            queryTextHex={queryTextHex}
          />
        )}
      </DetailWrapper>
      <DetailWrapper>
        <SectionTitleWrapper>
          <AncillaryDataIcon />
          <SectionTitle>More information</SectionTitle>
        </SectionTitleWrapper>
        {moreInformation?.map(({ title, href, text }) => (
          <Fragment key={title}>
            <SectionSubTitle>{title}</SectionSubTitle>
            <WordBreakLink href={href} target="_blank">
              {text}
            </WordBreakLink>
          </Fragment>
        ))}
      </DetailWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  padding-inline: var(--padding-inline);
  padding-bottom: 64px;
`;

const DetailWrapper = styled.div`
  padding-bottom: 20px;
  &:not(:first-child) {
    padding-top: 22px;
  }
  &:not(:last-child) {
    border-bottom: 1px solid ${addOpacityToHsla(blueGrey700, 0.25)};
  }
`;

const TimeFormat = styled.span`
  display: inline-block;
  margin-right: 32px;
`;

const TimestampIcon = styled(Timestamp)``;

const AncillaryDataIcon = styled(AncillaryData)``;
