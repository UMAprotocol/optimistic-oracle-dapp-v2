import { Header } from "@/components";
import { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Header> = {
  component: Header,
};

export default meta;

type Story = StoryObj<typeof Header>;

export const VerifyPage: Story = {
  args: {
    page: "verify",
  },
  parameters: {
    nextjs: {
      router: {
        pathname: "/",
      },
    },
  },
};

export const ProposePage: Story = {
  args: {
    page: "propose",
  },
  parameters: {
    nextjs: {
      router: {
        pathname: "/propose",
      },
    },
  },
};

export const SettledPage: Story = {
  args: {
    page: "settled",
  },
  parameters: {
    nextjs: {
      router: {
        pathname: "/settled",
      },
    },
  },
};
