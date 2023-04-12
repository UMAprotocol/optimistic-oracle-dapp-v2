import { Button, ConnectButton, DecimalInput, PanelBase } from "@/components";
import {
  blueGrey500,
  blueGrey700,
  connectWallet,
  red500,
  settled,
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
import AncillaryData from "public/assets/icons/ancillary-data.svg";
import Pencil from "public/assets/icons/pencil.svg";
import Settled from "public/assets/icons/settled.svg";
import Timestamp from "public/assets/icons/timestamp.svg";
import Warning from "public/assets/icons/warning.svg";
import type { CSSProperties, ReactNode } from "react";
import { Fragment, useEffect, useState } from "react";
import styled from "styled-components";
import { useAccount, useNetwork } from "wagmi";
import { ActionDetails } from "./ActionDetails";
import { AdditionalTextData } from "./AdditionalTextData";
import { InfoIcons } from "./InfoIcons";
import { Title } from "./Title";
import { Link, MessageLink, Text } from "./style";

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
    valueText,
    timeUNIX,
    timeUTC,
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

  const actionsIcon = page === "settled" ? <SettledIcon /> : <PencilIcon />;
  const showActionsDetails = !!content && page !== "settled";
  const showInput = page === "propose";
  const alreadyProposed =
    page === "propose" && (actionType === "dispute" || actionType === "settle");
  const alreadySettled =
    page !== "settled" &&
    (primaryAction?.title === undefined || primaryAction?.title === settled);
  const disableInput =
    !address ||
    connectedChain?.id !== chainId ||
    alreadyProposed ||
    alreadySettled;
  const actionsTitle = getActionsTitle();
  const errors: string[] = [
    inputError,
    ...(primaryAction?.errors || []),
  ].filter(Boolean);
  const isError = errors.length > 0;
  const hasMessage = message !== "";
  const showPrimaryActionButton =
    page !== "settled" &&
    primaryAction &&
    !primaryAction.hidden &&
    !alreadyProposed &&
    !alreadySettled;
  const showConnectButton =
    page !== "settled" &&
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
        <MessageLink
          href={{
            pathname: alreadyProposed ? "/" : "/settled",
            query: makeUrlParamsForQuery(content),
          }}
        >
          here.
        </MessageLink>
      </>
    );

    setMessage(message);
  }, [page, content, alreadyProposed, alreadySettled]);

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
      {content && <Title {...content} close={close} />}
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
        {showActionsDetails && <ActionDetails {...content} />}
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
      {content && <InfoIcons {...content} />}
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
          {content && <AdditionalTextData {...content} />}
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

const ActionButtonWrapper = styled.div``;

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

const ValueText = styled(Text)`
  font: var(--body-md);
  font-weight: 600;
  @media ${smallMobileAndUnder} {
    font: var(--body-sm);
  }
`;

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

// icons

const PencilIcon = styled(Pencil)``;

const TimestampIcon = styled(Timestamp)``;

const AncillaryDataIcon = styled(AncillaryData)``;

const WarningIcon = styled(Warning)``;

const SettledIcon = styled(Settled)``;
