import { ConnectButton } from "@/components";
import { connectWallet, settled } from "@/constants";
import {
  mapMultipleValueOutcomes,
  maybeGetValueTextFromOptions,
} from "@/helpers";
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
import { SimulateIfOsnap } from "../TenderlySimulation";
import { ProposeInput } from "./ProposeInput";

interface Props {
  query: OracleQueryUI;
}

export function Actions({ query }: Props) {
  const { oracleType, valueText, actionType, proposeOptions, queryText } =
    query;
  const inputProps = useProposePriceInput(query);

  const primaryAction = usePrimaryPanelAction({
    query,
    formattedProposePriceInput: inputProps.formattedValue,
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
  const errors = [
    inputProps.inputError,
    ...(primaryAction?.errors || []),
  ].filter(Boolean);
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
        <ProposeInput disabled={disableInput} {...inputProps} />
      ) : (
        <div
          className="w-panel-content-width grid items-center min-h-[44px] mt-4 p-4 rounded bg-white"
          style={{
            marginBottom: !pageIsSettled ? "20px" : "0px",
          }}
        >
          {valuesToShow.length > 1 ? (
            <div className="flex flex-col gap-6 items-start justify-center w-full relative">
              {(
                mapMultipleValueOutcomes(valuesToShow, inputProps.items) ?? []
              ).map(({ label, value }) => (
                <>
                  <label
                    key={label}
                    htmlFor={`input-${label}`}
                    className="flex text-base gap-2 items-center font-normal "
                  >
                    {label}
                    {" - "}
                    <p className="font-semibold">{value}</p>
                  </label>
                </>
              ))}
            </div>
          ) : (
            <p className="sm:text-lg font-semibold">valuesToShow[0]</p>
          )}
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
