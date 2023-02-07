import { Table } from "@/components";
import { Meta, StoryObj } from "@storybook/react";
import { makeMockOracleQueryUI } from "./mocks";

const meta: Meta<typeof Table> = {
  component: Table,
};

export default meta;

type Story = StoryObj<typeof Table>;

export const Propose: Story = {
  args: {
    page: "propose",
    rows: [
      makeMockOracleQueryUI(),
      makeMockOracleQueryUI(),
      makeMockOracleQueryUI(),
    ],
  },
};

export const Verify: Story = {
  args: {
    page: "verify",
    rows: [
      makeMockOracleQueryUI(),
      makeMockOracleQueryUI(),
      makeMockOracleQueryUI(),
    ],
  },
};

export const Settled: Story = {
  args: {
    page: "settled",
    rows: [
      makeMockOracleQueryUI(),
      makeMockOracleQueryUI(),
      makeMockOracleQueryUI(),
    ],
  },
};
