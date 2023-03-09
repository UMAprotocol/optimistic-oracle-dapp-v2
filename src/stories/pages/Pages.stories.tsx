import { Panel } from "@/components";
import { ErrorProvider, OracleDataProvider, PanelProvider } from "@/contexts";
import { parseEtherSafe } from "@/helpers";
import VerifyPage from "@/pages";
import ProposePage from "@/pages/propose";
import SettledPage from "@/pages/settled";
import type { ErrorMessage } from "@/types";
import type { Meta, StoryObj } from "@storybook/react";
import { BigNumber } from "ethers";
import {
  makeGraphqlHandlers,
  makeMockAssertions,
  makeMockRequests,
  makeMockRouterPathname,
  makeUnixTimestamp,
} from "../mocks";

const meta: Meta = {
  title: "Pages",
};

export default meta;

type Page = typeof VerifyPage | typeof ProposePage | typeof SettledPage;

type Story = StoryObj<{
  Component: Page;
  errorMessages: ErrorMessage[];
}>;

interface Props {
  Component: Page;
}
function Wrapper({ Component }: Props) {
  return (
    <OracleDataProvider>
      <ErrorProvider>
        <PanelProvider>
          <Component />
          <Panel />
        </PanelProvider>
      </ErrorProvider>
    </OracleDataProvider>
  );
}

const Template: Story = {
  render: (args) => <Wrapper {...args} />,
};

/**
 * Price requests are shown on the verify page in the following cases:
 *
 * 1. The request is in the `state` of `Proposed` which has the `ActionType` of `dispute`.
 *
 * 2. The request is in the `state` of `Disputed` or `Expired` which both have the `ActionType` of `settle`.
 *
 * Assertions are shown on the verify page in the following cases:
 *
 * 1. the assertion has no `settlementHash` and the `expirationTime` is in the _future_, which means it has the `ActionType` of `settle`.
 *
 * 1. the assertion has no `settlementHash` and the `expirationTime` is in the _past_, which means it has the `ActionType` of `dispute`.
 */
const VerifyTemplate: Story = {
  ...Template,
  parameters: {
    nextjs: makeMockRouterPathname(),
    msw: {
      handlers: makeGraphqlHandlers({
        v1: {
          Ethereum: makeMockRequests({
            inputs: [
              {
                identifier: "TEST_OO_V1",
                state: "Proposed",
                proposedPrice: BigNumber.from(parseEtherSafe("123")),
              },
              {
                identifier: "TEST_OO_V1",
                state: "Disputed",
                proposedPrice: BigNumber.from(parseEtherSafe("123")),
              },
            ],
          }),
        },
        v2: {
          Ethereum: makeMockRequests({
            inputs: [
              {
                identifier: "TEST_OO_V2",
                state: "Proposed",
                proposedPrice: BigNumber.from(parseEtherSafe("456")),
              },
              {
                identifier: "TEST_OO_V2",
                state: "Disputed",
                proposedPrice: BigNumber.from(parseEtherSafe("456")),
              },
            ],
          }),
        },
        v3: {
          Ethereum: makeMockAssertions({
            inputs: [
              {
                settlementHash: undefined,
                expirationTime: makeUnixTimestamp("future", { days: 1 }),
              },
              {
                settlementHash: undefined,
                expirationTime: makeUnixTimestamp("past", { days: 1 }),
              },
            ],
          }),
        },
      }),
    },
  },
};

/**
 * The only queries that show up on the propose page are the ones that are in `state` of `Requested`, which also means they have an `ActionType` of `propose`.
 *
 * Assertions are never shown on the propose page.
 */
const ProposeTemplate: Story = {
  ...Template,
  parameters: {
    nextjs: makeMockRouterPathname("/propose"),
    msw: {
      handlers: makeGraphqlHandlers({
        v1: {
          Ethereum: makeMockRequests({
            inputs: [{ state: "Requested" }],
          }),
        },
        v2: {
          Ethereum: makeMockRequests({
            inputs: [{ state: "Requested" }],
          }),
        },
        v3: {
          Ethereum: makeMockAssertions({
            count: 1,
          }),
        },
      }),
    },
  },
};

/**
 * Queries should end up on the settled page when they have no action type
 * TODO: We might need to tighten this up later
 */
const SettledTemplate: Story = {
  ...Template,
  parameters: {
    nextjs: makeMockRouterPathname("/settled"),
    msw: {
      handlers: makeGraphqlHandlers({
        v1: {
          Ethereum: makeMockRequests({
            inputs: [
              {
                state: "Settled",
                settlementPrice: BigNumber.from(parseEtherSafe("123")),
              },
            ],
          }),
          Arbitrum: makeMockRequests({
            inputs: [
              {
                state: "Settled",
                settlementPrice: BigNumber.from(parseEtherSafe("123")),
              },
            ],
          }),
        },
        v2: {
          Ethereum: makeMockRequests({
            inputs: [
              {
                state: "Settled",
                settlementPrice: BigNumber.from(parseEtherSafe("123")),
              },
            ],
          }),
          Arbitrum: makeMockRequests({
            inputs: [
              {
                state: "Settled",
                settlementPrice: BigNumber.from(parseEtherSafe("123")),
              },
            ],
          }),
        },
        v3: {
          Ethereum: makeMockAssertions({
            inputs: [
              { settlementHash: "0x123", settlementResolution: "false" },
            ],
          }),
        },
      }),
    },
  },
};

export const Verify: Story = {
  ...VerifyTemplate,
  args: {
    Component: VerifyPage,
  },
};

export const VerifyLoading: Story = {
  ...VerifyTemplate,
  args: {
    Component: VerifyPage,
  },
};

export const VerifyError: Story = {
  ...VerifyTemplate,
  args: {
    Component: VerifyPage,
  },
};

export const Propose: Story = {
  ...ProposeTemplate,
  args: {
    Component: ProposePage,
  },
};

export const ProposeLoading: Story = {
  ...ProposeTemplate,
  args: {
    Component: ProposePage,
  },
};

export const ProposeError: Story = {
  ...ProposeTemplate,
  args: {
    Component: ProposePage,
  },
};

export const Settled: Story = {
  ...SettledTemplate,
  args: {
    Component: SettledPage,
  },
};

export const SettledLoading: Story = {
  ...SettledTemplate,
  args: {
    Component: SettledPage,
  },
};

export const SettledError: Story = {
  ...SettledTemplate,
  args: {
    Component: SettledPage,
  },
};
