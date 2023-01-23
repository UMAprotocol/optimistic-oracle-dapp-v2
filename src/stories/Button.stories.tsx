import { Button } from "@/components";
import { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;

type Story = StoryObj<typeof Button>;

const asButtonArgs = {
  variant: "primary" as const,
  label: "Button",
  onClick: () => alert("Button clicked"),
  href: undefined,
};

export const AsButtonPrimary: Story = {
  render: (args) => <Button {...args} />,
  args: {
    ...asButtonArgs,
  },
};

export const AsButtonPrimaryDisabled: Story = {
  render: (args) => <Button {...args} />,
  args: {
    ...asButtonArgs,
    disabled: true,
  },
};

export const AsButtonSecondary: Story = {
  render: (args) => <Button {...args} />,
  args: {
    ...asButtonArgs,
    variant: "secondary",
  },
};

export const AsButtonSecondaryDisabled: Story = {
  render: (args) => <Button {...args} />,
  args: {
    ...asButtonArgs,
    variant: "secondary",
    disabled: true,
  },
};

export const AsButtonTertiary: Story = {
  render: (args) => <Button {...args} />,
  args: {
    ...asButtonArgs,
    variant: "tertiary",
  },
};

const asLinkArgs = {
  variant: "primary" as const,
  label: "Link",
  href: "https://google.com",
  onClick: undefined,
};

export const AsLinkPrimary: Story = {
  render: (args) => <Button {...args} />,
  args: {
    ...asLinkArgs,
  },
};

export const AsLinkSecondary: Story = {
  render: (args) => <Button {...args} />,
  args: {
    ...asLinkArgs,
    variant: "secondary",
  },
};

export const AsLinkTertiary: Story = {
  render: (args) => <Button {...args} />,
  args: {
    ...asLinkArgs,
    variant: "tertiary",
  },
};
