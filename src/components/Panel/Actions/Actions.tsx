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
import { SectionTitle, SectionTitleWrapper } from "../style";
import { Details } from "./Details";
import { Errors } from "./Errors";
import { Message } from "./Message";
import { PrimaryActionButton } from "./PrimaryActionButton";
import { ProposeInput } from "./ProposeInput";
import { SimulateIfOsnap } from "../TenderlySimulation";

interface Props {
  query: OracleQueryUI;
}
export function Actions({ query }: Props) {
  const { oracleType, valueText, actionType, proposeOptions, queryText } =
    query;
  const { proposePriceInput, inputError, ...inputProps } =
    useProposePriceInput(query);
  const primaryAction = usePrimaryPanelAction({
    query,
    proposePriceInput,
  });

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
  const isConnectWallet = primaryAction?.title === connectWallet;

  const showPrimaryActionButton =
    !pageIsSettled &&
    hasAction &&
    !primaryAction.hidden &&
    !alreadyProposed &&
    !alreadySettled;
  const showConnectButton =
    isConnectWallet && !pageIsSettled && !alreadyProposed && !alreadySettled;
  const disableInput = alreadyProposed || alreadySettled;
  const errors = [inputError, ...(primaryAction?.errors || [])].filter(Boolean);
  const actionsTitle = getActionsTitle();
  const actionsIcon = pageIsSettled ? <Settled /> : <Pencil />;
  const valuesToShow = Array.isArray(valueText)
    ? valueText
    : [maybeGetValueTextFromOptions(valueText, proposeOptions)];

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
          <p className="sm:text-lg font-semibold">{valuesToShow.join(", ")}</p>
        </div>
      )}
      {!pageIsSettled && <Details {...query} />}
      {showPrimaryActionButton && <PrimaryActionButton {...primaryAction} />}
      {showConnectButton && <ConnectButton />}
      {pageIsVerify && <SimulateIfOsnap queryText={queryText} />}

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
