import { Button, DecimalInput } from "@/components";
import { blueGrey700, currencyIcons, projectIcons, red500 } from "@/constants";
import { addOpacityToHsla, getValueText } from "@/helpers";
import { usePanelContext } from "@/hooks";
import NextLink from "next/link";
import AncillaryData from "public/assets/icons/ancillary-data.svg";
import Close from "public/assets/icons/close.svg";
import Info from "public/assets/icons/info.svg";
import Pencil from "public/assets/icons/pencil.svg";
import Settled from "public/assets/icons/settled.svg";
import Timestamp from "public/assets/icons/timestamp.svg";
import Warning from "public/assets/icons/warning.svg";
import { CSSProperties, Fragment, useState } from "react";
import styled from "styled-components";
import { Base } from "./Base";
import { ChainIcon } from "./ChainIcon";
import { ExpiryTypeIcon } from "./ExpiryTypeIcon";
import { OoTypeIcon } from "./OoTypeIcon";

const errorBackgroundColor = addOpacityToHsla(red500, 0.05);

/**
 * A panel that slides in from the right.
 * The panel adapts to the page it is used on.
 * @see `PanelContext`
 * @see `PanelContent`
 */
export function Panel() {
  const { content, page, panelOpen, closePanel } = usePanelContext();
  const [inputValue, setInputValue] = useState("");

  const {
    chainId,
    oracleType,
    title,
    project,
    ancillaryData,
    decodedAncillaryData,
    timeUNIX,
    timeUTC,
    price,
    assertion,
    currency,
    formattedBond,
    formattedReward,
    formattedLivenessEndsIn,
    actionType,
    action,
    expiryType,
    moreInformation,
    error,
    setError,
  } = content ?? {};

  const projectIcon = project ? projectIcons[project] : undefined;
  const currencyIcon = currency ? currencyIcons[currency] : undefined;
  const actionsIcon = page === "settled" ? <SettledIcon /> : <PencilIcon />;
  const showActionsDetails = page !== "settled";
  const hasActionButton = action !== undefined && actionType !== undefined;
  const hasInput = page === "propose";
  const valueText = getValueText({ price, assertion });
  const actionsTitle = getActionsTitle();
  const isError = error !== "";

  function getActionsTitle() {
    if (page === "settled") return "Settled as";
    if (oracleType === "Optimistic Asserter")
      return (
        <>
          Assertion <span>(proposal)</span>
        </>
      );
    return (
      <>
        Request <span>(price)</span>
      </>
    );
  }

  return (
    <Base panelOpen={panelOpen} closePanel={closePanel}>
      <TitleWrapper>
        <ProjectIconWrapper>{projectIcon}</ProjectIconWrapper>
        <Title id="panel-title">{title}</Title>
        <CloseButton aria-label="close panel" onClick={closePanel}>
          <CloseIconWrapper>
            <CloseIcon />
          </CloseIconWrapper>
        </CloseButton>
      </TitleWrapper>
      <ActionsWrapper>
        <SectionTitleWrapper>
          {actionsIcon}
          <SectionTitle>{actionsTitle}</SectionTitle>
        </SectionTitleWrapper>
        {hasInput && setError ? (
          <InputWrapper>
            <DecimalInput
              value={inputValue}
              onInput={setInputValue}
              disabled={isError}
              addErrorMessage={setError}
              removeErrorMessage={() => setError("")}
            />
          </InputWrapper>
        ) : (
          <ValueWrapper
            style={
              {
                "--margin-bottom": showActionsDetails ? "20px" : "0px",
              } as CSSProperties
            }
          >
            <ValueText>{valueText}</ValueText>
          </ValueWrapper>
        )}
        {showActionsDetails && (
          <ActionsDetailsWrapper>
            <ActionWrapper>
              <ActionText>
                Bond
                <InfoIcon />
              </ActionText>
              <ActionText>
                {currencyIcon && (
                  <CurrencyIconWrapper>{currencyIcon}</CurrencyIconWrapper>
                )}
                {formattedBond} {!currencyIcon && currency}
              </ActionText>
            </ActionWrapper>
            <ActionWrapper>
              <ActionText>
                Reward
                <InfoIcon />
              </ActionText>
              <ActionText>
                {currencyIcon && (
                  <CurrencyIconWrapper>{currencyIcon}</CurrencyIconWrapper>
                )}
                {formattedReward} {!currencyIcon && currency}
              </ActionText>
            </ActionWrapper>
            <ActionWrapper>
              <ActionText>
                Challenge period ends in
                <InfoIcon />
              </ActionText>
              <ActionText>{formattedLivenessEndsIn}</ActionText>
            </ActionWrapper>
          </ActionsDetailsWrapper>
        )}
        {hasActionButton && (
          <ActionButtonWrapper>
            <Button variant="primary" onClick={action} width="min(100%, 512px)">
              {actionType}
            </Button>
          </ActionButtonWrapper>
        )}
        {isError && (
          <ErrorWrapper>
            <WarningIcon />
            <ErrorText>{error}</ErrorText>
          </ErrorWrapper>
        )}
      </ActionsWrapper>
      <InfoIconsWrapper>
        <ChainIcon chainId={chainId} />
        <OoTypeIcon ooType={oracleType} />
        {expiryType && <ExpiryTypeIcon expiryType={expiryType} />}
      </InfoIconsWrapper>
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
            <SectionTitle>Ancillary Data</SectionTitle>
          </SectionTitleWrapper>
          <SectionSubTitle>String</SectionSubTitle>
          <DetailText>{decodedAncillaryData}</DetailText>
          <SectionSubTitle>Bytes</SectionSubTitle>
          <DetailText>{ancillaryData}</DetailText>
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
    </Base>
  );
}

