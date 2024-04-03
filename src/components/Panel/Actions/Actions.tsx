import { ConnectButton } from "@/components";
import { connectWallet, settled } from "@/constants";
import { maybeGetValueTextFromOptions } from "@/helpers";
import {
  usePageContext,
  usePrimaryPanelAction,
  useProposePriceInput,
} from "@/hooks";
import type { OracleQueryUI } from "@/types";
import Pencil from "public/assets/icons/pencil.svg";
import Settled from "public/assets/icons/settled.svg";
import { useAccount, useNetwork } from "wagmi";
import { SectionTitle, SectionTitleWrapper } from "../style";
import { Details } from "./Details";
import { Errors } from "./Errors";
import { Message } from "./Message";
import { PrimaryActionButton } from "./PrimaryActionButton";
import { ProposeInput } from "./ProposeInput";
import { TenderlySimulation } from "../TenderlySimulation";
import { useSnapPluginData } from "@/helpers/snapshot";

interface Props {
  query: OracleQueryUI;
}
export function Actions({ query }: Props) {
  const {
    chainId,
    oracleType,
    valueText,
    actionType,
    proposeOptions,
    queryText,
  } = query;
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
  const pageIsVerify = page === "verify";
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
  const actionsIcon = pageIsSettled ? <Settled /> : <Pencil />;
  const valueToShow = maybeGetValueTextFromOptions(valueText, proposeOptions);
  const osnapData = useSnapPluginData(queryText);

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
    <div className="bg-grey-400 px-page-padding lg:px-7 pt-5 pb-6">
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
        <div
          className="w-panel-content-width grid items-center min-h-[44px] mt-4 px-4 rounded bg-white"
          style={{
            marginBottom: !pageIsSettled ? "20px" : "0px",
          }}
        >
          <p className="sm:text-lg font-semibold">{valueToShow}</p>
        </div>
      )}
      {!pageIsSettled && <Details {...query} />}
      {showPrimaryActionButton && <PrimaryActionButton {...primaryAction} />}
      {showConnectButton && <ConnectButton />}
      {osnapData && pageIsVerify && (
        <TenderlySimulation osnapPluginData={osnapData.oSnap} />
      )}

      <Message
        query={query}
        page={page}
        alreadyProposed={alreadyProposed}
        alreadySettled={alreadySettled}
      />
      <Errors errors={errors} />
    </div>
  );
}
