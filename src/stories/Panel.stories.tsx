import { Button, Panel } from "@/components";
import { PanelContext, PanelContextState } from "@/contexts";
import { OracleQueryUI, Page } from "@/types";
import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { makeMockOracleQueryUI } from "./mocks";

const meta: Meta<typeof Panel> = {
  component: Panel,
};

export default meta;

type Story = StoryObj<PanelContextState>;

interface Props {
  Component: typeof Panel;
  page: Page | undefined;
  content: OracleQueryUI | undefined;
}
function Wrapper({ Component, page, content }: Props) {
  const [panelOpen, setPanelOpen] = useState(true);
  const [error, setError] = useState(content?.error ?? "");

  if (!content) return null;

  return (
    <PanelContext.Provider
      value={{
        page,
        panelOpen,
        openPanel: () => setPanelOpen(true),
        closePanel: () => setPanelOpen(false),
        content: {
          ...content,
          error,
          setError,
        },
      }}
    >
      <Button variant="primary" onClick={() => setPanelOpen(true)}>
        Open panel
      </Button>
      <Component />
    </PanelContext.Provider>
  );
}

const Template: Story = {
  render: (args) => <Wrapper Component={Panel} {...args} />,
};

export const VerifyWithDispute: Story = {
  ...Template,
  args: {
    page: "verify",
    content: makeMockOracleQueryUI({
      actionType: "Dispute",
      action: () => alert("Dispute!!!"),
    }),
  },
};

export const VerifyWithSettle: Story = {
  ...Template,
  args: {
    page: "verify",
    content: makeMockOracleQueryUI({
      actionType: "Settle",
      action: () => alert("Settle!!!"),
    }),
  },
};

export const Propose: Story = {
  ...Template,
  args: {
    page: "propose",
    content: makeMockOracleQueryUI({
      actionType: "Propose",
      action: () => alert("Propose!!!"),
    }),
  },
};

export const Settled: Story = {
  ...Template,
  args: {
    page: "settled",
    content: makeMockOracleQueryUI({
      action: undefined,
      actionType: undefined,
    }),
  },
};

export const WithError: Story = {
  ...Template,
  args: {
    page: "verify",
    content: makeMockOracleQueryUI({
      error: "Something went wrong",
    }),
  },
};

export const WithDifferentProject: Story = {
  ...Template,
  args: {
    page: "verify",
    content: makeMockOracleQueryUI({
      project: "Polymarket",
    }),
  },
};

export const WithDifferentInfoIcons: Story = {
  ...Template,
  args: {
    page: "verify",
    content: makeMockOracleQueryUI({
      oracleType: "Skinny Optimistic Oracle",
      chainId: 137,
      expiryType: "Time-based",
    }),
  },
};

export const WithDifferentCurrency: Story = {
  ...Template,
  args: {
    page: "verify",
    content: makeMockOracleQueryUI({
      currency: "ETH",
    }),
  },
};

export const WithPrice: Story = {
  ...Template,
  args: {
    page: "verify",
    content: makeMockOracleQueryUI({
      oracleType: "Optimistic Oracle",
      price: 200,
      assertion: undefined,
    }),
  },
};
