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

  const pageIsPropose = page === "propose";
  const pageIsSettled = page === "settled";
  const hasAction = primaryAction !== undefined;
  const noAction = !hasAction;
  const actionIsDispute = actionType === "dispute";
  const actionIsSettle = actionType === "settle";
  const actionIsSettled = primaryAction?.title === settled;
  const alreadyProposed = pageIsPropose && (actionIsDispute || actionIsSettle);
  const alreadySettled = !pageIsSettled && (noAction || actionIsSettled);
  const isWrongChain = connectedChain?.id !== chainId;
  const isConnectWallet = primaryAction?.title === connectWallet;

  const showActionsDetails = !pageIsSettled;
  const showPrimaryActionButton =
    !pageIsSettled &&
    hasAction &&
    !primaryAction.hidden &&
    !alreadyProposed &&
    !alreadySettled;
  const showConnectButton =
    isConnectWallet && !pageIsSettled && !alreadyProposed && !alreadySettled;
  const disableInput =
    !address || isWrongChain || alreadyProposed || alreadySettled;

  const errors = [inputError, ...(primaryAction?.errors || [])].filter(Boolean);
  const actionsTitle = getActionsTitle();
  const actionsIcon = pageIsSettled ? <SettledIcon /> : <PencilIcon />;

  function getActionsTitle() {
    if (pageIsSettled) return "Settled as";
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
    <Wrapper>
      <SectionTitleWrapper>
        {actionsIcon}
        <SectionTitle>{actionsTitle}</SectionTitle>
      </SectionTitleWrapper>
      {pageIsPropose ? (
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
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background: var(--grey-400);
  padding-inline: var(--padding-inline);
  padding-top: 20px;
  padding-bottom: 24px;
`;

const ValueWrapper = styled.div`
  width: min(100%, var(--panel-content-width));
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

const ValueText = styled(Text)`
  font: var(--body-md);
  font-weight: 600;
  @media ${smallMobileAndUnder} {
    font: var(--body-sm);
  }
`;

const PencilIcon = styled(Pencil)``;

const SettledIcon = styled(Settled)``;
