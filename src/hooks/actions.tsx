import { Currency } from "@/components";
import {
  approveSpend,
  approvingSpend,
  changeChain,
  changingChains,
  connectWallet,
  connectingWallet,
  dispute,
  disputing,
  insufficientBalance,
  propose,
  settle,
  settled,
  settling,
} from "@/constants";
import { handleNotifications } from "@/helpers";
import { useBalanceAndAllowance } from "@/hooks";
import type { ActionTitle, OracleQueryUI } from "@/types";
import { useEffect } from "react";
import {
  useAccount,
  useConnect,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useSwitchNetwork,
  useWaitForTransaction,
} from "wagmi";
import { oracleEthersApis } from "@/contexts";

// This represents an action button, and the state we need to render it
export type ActionState = Partial<{
  action: () => void;
  disabled: boolean;
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
  // TODO: work out settle logic. need to clarify how we can detect when to show settle, and interactions
  // between change chain action, settle action and showing settled when on wrong chain
  // const settlePriceAction = useSettlePriceAction({ query });
  // const settleAssertionAction = useSettleAssertionAction({ query });

  return (
    accountAction ||
    approveBondAction ||
    proposeAction ||
    disputeAction ||
    disputeAssertionAction
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
    };
  }

  // change chains is loading
  if (isNetworkLoading) {
    return {
      title: changingChains,
      disabled: true,
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
  } = usePrepareContractWrite(approveBondSpendParams);
  const {
    write: approveBondSpend,
    data: approveBondSpendTransaction,
    error: approveBondSpendError,
    isLoading: isApproveBondSpendLoading,
  } = useContractWrite(approveBondSpendConfig);
  const { isLoading: isApprovingBondSpend } = useWaitForTransaction({
    hash: approveBondSpendTransaction?.hash,
  });

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
  if (balance && bond && balance.value?.lt(bond)) {
    return {
      title: insufficientBalance,
      disabled: true,
    };
  }
  if (!approveBondSpendParams) return undefined;
  const needsToApprove =
    allowance !== undefined && bond !== undefined && allowance.lt(bond);
  if (!needsToApprove) return undefined;

  if (isPrepareApproveBondSpendLoading) {
    return {
      title: approveSpend,
      disabled: true,
    };
  }
  if (isApproveBondSpendLoading || isApprovingBondSpend) {
    return {
      title: approvingSpend,
      disabled: true,
    };
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
  const { proposePriceParams, chainId } = query ?? {};
  const {
    config: proposePriceConfig,
    error: prepareProposePriceError,
    isLoading: isPrepareProposePriceLoading,
  } = usePrepareContractWrite(proposePriceParams?.(proposePriceInput));
  const {
    write: proposePrice,
    data: proposePriceTransaction,
    error: proposePriceError,
    isLoading: isProposePriceLoading,
  } = useContractWrite(proposePriceConfig);
  const { isLoading: isProposingPrice } = useWaitForTransaction({
    hash: proposePriceTransaction?.hash,
  });
  // notify based on proposal tx
  useEffect(() => {
    if (!proposePriceTransaction || !chainId) return;
    handleNotifications(proposePriceTransaction, chainId, {
      pending: <>Proposing price</>,
      success: <>Proposed price</>,
      error: <>Failed to propose price</>,
    })
      .then((receipt) => {
        if (receipt && query)
          oracleEthersApis?.[query.oracleType]?.[
            chainId
          ]?.updateFromTransactionReceipt(receipt);
      })
      .catch(console.error);
  }, [proposePriceTransaction, chainId, query]);

  if (proposePriceParams === undefined) return undefined;

  // TODO validate input
  if (proposePriceInput === undefined || proposePriceInput?.length === 0) {
    return {
      title: propose,
      disabled: true,
    };
  }

  if (isPrepareProposePriceLoading) {
    return {
      title: propose,
      disabled: true,
    };
  }
  if (isProposePriceLoading || isProposingPrice) {
    return {
      title: "Proposing...",
      disabled: true,
    };
  }
  return {
    title: propose,
    action: proposePrice,
    errors: [prepareProposePriceError?.message, proposePriceError?.message],
  };
}

export function useDisputeAction({
  query,
}: {
  query?: OracleQueryUI;
}): ActionState | undefined {
  const { disputePriceParams, chainId } = query ?? {};
  const {
    config: disputePriceConfig,
    error: prepareDisputePriceError,
    isLoading: isPrepareDisputePriceLoading,
  } = usePrepareContractWrite(disputePriceParams);
  const {
    write: disputePrice,
    data: disputePriceTransaction,
    error: disputePriceError,
    isLoading: isDisputePriceLoading,
  } = useContractWrite(disputePriceConfig);

  const { isLoading: isDisputingPrice } = useWaitForTransaction({
    hash: disputePriceTransaction?.hash,
  });
  // notify based on dispute tx
  useEffect(() => {
    if (!disputePriceTransaction || !chainId) return;
    handleNotifications(disputePriceTransaction, chainId, {
      pending: <>Disputing price</>,
      success: <>Disputed price</>,
      error: <>Failed to dispute price</>,
    })
      .then((receipt) => {
        if (receipt && query)
          oracleEthersApis?.[query.oracleType]?.[
            chainId
          ]?.updateFromTransactionReceipt(receipt);
      })
      .catch(console.error);
  }, [disputePriceTransaction, chainId, query]);

  if (disputePriceParams === undefined) return undefined;

  if (isPrepareDisputePriceLoading) {
    return {
      title: dispute,
      disabled: true,
    };
  }
  if (isDisputePriceLoading || isDisputingPrice) {
    return {
      title: disputing,
      disabled: true,
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
  } = usePrepareContractWrite(disputeAssertionParams?.(address));
  const {
    write: disputeAssertion,
    data: disputeAssertionTransaction,
    error: disputeAssertionError,
    isLoading: isDisputeAssertionLoading,
  } = useContractWrite(disputeAssertionConfig);
  const { isLoading: isDisputingAssertion } = useWaitForTransaction({
    hash: disputeAssertionTransaction?.hash,
  });

  // notify based on dispute tx
  useEffect(() => {
    if (!disputeAssertionTransaction || !chainId) return;
    handleNotifications(disputeAssertionTransaction, chainId, {
      pending: <>Disputing assertion</>,
      success: <>Disputed assertion</>,
      error: <>Failed to dispute assertion</>,
    }).catch(console.error);
  }, [disputeAssertionTransaction, chainId]);

  if (disputeAssertionParams === undefined) return undefined;

  if (isPrepareDisputeAssertionLoading) {
    return {
      title: dispute,
      disabled: true,
    };
  }
  if (isDisputeAssertionLoading || isDisputingAssertion) {
    return {
      title: disputing,
      disabled: true,
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
  } = usePrepareContractWrite(settlePriceParams);
  const {
    write: settlePrice,
    data: settlePriceTransaction,
    error: settlePriceError,
    isLoading: isSettlePriceLoading,
  } = useContractWrite(settlePriceConfig);
  const { isLoading: isSettlingPrice } = useWaitForTransaction({
    hash: settlePriceTransaction?.hash,
  });
  useEffect(() => {
    if (!settlePriceTransaction || !chainId) return;
    handleNotifications(settlePriceTransaction, chainId, {
      pending: <>Settling price</>,
      success: <>Settled price</>,
      error: <>Failed to settle price</>,
    }).catch(console.error);
  }, [settlePriceTransaction, chainId]);

  if (settlePriceParams === undefined) return undefined;

  if (isPrepareSettlePriceLoading) {
    return {
      title: settle,
      disabled: true,
    };
  }
  if (isSettlePriceLoading || isSettlingPrice) {
    return {
      title: settling,
      disabled: true,
    };
  }
  // unique to settle, if we have an error preparing the transaction, this usually means the request has been settled
  if (prepareSettlePriceError) {
    return {
      title: settled,
      disabled: true,
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
  } = usePrepareContractWrite(settleAssertionParams);
  const {
    write: settleAssertion,
    data: settleAssertionTransaction,
    error: settleAssertionError,
    isLoading: isSettleAssertionLoading,
  } = useContractWrite(settleAssertionConfig);
  const { isLoading: isSettlingAssertion } = useWaitForTransaction({
    hash: settleAssertionTransaction?.hash,
  });
  useEffect(() => {
    if (!settleAssertionTransaction || !chainId) return;
    handleNotifications(settleAssertionTransaction, chainId, {
      pending: <>Settling assertion</>,
      success: <>Settled assertion</>,
      error: <>Failed to settle assertion</>,
    }).catch(console.error);
  }, [settleAssertionTransaction, chainId]);

  if (settleAssertionParams === undefined) return undefined;

  if (isPrepareSettleAssertionLoading) {
    return {
      title: settle,
      disabled: true,
    };
  }
  if (isSettleAssertionLoading || isSettlingAssertion) {
    return {
      title: settling,
      disabled: true,
    };
  }
  // unique to settle, if we have an error preparing the transaction, this usually means the request has been settled
  if (prepareSettleAssertionError) {
    return {
      title: settled,
      disabled: true,
    };
  }
  return {
    title: settle,
    action: settleAssertion,
    errors: [settleAssertionError?.message],
  };
}
