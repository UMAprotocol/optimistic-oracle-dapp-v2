import { OracleQueryTable, Panel } from "@/components";
import { PanelProvider } from "@/contexts";
import { Meta, StoryObj } from "@storybook/react";
import {
  makeMockOracleQueryUIs,
  makeRandomTitle,
  proposeMockOracleQueryUIs,
  settledMockOracleQueryUIs,
  verifyMockOracleQueryUIs,
} from "./mocks";

const meta: Meta<typeof OracleQueryTable> = {
  component: OracleQueryTable,
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

type Story = StoryObj<typeof OracleQueryTable>;

export const Propose: Story = {
  args: {
    page: "propose",
    rows: proposeMockOracleQueryUIs,
  },
};

export const Verify: Story = {
  args: {
    page: "verify",
    rows: verifyMockOracleQueryUIs,
  },
};

export const Settled: Story = {
  args: {
    page: "settled",
    rows: settledMockOracleQueryUIs,
  },
};

export const WithPagination: Story = {
  args: {
    page: "propose",
    rows: makeMockOracleQueryUIs({
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
    rows: [],
    isLoading: true,
  },
};

export const VerifyLoading: Story = {
  args: {
    page: "verify",
    rows: [],
    isLoading: true,
  },
};

export const SettledLoading: Story = {
  args: {
    page: "settled",
    rows: [],
    isLoading: true,
  },
};
