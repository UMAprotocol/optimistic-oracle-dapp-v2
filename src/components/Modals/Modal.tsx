import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { DialogProps } from "@radix-ui/react-dialog";
import { cn } from "@/helpers";

export type ModalProps = DialogProps & {
  children?: React.ReactNode;
  className?: string;
};

export function Modal({ children, className, ...props }: ModalProps) {
  return (
    <Dialog {...props}>
      <DialogContent className={cn(className)}>{children}</DialogContent>
    </Dialog>
  );
}
