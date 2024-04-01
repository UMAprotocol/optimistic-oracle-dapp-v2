import { Currency } from "@/components";
import {
  approveSpend,
  approvingSpend,
  changeChain,
  changingChains,
  connectWallet,
  connectingWallet,
  dispute,
  disputed,
  disputing,
  insufficientBalance,
  propose,
  proposed,
  proposing,
  settle,
  settled,
  settling,
} from "@/constants";
// Reinable when we have a good way to convert wagmi logs to ethers logs
// import { oracleEthersApis } from "@/contexts";
import { handleNotifications } from "@/helpers";
import { useBalanceAndAllowance } from "@/hooks";
import type { ActionTitle, OracleQueryUI } from "@/types";
import React, { useEffect } from "react";
import {
  useAccount,
  useConnect,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useSwitchNetwork,
  useWaitForTransaction,
} from "wagmi";

// This represents an action button, and the state we need to render it
export type ActionState = Partial<{
  action: () => void;
  disabled: boolean;
  disabledReason: string;
  hidden: boolean;
  title: ActionTitle;
  errors: (string | null | undefined)[];
}>;
export function usePrimaryPanelAction({
  query,
  proposePriceInput,
}: {
  query?: OracleQueryUI;
  proposePriceInput?: string;
}): ActionState | undefined {
  // these are in order of importance
  const accountAction = useAccountAction({ query });
  const approveBondAction = useApproveBondAction({ query });
  const proposeAction = useProposeAction({ query, proposePriceInput });
  const disputeAction = useDisputeAction({ query });
  const disputeAssertionAction = useDisputeAssertionAction({ query });
  const settlePriceAction = useSettlePriceAction({ query });
  const settleAssertionAction = useSettleAssertionAction({ query });

  return (
    accountAction ||
    approveBondAction ||
    proposeAction ||
    disputeAction ||
    disputeAssertionAction ||
    settlePriceAction ||
    settleAssertionAction
  );
}

export function useAccountAction({
  query,
}: {
  query?: OracleQueryUI;
}): ActionState | undefined {
  const { isConnected } = useAccount();
  const { isLoading: isWalletLoading } = useConnect();
  const { chain: connectedChain } = useNetwork();
  const { chainId, actionType } = query ?? {};
  const { switchNetwork, isLoading: isNetworkLoading } = useSwitchNetwork();
  // do not display a button for settle queries
  if (
    actionType !== "dispute" &&
    actionType !== "propose" &&
    actionType !== "settle"
  )
    return undefined;

  // users wallet is connecting
  if (isWalletLoading) {
    return {
      title: connectingWallet,
      disabled: true,
      disabledReason: "Wallet is connecting...",
    };
  }

  // change chains is loading
  if (isNetworkLoading) {
    return {
      title: changingChains,
      disabled: true,
      disabledReason: "Changing chains...",
    };
  }
  // user is not connected.  we have to use a special button, so we are just gonna signal with title
  // and hide this button until we are connected.
  if (!isConnected) {
    return {
      title: connectWallet,
      hidden: true,
    };
  }

  // we don't know users connected chain yet, do not allow any actions
  if (connectedChain === undefined) {
    return {
      hidden: true,
    };
  }
  if (switchNetwork === undefined) return undefined;
  // we cannot allow any transactions until user is on correct chain for current request
  if (connectedChain.id !== chainId) {
    return {
      title: changeChain,
      action: () => {
        switchNetwork(chainId);
      },
    };
  }
  return undefined;
}

