import { DecimalInput } from "@/components";
import { connectWallet, settled, smallMobileAndUnder } from "@/constants";
import { usePageContext, usePrimaryPanelAction } from "@/hooks";
import type { OracleQueryUI } from "@/types";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Pencil from "public/assets/icons/pencil.svg";
import Settled from "public/assets/icons/settled.svg";
import type { CSSProperties } from "react";
import { useState } from "react";
import styled from "styled-components";
import { useAccount, useNetwork } from "wagmi";
import { SectionTitle, SectionTitleWrapper, Text } from "../style";
import { ActionDetails } from "./ActionDetails";
import { Errors } from "./Errors";
import { Message } from "./Message";
import { PrimaryActionButton } from "./PrimaryActionButton";

interface Props {
  query: OracleQueryUI;
}
export function Actions({ query }: Props) {
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
      <Message
        query={query}
        page={page}
        alreadyProposed={alreadyProposed}
        alreadySettled={alreadySettled}
      />
      <Errors errors={errors} />
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

// titles

// text

const ValueText = styled(Text)`
  font: var(--body-md);
  font-weight: 600;
  @media ${smallMobileAndUnder} {
    font: var(--body-sm);
  }
`;

// interactive elements

// icons

const PencilIcon = styled(Pencil)``;

const SettledIcon = styled(Settled)``;
