import { DecimalInput, RadioDropdown } from "@/components";
import type { DropdownItem } from "@/types";
import Close from "public/assets/icons/close.svg";

interface Props {
  value: string;
  disabled: boolean;
  items: DropdownItem[] | undefined;
  selected: DropdownItem | undefined;
  isCustomInput: boolean;
  onInput: (value: string) => void;
  onSelect: (item: DropdownItem) => void;
  addErrorMessage: (value: string) => void;
  removeErrorMessage: () => void;
  exitCustomInput: () => void;
}
export function ProposeInput({
  isCustomInput,
  exitCustomInput,
  ...props
}: Props) {
  const isDropdown = !isCustomInput && !!props.items && props.items.length > 0;

  return (
    <div className="relative mt-4 mb-5">
      {isDropdown ? <RadioDropdown {...props} /> : <DecimalInput {...props} />}
      {isCustomInput && (
        <button
          className="absolute top-[10px] right-[10px] grid place-items-center w-6 h-6 rounded-full bg-grey-100 transition hover:opacity-75"
          aria-label="exit custom input"
          onClick={exitCustomInput}
          disabled={props.disabled}
        >
          <Close className="w-[10px] [&>path]:fill-dark" />
        </button>
      )}
    </div>
  );
}