export function useApproveBondAction({
  query,
}: {
  query?: OracleQueryUI;
}): ActionState | undefined {
  const { bond, tokenAddress, chainId, approveBondSpendParams, actionType } =
    query ?? {};
  const { allowance, balance } = useBalanceAndAllowance(query);
  const {
    config: approveBondSpendConfig,
    error: prepareApproveBondSpendError,
    isLoading: isPrepareApproveBondSpendLoading,
    refetch: refetchConfig,
  } = usePrepareContractWrite({
    ...approveBondSpendParams,
    scopeKey: query?.id,
    enabled: !!query?.id,
  });
  const {
    write: approveBondSpend,
    data: approveBondSpendTransaction,
    error: approveBondSpendError,
    isLoading: isApproveBondSpendLoading,
    reset: resetContractWrite,
  } = useContractWrite(approveBondSpendConfig);
  const { isLoading: isApprovingBondSpend, isSuccess } = useWaitForTransaction({
    hash: approveBondSpendTransaction?.hash,
  });

  useEffect(() => {
    if (!query?.id) return;
    refetchConfig &&
      refetchConfig().catch((err) =>
        console.warn("error refetching config", err),
      );
    resetContractWrite();
  }, [query?.id, refetchConfig, resetContractWrite]);
  // notify based on approval
  useEffect(() => {
    if (!approveBondSpendTransaction || !chainId) return;
    const currencyComponent = (
      <Currency
        value={bond}
        chainId={chainId}
        address={tokenAddress}
        showIcon={false}
      />
    );
    handleNotifications(approveBondSpendTransaction, chainId, {
      pending: <>Approving {currencyComponent}</>,
      success: <>Approved {currencyComponent}</>,
      error: <>Failed to approve {currencyComponent}</>,
    }).catch(console.error);
  }, [approveBondSpendTransaction, bond, chainId, tokenAddress]);

  if (actionType !== "propose" && actionType !== "dispute") return undefined;
  if (balance && bond && balance.value < bond) {
    return {
      title: insufficientBalance,
      disabled: true,
      disabledReason: "You don't have enough funds to pay the bond.",
    };
  }
  if (!approveBondSpendParams) return undefined;
  const needsToApprove =
    allowance !== undefined && bond !== undefined && allowance < bond;
  if (!needsToApprove) return undefined;

  if (isPrepareApproveBondSpendLoading) {
    return {
      title: approveSpend,
      disabled: true,
      disabledReason: "Preparing approval transaction...",
    };
  }
  if (isApproveBondSpendLoading || isApprovingBondSpend) {
    return {
      title: approvingSpend,
      disabled: true,
      disabledReason: "Approving spend...",
    };
  }

  // if tx succeeds, we let other button states take over by returning undefined
  if (isSuccess) {
    return undefined;
  }

  return {
    title: approveSpend,
    action: approveBondSpend,
    errors: [
      prepareApproveBondSpendError?.message,
      approveBondSpendError?.message,
    ],
  };
}