// wrappers

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  min-height: 84px;
  padding-inline: 28px;
  padding-block: 20px;
  background: var(--blue-grey-700);
`;

const SectionTitleWrapper = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
`;

const ActionsWrapper = styled.div`
  background: var(--grey-400);
  padding-inline: 28px;
  padding-top: 20px;
  padding-bottom: 24px;
`;

const ActionsDetailsWrapper = styled.div`
  margin-bottom: 16px;
`;

const ActionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  font: var(--body-sm);
  &:not(:last-child) {
    margin-bottom: 4px;
  }
`;

const ActionButtonWrapper = styled.div``;

const DetailsWrapper = styled.div`
  padding-inline: 28px;
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

const InfoIconsWrapper = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
  padding-inline: 28px;
  margin-bottom: 42px;
`;

const ProjectIconWrapper = styled.div``;

const CloseIconWrapper = styled.div`
  width: 20px;
  height: 20px;
`;

const ValueWrapper = styled.div`
  width: min(100%, 512px);
  display: grid;
  align-items: center;
  min-height: 44px;
  margin-top: 16px;
  margin-bottom: var(--margin-bottom);
  padding-inline: 16px;
  border-radius: 4px;
  background: var(--white);
`;

const InputWrapper = styled.div`
  margin-top: 16px;
  margin-bottom: 20px;
`;

const CurrencyIconWrapper = styled.div`
  margin-right: 8px;
`;

const ErrorWrapper = styled.div`
  width: min(100%, 512px);
  display: flex;
  gap: 16px;
  margin-top: 20px;
  padding-inline: 16px;
  padding-block: 12px;
  background: ${errorBackgroundColor};
  border: 1px solid var(--red-500);
  border-radius: 2px;
`;

// titles

const Title = styled.h1`
  max-width: 400px;
  font: var(--body-md);
  color: var(--light-text);
`;

const SectionTitle = styled.h2`
  font: var(--body-md);
  font-weight: 700;

  span {
    font-weight: 400;
  }
`;

const SectionSubTitle = styled.h3`
  font: var(--body-sm);
  font-weight: 600;

  &:not(:first-child) {
    margin-top: 16px;
  }
`;

// text

const ValueText = styled.p`
  font: var(--body-md);
  font-weight: 600;
`;

const ActionText = styled.span`
  display: flex;
  align-items: center;
`;

const DetailText = styled.p`
  font: var(--body-sm);
`;

const Time = styled.p`
  font: var(--body-sm);
`;

const TimeFormat = styled.span`
  display: inline-block;
  margin-right: 32px;
`;

const ErrorText = styled.p`
  font: var(--body-sm);
  color: var(--red-500);
`;

// interactive elements

const Link = styled(NextLink)`
  font: var(--body-sm);
  text-decoration: none;
  color: var(--red-500);
  transition: opacity var(--animation-duration);

  &:hover {
    opacity: 0.75;
  }
`;

const CloseButton = styled.button`
  background: transparent;
  margin-top: 6px;
`;

// icons

const CloseIcon = styled(Close)``;

const PencilIcon = styled(Pencil)``;

const InfoIcon = styled(Info)`
  display: inline-block;
  margin-left: 8px;
`;

const TimestampIcon = styled(Timestamp)``;

const AncillaryDataIcon = styled(AncillaryData)``;

const WarningIcon = styled(Warning)``;

const SettledIcon = styled(Settled)``;
