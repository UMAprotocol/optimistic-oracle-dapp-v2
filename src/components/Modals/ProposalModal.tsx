import { Button } from "../Button";
import { Modal, type ModalProps } from "./Modal";
import { TriangleAlert } from "lucide-react";

export type ProposalModalProps = Omit<ModalProps, "children"> & {
  onContinue: () => void;
  className?: string;
};

export function ProposalModal({
  className,
  onContinue,
  ...props
}: ProposalModalProps) {
  return (
    <Modal {...props}>
      <div className="flex flex-col w-full gap-4">
        <div className="flex justify-start gap-2">
          <TriangleAlert className="text-red-500" />
          <span className="font-bold">
            Are you sure this proposal is not Too Early?
          </span>
        </div>
        <p>
          Proposals that are made even seconds before results are final can be
          disputed and resolved TOO EARLY which results in the proposer losing
          their bond. 82% of successful disputes are resolved TOO EARLY. Read
          more{" "}
          <a href="https://blog.uma.xyz/articles/what-is-p4" target="_blank">
            here
          </a>{" "}
          .
        </p>
        <div className="flex-col flex sm:flex-row w-full justify-between gap-2">
          <Button width="100%" onClick={onContinue} variant="primary">
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
