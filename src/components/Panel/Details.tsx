import { blueGrey700 } from "@/constants";
import { addOpacityToHsla } from "@/helpers";
import type { OracleQueryUI } from "@/types";
import Link from "next/link";
import AncillaryData from "public/assets/icons/ancillary-data.svg";
import Timestamp from "public/assets/icons/timestamp.svg";
import { Fragment } from "react";
import styled from "styled-components";
import { AdditionalTextData } from "./AdditionalTextData";
import { SectionTitle, SectionTitleWrapper, Text } from "./style";

export function Details({
  timeUTC,
  timeUNIX,
  description,
  queryText,
  queryTextHex,
  moreInformation,
}: OracleQueryUI) {
  return (
    <DetailsWrapper>
      <DetailWrapper>
        <SectionTitleWrapper>
          <TimestampIcon />
          <SectionTitle>Timestamp</SectionTitle>
        </SectionTitleWrapper>
        <Time>
          <TimeFormat>UTC</TimeFormat> {timeUTC}
        </Time>
        <Time>
          <TimeFormat>UNIX</TimeFormat> {timeUNIX}
        </Time>
      </DetailWrapper>
      <DetailWrapper>
        <SectionTitleWrapper>
          <AncillaryDataIcon />
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
          <AncillaryDataIcon />
          <SectionTitle>More information</SectionTitle>
        </SectionTitleWrapper>
        {moreInformation?.map(({ title, href, text }) => (
          <Fragment key={title}>
            <SectionSubTitle>{title}</SectionSubTitle>
            <Link href={href} target="_blank">
              {text}
            </Link>
          </Fragment>
        ))}
      </DetailWrapper>
    </DetailsWrapper>
  );
}

const DetailsWrapper = styled.div`
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

const SectionSubTitle = styled.h3`
  font: var(--body-sm);
  font-weight: 600;

  &:not(:first-child) {
    margin-top: 16px;
  }
`;

const Time = styled(Text)``;

const TimeFormat = styled.span`
  display: inline-block;
  margin-right: 32px;
`;

const TimestampIcon = styled(Timestamp)``;

const AncillaryDataIcon = styled(AncillaryData)``;
