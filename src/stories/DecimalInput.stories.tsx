import { DecimalInput } from "@/components";
import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

const meta: Meta<typeof DecimalInput> = {
  component: DecimalInput,
};

export default meta;

type Story = StoryObj<typeof DecimalInput>;

interface Props {
  Component: typeof DecimalInput;
  disabled?: boolean;
  placeholder?: string;
  maxDecimals?: number;
  allowNegative?: boolean;
}
function Wrapper({
  Component,
  disabled,
  placeholder,
  maxDecimals,
  allowNegative,
}: Props) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  return (
    <div>
      <Component
        value={value}
        onInput={setValue}
        addErrorMessage={setError}
        removeErrorMessage={() => setError("")}
        disabled={disabled}
        placeholder={placeholder}
        maxDecimals={maxDecimals}
        allowNegative={allowNegative}
      />
      <div>{error}</div>
    </div>
  );
}

export const Default: Story = {
  render: (args) => <Wrapper Component={DecimalInput} {...args} />,
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  ...Default,
};

export const Placeholder: Story = {
  args: {
    placeholder: "Custom placeholder",
  },
  ...Default,
};

export const MaxDecimals: Story = {
  args: {
    maxDecimals: 2,
  },
  ...Default,
};

export const AllowNegative: Story = {
  args: {
    allowNegative: false,
  },
  ...Default,
};
