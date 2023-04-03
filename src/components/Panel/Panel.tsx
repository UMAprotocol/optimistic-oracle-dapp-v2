import {
  Button,
  CloseButton,
  ConnectButton,
  Currency,
  DecimalInput,
  PanelBase,
} from "@/components";
import {
  blueGrey500,
  blueGrey700,
  connectWallet,
  getProjectIcon,
  red500,
  smallMobileAndUnder,
} from "@/constants";
import {
  addOpacityToHsla,
  capitalizeFirstLetter,
  makeUrlParamsForQuery,
} from "@/helpers";
import {
  usePageContext,
  usePanelContext,
  usePrimaryPanelAction,
} from "@/hooks";
import NextLink from "next/link";
import AncillaryData from "public/assets/icons/ancillary-data.svg";
import Info from "public/assets/icons/info.svg";
import Pencil from "public/assets/icons/pencil.svg";
import Settled from "public/assets/icons/settled.svg";
import Timestamp from "public/assets/icons/timestamp.svg";
import Warning from "public/assets/icons/warning.svg";
import type { CSSProperties, ReactNode } from "react";
import { Fragment, useEffect, useState } from "react";
import styled from "styled-components";
import { useAccount, useNetwork } from "wagmi";
import { ChainIcon } from "./ChainIcon";
import { ExpiryTypeIcon } from "./ExpiryTypeIcon";
import { OoTypeIcon } from "./OoTypeIcon";

const messageBackgroundColor = addOpacityToHsla(blueGrey500, 0.05);
const errorBackgroundColor = addOpacityToHsla(red500, 0.05);

/**
 * A panel that slides in from the right.
 * The panel adapts to the page it is used on.
 * @see `PanelContext`
 */