export function useProposeAction({
  query,
  proposePriceInput,
}: {
  query?: OracleQueryUI;
  proposePriceInput?: string;
}): ActionState | undefined {
  const { proposePriceParams, chainId, actionType } = query ?? {};
  const {
    config: proposePriceConfig,
    error: prepareProposePriceError,
    isLoading: isPrepareProposePriceLoading,
    refetch: refetchConfig,
  } = usePrepareContractWrite({
    ...proposePriceParams?.(proposePriceInput),
    scopeKey: query?.id,
    enabled: !!query?.id,
  });
  const {
    write: proposePrice,
    data: proposePriceTransaction,
    error: proposePriceError,
    isLoading: isProposePriceLoading,
    reset: resetContractWrite,
  } = useContractWrite({
    ...proposePriceConfig,
    request: {
      ...proposePriceConfig.request,
      // increase gas limit, this is due to user potentially editing approval amount in wallet, and running out of gas
      // we cannot unset this because typescript expects a bigint
      gas: proposePriceConfig?.request?.gas
        ? proposePriceConfig?.request?.gas * 2n
        : undefined,
    },
  });

  const { isLoading: isProposingPrice, isSuccess } = useWaitForTransaction({
    hash: proposePriceTransaction?.hash,
  });
  useEffect(() => {
    if (!query?.id) return;
    refetchConfig &&
      refetchConfig().catch((err) =>
        console.warn("error refetching config", err),
      );
    resetContractWrite();
  }, [query?.id, refetchConfig, resetContractWrite]);
  // notify based on proposal tx
  useEffect(() => {
    if (!proposePriceTransaction || !chainId) return;
    handleNotifications(proposePriceTransaction, chainId, {
      pending: <>Proposing price</>,
      success: <>Proposed price</>,
      error: <>Failed to propose price</>,
    })
      // TODO: this is disabled because wagmi move from ethers, should look into updating this eventually
      // .then((receipt) => {
      //   if (receipt && query)
      //     oracleEthersApis?.[query.oracleType]?.[
      //       chainId
      //     ]?.updateFromTransactionReceipt(receipt);
      // })
      .catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proposePriceTransaction]);

  if (proposePriceParams === undefined) return undefined;

  // TODO validate input
  if (proposePriceInput === undefined || proposePriceInput?.length === 0) {
    return {
      title: propose,
      disabled: true,
      disabledReason: "Please enter a value to propose.",
    };
  }

  if (isPrepareProposePriceLoading) {
    return {
      title: propose,
      disabled: true,
      disabledReason: "Preparing proposal transaction...",
    };
  }
  if (isProposePriceLoading || isProposingPrice) {
    return {
      title: proposing,
      disabled: true,
      disabledReason: "Proposing...",
    };
  }

  // if proposal succeeds, disable button
  if (actionType === "propose") {
    if (isSuccess) {
      return {
        title: proposed,
        disabled: true,
        disabledReason: "Already proposed.",
      };
    }

    return {
      title: propose,
      action: proposePrice,
      errors: [prepareProposePriceError?.message, proposePriceError?.message],
    };
  }
}

