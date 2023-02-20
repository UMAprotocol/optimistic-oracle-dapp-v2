import { OracleQueries, Panel } from "@/components";
import { PanelProvider } from "@/contexts";
import type { Meta, StoryObj } from "@storybook/react";
import {
  makeMockOracleQueryUIs,
  makeRandomTitle,
  proposeMockOracleQueryUIs,
  settledMockOracleQueryUIs,
  verifyMockOracleQueryUIs,
} from "./mocks";

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
    queries: proposeMockOracleQueryUIs,
  },
};

export const Verify: Story = {
  args: {
    page: "verify",
    queries: verifyMockOracleQueryUIs,
  },
};

export const Settled: Story = {
  args: {
    page: "settled",
    queries: settledMockOracleQueryUIs,
  },
};

export const WithPagination: Story = {
  args: {
    page: "propose",
    queries: makeMockOracleQueryUIs({
      count: 100,
      inputs: Array.from({ length: 100 }, () => ({
        title: makeRandomTitle(),
      })),
    }),
  },
};

export const ProposeLoading: Story = {
  args: {
    page: "propose",
    queries: [],
    isLoading: true,
  },
};

export const VerifyLoading: Story = {
  args: {
    page: "verify",
    queries: [],
    isLoading: true,
  },
};

export const SettledLoading: Story = {
  args: {
    page: "settled",
    queries: [],
    isLoading: true,
  },
};
