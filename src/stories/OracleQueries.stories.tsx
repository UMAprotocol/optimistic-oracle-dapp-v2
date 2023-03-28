import { OracleQueries, Panel } from "@/components";
import { PanelProvider } from "@/contexts";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof OracleQueries> = {
  component: OracleQueries,
  decorators: [
    (Story) => (
      <PanelProvider>
        <Panel />
        <Story />
      </PanelProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof OracleQueries>;

export const Propose: Story = {
  args: {
    page: "propose",
  },
};

export const Verify: Story = {
  args: {
    page: "verify",
  },
};

export const Settled: Story = {
  args: {
    page: "settled",
  },
};

export const WithPagination: Story = {
  args: {
    page: "propose",
  },
};

export const ProposeLoading: Story = {
  args: {
    page: "propose",
  },
};

export const VerifyLoading: Story = {
  args: {
    page: "verify",
  },
};

export const SettledLoading: Story = {
  args: {
    page: "settled",
  },
};