export function Panel() {
  const { content, panelOpen, closePanel } = usePanelContext();
  const [message, setMessage] = useState<ReactNode>("");
  const [proposePriceInput, setProposePriceInput] = useState("");
  const [inputError, setInputError] = useState("");
  const {
    chainId,
    oracleType,
    title,
    description,
    project,
    valueText,
    queryText,
    queryTextHex,
    timeUNIX,
    timeUTC,
    tokenAddress,
    bond,
    reward,
    formattedLivenessEndsIn,
    expiryType,
    moreInformation,
    actionType,
  } = content ?? {};

  const primaryAction = usePrimaryPanelAction({
    query: content,
    proposePriceInput,
  });

  const { address } = useAccount();
  const { chain: connectedChain } = useNetwork();
  const { page } = usePageContext();

  const projectIcon = getProjectIcon(project);
  const actionsIcon = page === "settled" ? <SettledIcon /> : <PencilIcon />;
  const showActionsDetails = page !== "settled";
  const showInput = page === "propose";
  const alreadyProposed =
    page === "propose" && (actionType === "dispute" || actionType === "settle");
  const alreadySettled = page !== "settled" && actionType === undefined;
  const disableInput =
    !address ||
    connectedChain?.id !== chainId ||
    alreadyProposed ||
    alreadySettled;
  const hasReward = reward !== null;
  const actionsTitle = getActionsTitle();
  const errors: string[] = [
    inputError,
    ...(primaryAction?.errors || []),
  ].filter(Boolean);
  const isError = errors.length > 0;
  const hasMessage = message !== "";
  const showPrimaryActionButton =
    primaryAction &&
    !primaryAction.hidden &&
    !alreadyProposed &&
    !alreadySettled;
  const showConnectButton =
    primaryAction?.title === connectWallet &&
    !alreadyProposed &&
    !alreadySettled;

  useEffect(() => {
    setMessage("");
    if (!content || page === "settled") return;

    if (!alreadyProposed && !alreadySettled) return;

    const message = (
      <>
        This query has already been {alreadyProposed ? "proposed" : "settled"}.
        View it{" "}
        <Link
          href={{
            pathname: alreadyProposed ? "/" : "/settled",
            query: makeUrlParamsForQuery(content),
          }}
        >
          here.
        </Link>
      </>
    );

    setMessage(message);
  }, [page, primaryAction, content]);

  function getActionsTitle() {
    if (page === "settled") return "Settled as";
    if (oracleType === "Optimistic Oracle V3")
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

  function close() {
    void closePanel();
  }

  return (
    <PanelBase panelOpen={panelOpen} closePanel={close}>
      <TitleWrapper>
        <ProjectIconWrapper>{projectIcon}</ProjectIconWrapper>
        <Title id="panel-title">{title}</Title>
        <CloseButtonWrapper>
          <CloseButton
            onClick={close}
            size="clamp(1.00rem, calc(0.92rem + 0.41vw), 1.25rem)"
          />
        </CloseButtonWrapper>
      </TitleWrapper>
      <ActionsWrapper>
        <SectionTitleWrapper>
          {actionsIcon}
          <SectionTitle>{actionsTitle}</SectionTitle>
        </SectionTitleWrapper>
        {showInput ? (
          <InputWrapper>
            <DecimalInput
              value={proposePriceInput}
              onInput={setProposePriceInput}
              addErrorMessage={setInputError}
              disabled={disableInput}
              removeErrorMessage={() => setInputError("")}
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
                <Currency
                  address={tokenAddress}
                  chainId={chainId}
                  value={bond}
                />
              </ActionText>
            </ActionWrapper>
            {hasReward && (
              <ActionWrapper>
                <ActionText>
                  Reward
                  <InfoIcon />
                </ActionText>
                <ActionText>
                  <Currency
                    address={tokenAddress}
                    chainId={chainId}
                    value={reward}
                  />
                </ActionText>
              </ActionWrapper>
            )}
            <ActionWrapper>
              <ActionText>
                Challenge period ends in
                <InfoIcon />
              </ActionText>
              <ActionText>{formattedLivenessEndsIn}</ActionText>
            </ActionWrapper>
          </ActionsDetailsWrapper>
        )}
        {showPrimaryActionButton && (
          <ActionButtonWrapper>
            <Button
              variant="primary"
              onClick={primaryAction.action}
              disabled={primaryAction.disabled}
              width="min(100%, 512px)"
            >
              {capitalizeFirstLetter(primaryAction.title)}
            </Button>
          </ActionButtonWrapper>
        )}
        {showConnectButton && <ConnectButton />}
        {hasMessage && (
          <MessageWrapper>
            <WarningIcon />
            <MessageText>{message}</MessageText>
          </MessageWrapper>
        )}
        {isError && (
          <>
            {errors.map((message) => (
              <ErrorWrapper key={message}>
                <WarningIcon />
                <ErrorText>{message}</ErrorText>
              </ErrorWrapper>
            ))}
          </>
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
            <SectionTitle>Additional Text Data</SectionTitle>
          </SectionTitleWrapper>
          <SectionSubTitle>Description</SectionSubTitle>
          <DetailText>{description}</DetailText>
          {queryText !== "" && (
            <>
              <SectionSubTitle>String</SectionSubTitle>
              <DetailText>{queryText}</DetailText>
            </>
          )}
          <SectionSubTitle>Bytes</SectionSubTitle>
          <DetailText>{queryTextHex}</DetailText>
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
    </PanelBase>
  );
}

// wrappers

const TitleWrapper = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: var(--page-padding);
  min-height: 84px;
  padding-inline: var(--padding-inline);
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
  padding-inline: var(--padding-inline);
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

const CloseButtonWrapper = styled.div`
  width: clamp(1.25rem, calc(0.84rem + 2.04vw), 2.5rem);
`;

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

const InfoIconsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 20px;
  padding-inline: var(--padding-inline);
  margin-bottom: 42px;
`;

const ProjectIconWrapper = styled.div`
  width: clamp(1.25rem, calc(0.84rem + 2.04vw), 2.5rem);
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

const ErrorWrapper = styled.div`
  width: min(100%, 512px);
  min-height: 48px;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 20px;
  padding-inline: 16px;
  background: ${errorBackgroundColor};
  border: 1px solid var(--red-500);
  border-radius: 2px;
`;

const MessageWrapper = styled(ErrorWrapper)`
  background: ${messageBackgroundColor};
  border: 1px solid var(--blue-grey-500);
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

const Text = styled.p`
  font: var(--body-sm);
  @media ${smallMobileAndUnder} {
    font: var(--body-xs);
  }
`;

const ValueText = styled(Text)`
  font: var(--body-md);
  font-weight: 600;
  @media ${smallMobileAndUnder} {
    font: var(--body-sm);
  }
`;

const ActionText = styled(Text)`
  display: flex;
  align-items: center;
`;

const DetailText = styled(Text)``;

const Time = styled(Text)``;

const TimeFormat = styled.span`
  display: inline-block;
  margin-right: 32px;
`;

const ErrorText = styled(Text)`
  color: var(--red-500);
`;

const MessageText = styled(Text)`
  color: var(--blue-grey-500);
`;

// interactive elements

const Link = styled(NextLink)`
  font: var(--body-sm);
  text-decoration: none;
  color: var(--red-500);
  transition: opacity var(--animation-duration);
  word-break: break-all;

  &:hover {
    opacity: 0.75;
  }
`;

// icons

const PencilIcon = styled(Pencil)``;

const InfoIcon = styled(Info)`
  display: inline-block;
  margin-left: 8px;
`;

const TimestampIcon = styled(Timestamp)``;

const AncillaryDataIcon = styled(AncillaryData)``;

const WarningIcon = styled(Warning)``;

const SettledIcon = styled(Settled)``;