export function useDisputeAction({
  query,
}: {
  query?: OracleQueryUI;
}): ActionState | undefined {
  const { disputePriceParams, chainId, actionType } = query ?? {};
  const {
    config: disputePriceConfig,
    error: prepareDisputePriceError,
    isLoading: isPrepareDisputePriceLoading,
    refetch: refetchConfig,
  } = usePrepareContractWrite({
    ...disputePriceParams,
    scopeKey: query?.id,
    enabled: !!query?.id,
  });
  const {
    write: disputePrice,
    data: disputePriceTransaction,
    error: disputePriceError,
    isLoading: isDisputePriceLoading,
    reset: resetContractWrite,
  } = useContractWrite(disputePriceConfig);

  const { isLoading: isDisputingPrice, isSuccess } = useWaitForTransaction({
    hash: disputePriceTransaction?.hash,
  });
  useEffect(() => {
    if (!query?.id) return;
    refetchConfig &&
      refetchConfig().catch((err) =>
        console.warn("error refetching config", err),
      );
    resetContractWrite();
  }, [query?.id, refetchConfig, resetContractWrite]);
  // notify based on dispute tx
  useEffect(() => {
    if (!disputePriceTransaction || !chainId) return;
    handleNotifications(disputePriceTransaction, chainId, {
      pending: <>Disputing price</>,
      success: <>Disputed price</>,
      error: <>Failed to dispute price</>,
    })
      // .then((receipt) => {
      //   if (receipt && query)
      //     oracleEthersApis?.[query.oracleType]?.[
      //       chainId
      //     ]?.updateFromTransactionReceipt(receipt);
      // })
      .catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disputePriceTransaction]);

  if (actionType === "settle") return undefined;
  if (disputePriceParams === undefined) return undefined;

  if (isPrepareDisputePriceLoading) {
    return {
      title: dispute,
      disabled: true,
      disabledReason: "Preparing dispute transaction...",
    };
  }
  if (isDisputePriceLoading || isDisputingPrice) {
    return {
      title: disputing,
      disabled: true,
      disabledReason: "Disputing...",
    };
  }
  if (isSuccess) {
    return {
      title: disputed,
      disabled: true,
      disabledReason: "Already disputed.",
    };
  }
  return {
    title: dispute,
    action: disputePrice,
    errors: [prepareDisputePriceError?.message, disputePriceError?.message],
  };
}
export function useDisputeAssertionAction({
  query,
}: {
  query?: OracleQueryUI;
}): ActionState | undefined {
  const { disputeAssertionParams, chainId } = query ?? {};
  const { address } = useAccount();
  const {
    config: disputeAssertionConfig,
    error: prepareDisputeAssertionError,
    isLoading: isPrepareDisputeAssertionLoading,
    refetch: refetchConfig,
  } = usePrepareContractWrite({
    ...disputeAssertionParams?.(address),
    scopeKey: query?.id,
    enabled: !!query?.id,
  });
  const {
    write: disputeAssertion,
    data: disputeAssertionTransaction,
    error: disputeAssertionError,
    isLoading: isDisputeAssertionLoading,
    reset: resetContractWrite,
  } = useContractWrite(disputeAssertionConfig);
  const { isLoading: isDisputingAssertion, isSuccess } = useWaitForTransaction({
    hash: disputeAssertionTransaction?.hash,
  });

  useEffect(() => {
    if (!query?.id) return;
    refetchConfig &&
      refetchConfig().catch((err) =>
        console.warn("error refetching config", err),
      );
    resetContractWrite();
  }, [query?.id, refetchConfig, resetContractWrite]);
  // notify based on dispute tx
  useEffect(() => {
    if (!disputeAssertionTransaction || !chainId) return;
    handleNotifications(disputeAssertionTransaction, chainId, {
      pending: <>Disputing assertion</>,
      success: <>Disputed assertion</>,
      error: <>Failed to dispute assertion</>,
    })
      // .then((receipt) => {
      //   if (receipt && query)
      //     oracleEthersApis?.[query.oracleType]?.[
      //       chainId
      //     ]?.updateFromTransactionReceipt(receipt);
      // })
      .catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disputeAssertionTransaction]);

  if (disputeAssertionParams === undefined) return undefined;

  if (isPrepareDisputeAssertionLoading) {
    return {
      title: dispute,
      disabled: true,
      disabledReason: "Preparing dispute transaction...",
    };
  }
  if (isDisputeAssertionLoading || isDisputingAssertion) {
    return {
      title: disputing,
      disabled: true,
      disabledReason: "Disputing...",
    };
  }
  if (isSuccess) {
    return {
      title: disputed,
      disabled: true,
      disabledReason: "Already disputed.",
    };
  }
  if (
    prepareDisputeAssertionError?.message &&
    prepareDisputeAssertionError?.message.includes("already disputed")
  ) {
    return {
      title: disputed,
      disabled: true,
      disabledReason: "Already disputed.",
    };
  }
  return {
    title: dispute,
    action: disputeAssertion,
    errors: [
      prepareDisputeAssertionError?.message,
      disputeAssertionError?.message,
    ],
  };
}

