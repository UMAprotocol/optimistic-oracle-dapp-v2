import { Button, ConnectButton } from "@/components";
import { connectWallet, settled } from "@/constants";
import {
  cn,
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
import { story, storyOdyssey } from "@/constants/customChains";
import { getIpId } from "@/helpers/queryParsing";
import { ExternalLinkIcon } from "lucide-react";

interface Props {
  query: OracleQueryUI;
}

export function Actions({ query }: Props) {
  const { page } = usePageContext();
  const { oracleType, valueText, actionType, proposeOptions, queryText } =
    query;
  const pageIsPropose = page === "propose";
  const pageIsSettled = page === "settled";
  const pageIsVerify = page === "verify";
  const actionIsDispute = actionType === "dispute";
  const actionIsSettle = actionType === "settle";
  const inputProps = useProposePriceInput(query);
  const redirectDisputeLink = [story.id, storyOdyssey.id].includes(
    query.chainId,
  )
    ? makeStoryDisputeLink(query.description)
    : undefined;

  const showStoryRedirect = Boolean(actionIsDispute && !!redirectDisputeLink);

  const primaryAction = usePrimaryPanelAction({
    query,
    formattedProposePriceInput: inputProps.formattedValue,
    disabled: showStoryRedirect, // disable preflight checks if redirecting to external UI
  });
  const hasAction = primaryAction !== undefined;
  const noAction = !hasAction;

  const actionIsSettled = primaryAction?.title === settled;
  const alreadyProposed = pageIsPropose && (actionIsDispute || actionIsSettle);
  const alreadySettled = !pageIsSettled && (noAction || actionIsSettled);
  const isConnectWallet = primaryAction?.title === connectWallet;

  const showPrimaryActionButton =
    !pageIsSettled &&
    hasAction &&
    !primaryAction.hidden &&
    !alreadyProposed &&
    !alreadySettled &&
    !showStoryRedirect;
  const showConnectButton =
    isConnectWallet &&
    !pageIsSettled &&
    !alreadyProposed &&
    !alreadySettled &&
    !showStoryRedirect;
  const disableInput = alreadyProposed || alreadySettled;
  const errors = [
    pageIsPropose && inputProps.inputError,
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
    if (pageIsPropose) {
      return <>Propose Answer</>;
    }
    return <>Dispute Proposal</>;
  }

  const isMultipleValuesRequest = query.identifier === "MULTIPLE_VALUES";

  return (
    <div className="bg-grey-400 px-page-padding lg:px-7 pt-5 pb-6">
      <SectionTitleWrapper>
        {actionsIcon}
        <SectionTitle>{actionsTitle}</SectionTitle>
      </SectionTitleWrapper>
      {pageIsPropose ? (
        <ProposeInput disabled={disableInput} {...inputProps} />
      ) : (
        <>
          {isMultipleValuesRequest ? (
            <MultipleValues
              className={cn(!pageIsSettled ? "mb-5" : "mb-0")}
              valuesToShow={valuesToShow}
              query={query}
            />
          ) : (
            <div
              className="w-panel-content-width grid items-center min-h-[44px] mt-4 p-4 rounded bg-white"
              style={{
                marginBottom: !pageIsSettled ? "20px" : "0px",
              }}
            >
              <p className="sm:text-lg font-semibold">
                Proposal: {valuesToShow[0]}
              </p>
            </div>
          )}
        </>
      )}
      {!pageIsSettled && <Details {...query} />}
      {showPrimaryActionButton && <PrimaryActionButton {...primaryAction} />}
      {showStoryRedirect ? (
        <Button
          width="100%"
          variant="primary"
          type="link"
          href={redirectDisputeLink}
        >
          <span className="justify-center inline-flex items-center gap-2 w-full">
            {" "}
            Dispute on Story Portal{" "}
            <ExternalLinkIcon className="w-[1em] h-[1em] inline-flex" />
          </span>
        </Button>
      ) : null}
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

function MultipleValues({
  query,
  valuesToShow,
  className,
}: {
  query: OracleQueryUI;
  valuesToShow: (string | null | undefined)[];
  className?: string;
}) {
  if (!query.proposeOptions || !query.proposeOptions.length) {
    return (
      <div
        className={cn(
          "w-panel-content-width grid items-center min-h-[44px] mt-4 p-4 rounded bg-white mb-5",
          className,
        )}
      >
        <p className="sm:text-lg font-semibold">Unresolvable</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-2 items-start justify-between w-full mb-2 relative",
        className,
      )}
    >
      <div
        className={cn(
          "flex gap-5 items-start justify-between w-full mb-2 relative",
          { "flex-col gap-2": valuesToShow?.length > 2 },
        )}
      >
        {(
          mapMultipleValueOutcomes(valuesToShow, query.proposeOptions) ?? []
        ).map(({ label, value }, i) => (
          <>
            <label
              key={label}
              htmlFor={`input-${label}`}
              className="flex flex-1 w-full flex-col gap-2 font-normal"
            >
              {label}
              <div className="w-full h-[44px] pl-4 rounded-md bg-white flex items-center">
                {value}
              </div>
            </label>
            {i === 0 && valuesToShow?.length === 2 && (
              <span className="font-normal text-4xl text-[#A2A1A5] relative top-8">
                -
              </span>
            )}
          </>
        ))}
      </div>
    </div>
  );
}

function makeStoryDisputeLink(
  decodedDescription: OracleQueryUI["description"],
): string | undefined {
  if (!decodedDescription) return;
  const ipId = getIpId(decodedDescription);
  if (!ipId) return;
  return `https://portal.story.foundation/assets/${ipId}`;
}
