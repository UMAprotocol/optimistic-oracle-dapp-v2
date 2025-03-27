"use client";

import { useLocalStorage } from "usehooks-ts";
import { Button } from "../Button";
import { Modal, type ModalProps } from "./Modal";
import { TriangleAlert } from "lucide-react";
import { Checkbox } from "../ui/checkbox";

export type ProposalModalProps = Omit<ModalProps, "children"> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onContinue: (() => void) | (() => Promise<any>) | undefined;
  className?: string;
};

export const earlyProposalKey = "show-early-proposal-warning";

export function ProposalModal({
  className,
  onContinue,
  ...props
}: ProposalModalProps) {
  const [showWarning, setShowWarning] = useLocalStorage(earlyProposalKey, true);

  function handleContinue() {
    props.onOpenChange?.(false);
    void onContinue?.();
  }

  return (
    <Modal {...props}>
      <div className="flex flex-col w-full gap-4">
        <div className="flex justify-start gap-2 pr-4">
          <TriangleAlert className="text-red-500 shrink-0" />
          <span className="font-bold">Is This Proposal Too Early?</span>
        </div>
        <p>
          Proposals made even seconds before results are final can be disputed
          and resolved as being too early (P4). If this happens, you will lose
          your bond.{" "}
          <strong>
            Please review the resolution criteria before proposing.
          </strong>
        </p>

        <p className="py-1">
          <a
            href="https://blog.uma.xyz/articles/what-is-p4"
            target="_blank"
            rel="noreferrer"
            className="text-red-600 underline hover:no-underline "
          >
            Learn more
          </a>{" "}
          about timing your proposals correctly.
        </p>

        <label
          className="flex py-1 gap-2 items-center cursor-pointer"
          htmlFor="show-early-proposal-checkbox"
        >
          <Checkbox
            id="show-early-proposal-checkbox"
            className="pl-0"
            onCheckedChange={(checked) => setShowWarning(!checked)}
            checked={!showWarning}
          />
          Don&apos;t show this message again
        </label>

        <div className="flex-col mt-2 flex sm:flex-row w-full justify-between gap-2">
          <Button width="100%" onClick={handleContinue} variant="primary">
            Continue and sign
          </Button>
          <Button
            width="100%"
            onClick={() => props.onOpenChange?.(false)}
            variant="secondary"
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
