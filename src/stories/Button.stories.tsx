import { Button } from "@/components";
import { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;

type Story = StoryObj<typeof Button>;

const asButtonArgs = {
  variant: "primary" as const,
  children: "Button",
  onClick: () => alert("Button clicked"),
  href: undefined,
};

export const AsButtonPrimary: Story = {
  args: {
    ...asButtonArgs,
  },
};

export const AsButtonPrimaryDisabled: Story = {
  args: {
    ...asButtonArgs,
    disabled: true,
  },
};

export const AsButtonSecondary: Story = {
  args: {
    ...asButtonArgs,
    variant: "secondary",
  },
};

export const AsButtonSecondaryDisabled: Story = {
  args: {
    ...asButtonArgs,
    variant: "secondary",
    disabled: true,
  },
};

export const AsButtonTertiary: Story = {
  args: {
    ...asButtonArgs,
    variant: "tertiary",
  },
};

const asLinkArgs = {
  variant: "primary" as const,
  children: "Link",
  href: "https://google.com",
  onClick: undefined,
};

export const AsLinkPrimary: Story = {
  args: {
    ...asLinkArgs,
  },
};

export const AsLinkSecondary: Story = {
  args: {
    ...asLinkArgs,
    variant: "secondary",
  },
};

export const AsLinkTertiary: Story = {
  args: {
    ...asLinkArgs,
    variant: "tertiary",
  },
};
