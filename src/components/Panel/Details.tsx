import type { OracleQueryUI } from "@/types";
import AncillaryData from "public/assets/icons/ancillary-data.svg";
import Timestamp from "public/assets/icons/timestamp.svg";
import { Fragment } from "react";
import { AdditionalTextData } from "./AdditionalTextData";
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
}: OracleQueryUI) {
  return (
    <div className="pb-16 px-page-padding lg:px-7">
      <DetailWrapper>
        <SectionTitleWrapper>
          <Timestamp />
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
          <AncillaryData />
          <SectionTitle>Additional Text Data</SectionTitle>
        </SectionTitleWrapper>
        <AdditionalTextData
          description={description}
          queryText={queryText}
          queryTextHex={queryTextHex}
        />
      </DetailWrapper>
      <DetailWrapper>
        <SectionTitleWrapper>
          <AncillaryData />
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
    </div>
  );
}

function DetailWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="[&:not(:first-child)]:pt-6 [&:not(:last-child)]:border-b-blue-grey-700/25">
      {children}
    </div>
  );
}

function TimeFormat({ children }: { children: React.ReactNode }) {
  return <span className="inline-block mr-8">{children}</span>;
}
