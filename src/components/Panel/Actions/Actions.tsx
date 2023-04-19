import { ConnectButton } from "@/components";
import { connectWallet, settled, smallMobileAndUnder } from "@/constants";
import {
  usePageContext,
  usePrimaryPanelAction,
  useProposePriceInput,
} from "@/hooks";
import type { OracleQueryUI } from "@/types";
import Pencil from "public/assets/icons/pencil.svg";
import Settled from "public/assets/icons/settled.svg";
import type { CSSProperties } from "react";
import styled from "styled-components";
import { useAccount, useNetwork } from "wagmi";
import { SectionTitle, SectionTitleWrapper, Text } from "../style";
import { Details } from "./Details";
import { Errors } from "./Errors";
import { Message } from "./Message";
import { PrimaryActionButton } from "./PrimaryActionButton";
import { ProposeInput } from "./ProposeInput";

interface Props {
  query: OracleQueryUI;
}
export function Actions({ query }: Props) {
  const { chainId, oracleType, valueText, actionType } = query;
  const { proposePriceInput, inputError, ...inputProps } =
    useProposePriceInput(query);
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
        <ProposeInput
          value={proposePriceInput}
          disabled={disableInput}
          {...inputProps}
        />
      ) : (
        <ValueWrapper
          style={
            {
              "--margin-bottom": !pageIsSettled ? "20px" : "0px",
            } as CSSProperties
          }
        >
          <ValueText>{valueText}</ValueText>
        </ValueWrapper>
      )}
      {!pageIsSettled && <Details {...query} />}
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

const ValueText = styled(Text)`
  font: var(--body-md);
  font-weight: 600;
  @media ${smallMobileAndUnder} {
    font: var(--body-sm);
  }
`;

const PencilIcon = styled(Pencil)``;

const SettledIcon = styled(Settled)``;
