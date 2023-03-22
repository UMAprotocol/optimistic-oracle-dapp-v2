import { Currency } from "@/components";
import { handleNotifications } from "@/helpers";
import type { OracleQueryUI } from "@/types";
import { useEffect } from "react";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

export function useActions(
  query: OracleQueryUI | undefined,
  proposePriceInput: string
) {
  const { address } = useAccount();
  const {
    approveBondSpendParams,
    proposePriceParams,
    disputePriceParams,
    settlePriceParams,
    disputeAssertionParams,
    settleAssertionParams,
  } = query ?? {};

  const {
    config: approveBondSpendConfig,
    error: prepareApproveBondSpendError,
    isLoading: isPrepareApproveBondSpendLoading,
  } = usePrepareContractWrite(approveBondSpendParams);
  const {
    config: proposePriceConfig,
    error: prepareProposePriceError,
    isLoading: isPrepareProposePriceLoading,
  } = usePrepareContractWrite(proposePriceParams?.(proposePriceInput));
  const {
    config: disputePriceConfig,
    error: prepareDisputePriceError,
    isLoading: isPrepareDisputePriceLoading,
  } = usePrepareContractWrite(disputePriceParams);
  const {
    config: settlePriceConfig,
    error: prepareSettlePriceError,
    isLoading: isPrepareSettlePriceLoading,
  } = usePrepareContractWrite(settlePriceParams);
  const {
    config: disputeAssertionConfig,
    error: prepareDisputeAssertionError,
    isLoading: isPrepareDisputeAssertionLoading,
  } = usePrepareContractWrite(disputeAssertionParams?.(address));
  const {
    config: settleAssertionConfig,
    error: prepareSettleAssertionError,
    isLoading: isPrepareSettleAssertionLoading,
  } = usePrepareContractWrite(settleAssertionParams);

  const {
    write: approveBondSpend,
    data: approveBondSpendTransaction,
    error: approveBondSpendError,
    isLoading: isApproveBondSpendLoading,
  } = useContractWrite(approveBondSpendConfig);
  const {
    write: proposePrice,
    data: proposePriceTransaction,
    error: proposePriceError,
    isLoading: isProposePriceLoading,
  } = useContractWrite(proposePriceConfig);
  const {
    write: disputePrice,
    data: disputePriceTransaction,
    error: disputePriceError,
    isLoading: isDisputePriceLoading,
  } = useContractWrite(disputePriceConfig);
  const {
    write: settlePrice,
    data: settlePriceTransaction,
    error: settlePriceError,
    isLoading: isSettlePriceLoading,
  } = useContractWrite(settlePriceConfig);
  const {
    write: disputeAssertion,
    data: disputeAssertionTransaction,
    error: disputeAssertionError,
    isLoading: isDisputeAssertionLoading,
  } = useContractWrite(disputeAssertionConfig);
  const {
    write: settleAssertion,
    data: settleAssertionTransaction,
    error: settleAssertionError,
    isLoading: isSettleAssertionLoading,
  } = useContractWrite(settleAssertionConfig);

  const {
    data: approveBondSpendReceipt,
    isLoading: isApprovingBondSpend,
    error: approvingBondSpendError,
  } = useWaitForTransaction({
    hash: approveBondSpendTransaction?.hash,
  });
  const {
    data: proposePriceReceipt,
    isLoading: isProposingPrice,
    error: proposingPriceError,
  } = useWaitForTransaction({
    hash: proposePriceTransaction?.hash,
  });
  const {
    data: disputePriceReceipt,
    isLoading: isDisputingPrice,
    error: disputingPriceError,
  } = useWaitForTransaction({
    hash: disputePriceTransaction?.hash,
  });
  const {
    data: settlePriceReceipt,
    isLoading: isSettlingPrice,
    error: settlingPriceError,
  } = useWaitForTransaction({
    hash: settlePriceTransaction?.hash,
  });
  const {
    data: disputeAssertionReceipt,
    isLoading: isDisputingAssertion,
    error: disputingAssertionError,
  } = useWaitForTransaction({
    hash: disputeAssertionTransaction?.hash,
  });
  const {
    data: settleAssertionReceipt,
    isLoading: isSettlingAssertion,
    error: settlingAssertionError,
  } = useWaitForTransaction({
    hash: settleAssertionTransaction?.hash,
  });

  const isPrepareLoading =
    isPrepareApproveBondSpendLoading ||
    isPrepareProposePriceLoading ||
    isPrepareDisputePriceLoading ||
    isPrepareSettlePriceLoading ||
    isPrepareDisputeAssertionLoading ||
    isPrepareSettleAssertionLoading;

  const isActionLoading =
    isPrepareLoading ||
    isApproveBondSpendLoading ||
    isProposePriceLoading ||
    isDisputePriceLoading ||
    isSettlePriceLoading ||
    isDisputeAssertionLoading ||
    isSettleAssertionLoading;

  const isInteracting = Boolean(
    isApprovingBondSpend ||
      isProposingPrice ||
      isDisputingPrice ||
      isSettlingPrice ||
      isDisputingAssertion ||
      isSettlingAssertion
  );

  const isInteractionError = Boolean(
    approvingBondSpendError ||
      proposingPriceError ||
      disputingPriceError ||
      settlingPriceError ||
      disputingAssertionError ||
      settlingAssertionError
  );

  const isPrepareError = Boolean(
    prepareApproveBondSpendError ||
      prepareProposePriceError ||
      prepareDisputePriceError ||
      prepareSettlePriceError ||
      prepareDisputeAssertionError ||
      prepareSettleAssertionError
  );

  const isActionError = Boolean(
    approveBondSpendError ||
      proposePriceError ||
      disputePriceError ||
      settlePriceError ||
      disputeAssertionError ||
      settleAssertionError
  );

  const isLoading = isPrepareLoading || isActionLoading || isInteracting;
  const isError = isPrepareError || isActionError || isInteractionError;

  const errorMessages = [
    new Set(
      ...[
        prepareApproveBondSpendError,
        prepareProposePriceError,
        prepareDisputePriceError,
        prepareSettlePriceError,
        prepareDisputeAssertionError,
        prepareSettleAssertionError,
        approveBondSpendError,
        proposePriceError,
        disputePriceError,
        settlePriceError,
        disputeAssertionError,
        settleAssertionError,
        approvingBondSpendError,
        proposingPriceError,
        disputingPriceError,
        settlingPriceError,
        disputingAssertionError,
        settlingAssertionError,
      ]
        .filter(Boolean)
        .map(({ message }) => message)
    ),
  ];

  useEffect(() => {
    if (approveBondSpendTransaction) {
      const currencyComponent = (
        <Currency
          value={query?.bond}
          chainId={query?.chainId}
          address={query?.tokenAddress}
        />
      );
      void handleNotifications(approveBondSpendTransaction, {
        pending: <>Approving {currencyComponent}</>,
        success: <>Approved {currencyComponent}</>,
        error: <>Failed to approve {currencyComponent}</>,
      });
    }
    if (proposePriceTransaction) {
      void handleNotifications(proposePriceTransaction, {
        pending: <>Proposing price</>,
        success: <>Proposed price</>,
        error: <>Failed to propose price</>,
      });
    }
    if (disputePriceTransaction) {
      void handleNotifications(disputePriceTransaction, {
        pending: <>Disputing price</>,
        success: <>Disputed price</>,
        error: <>Failed to dispute price</>,
      });
    }
    if (settlePriceTransaction) {
      void handleNotifications(settlePriceTransaction, {
        pending: <>Settling price</>,
        success: <>Settled price</>,
        error: <>Failed to settle price</>,
      });
    }
    if (disputeAssertionTransaction) {
      void handleNotifications(disputeAssertionTransaction, {
        pending: <>Disputing assertion</>,
        success: <>Disputed assertion</>,
        error: <>Failed to dispute assertion</>,
      });
    }
    if (settleAssertionTransaction) {
      void handleNotifications(settleAssertionTransaction, {
        pending: <>Settling assertion</>,
        success: <>Settled assertion</>,
        error: <>Failed to settle assertion</>,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    approveBondSpendTransaction,
    proposePriceTransaction,
    disputePriceTransaction,
    settlePriceTransaction,
    disputeAssertionTransaction,
    settleAssertionTransaction,
  ]);

  return {
    approveBondSpend,
    proposePrice,
    disputePrice,
    settlePrice,
    disputeAssertion,
    settleAssertion,
    isLoading,
    isPrepareLoading,
    isActionLoading,
    isInteracting,
    isError,
    isPrepareError,
    isActionError,
    isInteractionError,
    errorMessages,
    approveBondSpendReceipt,
    proposePriceReceipt,
    disputePriceReceipt,
    settlePriceReceipt,
    disputeAssertionReceipt,
    settleAssertionReceipt,
  };
}
