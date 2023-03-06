import { Panel } from "@/components";
import { ErrorProvider, OracleDataProvider, PanelProvider } from "@/contexts";
import VerifyPage from "@/pages";
import ProposePage from "@/pages/propose";
import SettledPage from "@/pages/settled";
import type { ErrorMessage } from "@/types";
import type { Meta, StoryObj } from "@storybook/react";
import {
  makeMockAssertions,
  makeMockRequests,
  makeMockRouterPathname,
  makeRequestHandlerForOraclesAndChains,
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

const VerifyTemplate: Story = {
  ...Template,
  parameters: {
    nextjs: makeMockRouterPathname(),
    msw: {
      handlers: makeRequestHandlerForOraclesAndChains([
        {
          version: 2,
          chainId: 1,
          requests: makeMockRequests(),
        },
        {
          version: 3,
          chainId: 5,
          assertions: makeMockAssertions(),
        },
      ]),
    },
  },
};

const ProposeTemplate: Story = {
  ...Template,
  parameters: {
    nextjs: makeMockRouterPathname("/propose"),
    msw: {
      handlers: makeRequestHandlerForOraclesAndChains([
        {
          version: 2,
          chainId: 1,
          requests: makeMockRequests(),
        },
        {
          version: 3,
          chainId: 5,
          assertions: makeMockAssertions(),
        },
      ]),
    },
  },
};

const SettledTemplate: Story = {
  ...Template,
  parameters: {
    nextjs: makeMockRouterPathname("/settled"),
    msw: {
      handlers: makeRequestHandlerForOraclesAndChains([
        {
          version: 2,
          chainId: 1,
          requests: makeMockRequests(),
        },
        {
          version: 3,
          chainId: 5,
          assertions: makeMockAssertions(),
        },
      ]),
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
