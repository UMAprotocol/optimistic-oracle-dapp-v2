import { Checkbox, DecimalInput, RadioDropdown } from "@/components";
import { cn } from "@/helpers";
import type {
  SingleInputProps,
  MultipleInputProps,
} from "@/hooks/proposePriceInput";
import { INPUT_TYPES } from "@/hooks/proposePriceInput";
import Close from "public/assets/icons/close.svg";
import styled from "styled-components";

type CommonProps = {
  disabled: boolean;
};

type PriceInputProps =
  | (SingleInputProps & CommonProps)
  | (MultipleInputProps & CommonProps);

export function ProposeInput(props: PriceInputProps) {
  return (
    <div className="flex flex-col w-full gap-2 mb-2">
      {props.inputType === INPUT_TYPES.SINGLE ? (
        <ProposeInputSingle {...props} />
      ) : (
        <MultipleValuesInput {...props} />
      )}
    </div>
  );
}

function ProposeInputSingle({
  isCustomInput,
  exitCustomInput,
  inputType,
  ...props
}: SingleInputProps & CommonProps) {
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

function MultipleValuesInput(props: MultipleInputProps) {
  const items = Object.entries(props?.proposePriceInput);

  if (!items?.length) return null;

  return (
    <div
      className={cn(
        "flex gap-2 items-start justify-between w-full mb-2 relative",
        { "flex-col": items?.length > 2 },
      )}
    >
      {items.map(([label, value]) => (
        <label
          key={label}
          htmlFor={`input-${label}`}
          className="flex flex-col gap-2 font-bold "
        >
          {label}
          <DecimalInput
            disabled={props.isUnresolvable}
            id={`input-${label}`}
            placeholder={"Enter score"} // TODO: make this dynamic
            maxDecimals={0}
            value={value}
            onInput={(_val) => props.onChange({ label, value: _val })}
            addErrorMessage={props.addErrorMessage}
            removeErrorMessage={props.removeErrorMessage}
          />
        </label>
      ))}
      <StyledCheckbox
        checked={props.isUnresolvable}
        itemName="Unresolvable"
        onCheckedChange={() => props.setIsUnresolvable(!props.isUnresolvable)}
      />
    </div>
  );
}

const StyledCheckbox = styled(Checkbox)`
  padding-left: 0;
`;
