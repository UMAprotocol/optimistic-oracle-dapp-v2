import { DecimalInput } from "@/components";
import {
  blueGrey500,
  connectWallet,
  red500,
  settled,
  smallMobileAndUnder,
} from "@/constants";
import { addOpacityToHsla, makeUrlParamsForQuery } from "@/helpers";
import { usePageContext, usePrimaryPanelAction } from "@/hooks";
import type { OracleQueryUI } from "@/types";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Pencil from "public/assets/icons/pencil.svg";
import Settled from "public/assets/icons/settled.svg";
import Warning from "public/assets/icons/warning.svg";
import type { CSSProperties, ReactNode } from "react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useAccount, useNetwork } from "wagmi";
import { MessageLink, SectionTitle, SectionTitleWrapper, Text } from "../style";
import { ActionDetails } from "./ActionDetails";
import { PrimaryActionButton } from "./PrimaryActionButton";

const messageBackgroundColor = addOpacityToHsla(blueGrey500, 0.05);
const errorBackgroundColor = addOpacityToHsla(red500, 0.05);

interface Props {
  query: OracleQueryUI;
}
export function Actions({ query }: Props) {
  const [message, setMessage] = useState<ReactNode>("");
  const [proposePriceInput, setProposePriceInput] = useState("");
  const [inputError, setInputError] = useState("");
  const { chainId, oracleType, valueText, actionType } = query;

  const primaryAction = usePrimaryPanelAction({
    query,
    proposePriceInput,
  });

  const { address } = useAccount();
  const { chain: connectedChain } = useNetwork();
  const { page } = usePageContext();

  const actionsIcon = page === "settled" ? <SettledIcon /> : <PencilIcon />;
  const showActionsDetails = page !== "settled";
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
    if (page === "settled") return;

    if (!alreadyProposed && !alreadySettled) return;

    const message = (
      <>
        This query has already been {alreadyProposed ? "proposed" : "settled"}.
        View it{" "}
        <MessageLink
          href={{
            pathname: alreadyProposed ? "/" : "/settled",
            query: makeUrlParamsForQuery(query),
          }}
        >
          here.
        </MessageLink>
      </>
    );

    setMessage(message);
  }, [page, query, alreadyProposed, alreadySettled]);

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
  return (
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
      {showActionsDetails && <ActionDetails {...query} />}
      {showPrimaryActionButton && <PrimaryActionButton {...primaryAction} />}
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
  );
}

const ActionsWrapper = styled.div`
  background: var(--grey-400);
  padding-inline: var(--padding-inline);
  padding-top: 20px;
  padding-bottom: 24px;
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

// text

const ValueText = styled(Text)`
  font: var(--body-md);
  font-weight: 600;
  @media ${smallMobileAndUnder} {
    font: var(--body-sm);
  }
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

const WarningIcon = styled(Warning)``;

const SettledIcon = styled(Settled)``;