export function useSettlePriceAction({
  query,
}: {
  query?: OracleQueryUI;
}): ActionState | undefined {
  const { settlePriceParams, chainId } = query ?? {};
  const {
    config: settlePriceConfig,
    error: prepareSettlePriceError,
    isLoading: isPrepareSettlePriceLoading,
    refetch: refetchConfig,
  } = usePrepareContractWrite({
    ...settlePriceParams,
    scopeKey: query?.id,
    enabled: !!query?.id,
  });
  const {
    write: settlePrice,
    data: settlePriceTransaction,
    error: settlePriceError,
    isLoading: isSettlePriceLoading,
    reset: resetContractWrite,
  } = useContractWrite(settlePriceConfig);
  const { isLoading: isSettlingPrice, isSuccess } = useWaitForTransaction({
    hash: settlePriceTransaction?.hash,
  });
  useEffect(() => {
    if (!query?.id) return;
    refetchConfig &&
      refetchConfig().catch((err) =>
        console.warn("error refetching config", err),
      );
    resetContractWrite();
  }, [query?.id, refetchConfig, resetContractWrite]);
  useEffect(() => {
    if (!settlePriceTransaction || !chainId) return;
    handleNotifications(settlePriceTransaction, chainId, {
      pending: <>Settling price</>,
      success: <>Settled price</>,
      error: <>Failed to settle price</>,
    })
      // .then((receipt) => {
      //   if (receipt && query)
      //     oracleEthersApis?.[query.oracleType]?.[
      //       chainId
      //     ]?.updateFromTransactionReceipt(receipt);
      // })
      .catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settlePriceTransaction]);

  if (settlePriceParams === undefined) return undefined;

  if (isPrepareSettlePriceLoading) {
    return {
      title: settle,
      disabled: true,
      disabledReason: "Preparing settle transaction...",
    };
  }
  if (isSettlePriceLoading || isSettlingPrice) {
    return {
      title: settling,
      disabled: true,
      disabledReason: "Settling...",
    };
  }
  // console.log(query)
  // unique to settle, if we have an error preparing the transaction,
  // this means this is probably disputed, but no answer available from dvm yet
  if (prepareSettlePriceError) {
    return {
      title: "Unable to Settle",
      disabled: true,
      disabledReason: prepareSettlePriceError.message,
    };
  }
  if (isSuccess) {
    return {
      title: settled,
      disabled: true,
      disabledReason: "Already settled.",
    };
  }
  return {
    title: settle,
    action: settlePrice,
    errors: [settlePriceError?.message],
  };
}
export function useSettleAssertionAction({
  query,
}: {
  query?: OracleQueryUI;
}): ActionState | undefined {
  const { settleAssertionParams, chainId } = query ?? {};
  const {
    config: settleAssertionConfig,
    error: prepareSettleAssertionError,
    isLoading: isPrepareSettleAssertionLoading,
    refetch: refetchConfig,
  } = usePrepareContractWrite({
    ...settleAssertionParams,
    scopeKey: query?.id,
    enabled: !!query?.id,
  });
  const {
    write: settleAssertion,
    data: settleAssertionTransaction,
    error: settleAssertionError,
    isLoading: isSettleAssertionLoading,
    reset: resetContractWrite,
  } = useContractWrite(settleAssertionConfig);
  const { isLoading: isSettlingAssertion, isSuccess } = useWaitForTransaction({
    hash: settleAssertionTransaction?.hash,
  });
  useEffect(() => {
    if (!query?.id) return;
    refetchConfig &&
      refetchConfig().catch((err) =>
        console.warn("error refetching config", err),
      );
    resetContractWrite();
  }, [query?.id, refetchConfig, resetContractWrite]);
  useEffect(() => {
    if (!settleAssertionTransaction || !chainId) return;
    handleNotifications(settleAssertionTransaction, chainId, {
      pending: <>Settling assertion</>,
      success: <>Settled assertion</>,
      error: <>Failed to settle assertion</>,
    })
      // .then((receipt) => {
      //   if (receipt && query)
      //     oracleEthersApis?.[query.oracleType]?.[
      //       chainId
      //     ]?.updateFromTransactionReceipt(receipt);
      // })
      .catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settleAssertionTransaction]);

  if (settleAssertionParams === undefined) return undefined;

  if (isPrepareSettleAssertionLoading) {
    return {
      title: settle,
      disabled: true,
      disabledReason: "Preparing settle transaction...",
    };
  }
  if (isSettleAssertionLoading || isSettlingAssertion) {
    return {
      title: settling,
      disabled: true,
      disabledReason: "Settling...",
    };
  }
  // unique to settle, if we have an error preparing the transaction,
  // this means this is probably disputed, but no answer available from dvm yet
  if (prepareSettleAssertionError) {
    return {
      title: disputed,
      disabled: true,
      disabledReason: "This query is disputed.",
    };
  }
  if (isSuccess) {
    return {
      title: settled,
      disabled: true,
      disabledReason: "Already settled.",
    };
  }
  return {
    title: settle,
    action: settleAssertion,
    errors: [settleAssertionError?.message],
  };
}
