import { Header } from "@/components";
import { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Header> = {
  component: Header,
};

export default meta;

type Story = StoryObj<typeof Header>;

export const VerifyPage: Story = {
  render: (args) => <Header {...args} />,
  args: {
    page: "verify",
  },
};

export const ProposePage: Story = {
  render: (args) => <Header {...args} />,
  args: {
    page: "propose",
  },
};

export const SettledPage: Story = {
  render: (args) => <Header {...args} />,
  args: {
    page: "settled",
  },
};
