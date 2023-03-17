import type { OracleQueryUI } from "@/types";
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
  } = usePrepareContractWrite(settlePriceParams ?? {});
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
    data: approveBondSpendResult,
    error: approveBondSpendError,
    isLoading: isApproveBondSpendLoading,
  } = useContractWrite({
    ...approveBondSpendConfig,
    onMutate() {
      alert(`\`approveBondSpend\` called...`);
    },
  });
  const {
    write: proposePrice,
    data: proposePriceResult,
    error: proposePriceError,
    isLoading: isProposePriceLoading,
  } = useContractWrite({
    ...proposePriceConfig,
    onMutate() {
      alert(`\`proposePrice\` called...`);
    },
  });
  const {
    write: disputePrice,
    data: disputePriceResult,
    error: disputePriceError,
    isLoading: isDisputePriceLoading,
  } = useContractWrite({
    ...disputePriceConfig,
    onMutate() {
      alert(`\`disputePrice\` called...`);
    },
  });
  const {
    write: settlePrice,
    data: settlePriceResult,
    error: settlePriceError,
    isLoading: isSettlePriceLoading,
  } = useContractWrite({
    ...settlePriceConfig,
    onMutate() {
      alert(`\`settlePrice\` called...`);
    },
  });
  const {
    write: disputeAssertion,
    data: disputeAssertionResult,
    error: disputeAssertionError,
    isLoading: isDisputeAssertionLoading,
  } = useContractWrite({
    ...disputeAssertionConfig,
    onMutate() {
      alert(`\`disputeAssertion\` called...`);
    },
  });
  const {
    write: settleAssertion,
    data: settleAssertionResult,
    error: settleAssertionError,
    isLoading: isSettleAssertionLoading,
  } = useContractWrite({
    ...settleAssertionConfig,
    onMutate() {
      alert(`\`settleAssertion\` called...`);
    },
  });

  const {
    data: approveBondSpendReceipt,
    isLoading: isApprovingBondSpend,
    error: approvingBondSpendError,
  } = useWaitForTransaction({
    hash: approveBondSpendResult?.hash,
    onSettled(receipt, error) {
      if (error) {
        alert(`\`approveBondSpend\` failed: ${error.message}`);
      }
      if (receipt) {
        alert(`\`approveBondSpend\` succeeded: ${receipt.transactionHash}`);
      }
    },
  });
  const {
    data: proposePriceReceipt,
    isLoading: isProposingPrice,
    error: proposingPriceError,
  } = useWaitForTransaction({
    hash: proposePriceResult?.hash,
    onSettled(receipt, error) {
      if (error) {
        alert(`\`proposePrice\` failed: ${error.message}`);
      }
      if (receipt) {
        alert(`\`proposePrice\` succeeded: ${receipt.transactionHash}`);
      }
    },
  });
  const {
    data: disputePriceReceipt,
    isLoading: isDisputingPrice,
    error: disputingPriceError,
  } = useWaitForTransaction({
    hash: disputePriceResult?.hash,
    onSettled(receipt, error) {
      if (error) {
        alert(`\`disputePrice\` failed: ${error.message}`);
      }
      if (receipt) {
        alert(`\`disputePrice\` succeeded: ${receipt.transactionHash}`);
      }
    },
  });
  const {
    data: settlePriceReceipt,
    isLoading: isSettlingPrice,
    error: settlingPriceError,
  } = useWaitForTransaction({
    hash: settlePriceResult?.hash,
    onSettled(receipt, error) {
      if (error) {
        alert(`\`settlePrice\` failed: ${error.message}`);
      }
      if (receipt) {
        alert(`\`settlePrice\` succeeded: ${receipt.transactionHash}`);
      }
    },
  });
  const {
    data: disputeAssertionReceipt,
    isLoading: isDisputingAssertion,
    error: disputingAssertionError,
  } = useWaitForTransaction({
    hash: disputeAssertionResult?.hash,
    onSettled(receipt, error) {
      if (error) {
        alert(`\`disputeAssertion\` failed: ${error.message}`);
      }
      if (receipt) {
        alert(`\`disputeAssertion\` succeeded: ${receipt.transactionHash}`);
      }
    },
  });
  const {
    data: settleAssertionReceipt,
    isLoading: isSettlingAssertion,
    error: settlingAssertionError,
  } = useWaitForTransaction({
    hash: settleAssertionResult?.hash,
    onSettled(receipt, error) {
      if (error) {
        alert(`\`settleAssertion\` failed: ${error.message}`);
      }
      if (receipt) {
        alert(`\`settleAssertion\` succeeded: ${receipt.transactionHash}`);
      }
    },
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
    ...new Set(
      [
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
