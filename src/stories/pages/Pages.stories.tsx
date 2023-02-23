import {
  defaultErrorContextState,
  defaultOracleDataContextState,
  ErrorContext,
  OracleDataContext,
} from "@/contexts";
import VerifyPage from "@/pages";
import ProposePage from "@/pages/propose";
import SettledPage from "@/pages/settled";
import type { ErrorMessage, OracleQueryUI } from "@/types";
import type { Meta, StoryObj } from "@storybook/react";
import {
  proposeMockOracleQueryUIs,
  settledMockOracleQueryUIs,
  verifyMockOracleQueryUIs,
} from "../mocks";

const meta: Meta = {
  title: "Pages",
};

export default meta;

type Page = typeof VerifyPage | typeof ProposePage | typeof SettledPage;

type Story = StoryObj<{
  Component: Page;
  verify: OracleQueryUI[];
  propose: OracleQueryUI[];
  settled: OracleQueryUI[];
  errorMessages: ErrorMessage[];
}>;

interface Props {
  Component: Page;
  verify?: OracleQueryUI[];
  propose?: OracleQueryUI[];
  settled?: OracleQueryUI[];
  errorMessages?: ErrorMessage[];
}
function Wrapper({
  Component,
  verify,
  propose,
  settled,
  errorMessages = [],
}: Props) {
  const mockOracleContextState = {
    ...defaultOracleDataContextState,
    verify,
    propose,
    settled,
  };
  const mockErrorContextState = {
    ...defaultErrorContextState,
    errorMessages,
  };
  return (
    <OracleDataContext.Provider value={mockOracleContextState}>
      <ErrorContext.Provider value={mockErrorContextState}>
        <Component />
      </ErrorContext.Provider>
    </OracleDataContext.Provider>
  );
}

const Template: Story = {
  render: (args) => <Wrapper {...args} />,
};

const VerifyTemplate: Story = {
  ...Template,
  parameters: {
    nextjs: {
      router: {
        pathname: "/",
      },
    },
  },
};

const ProposeTemplate: Story = {
  ...Template,
  parameters: {
    nextjs: {
      router: {
        pathname: "/propose",
      },
    },
  },
};

const SettledTemplate: Story = {
  ...Template,
  parameters: {
    nextjs: {
      router: {
        pathname: "/settled",
      },
    },
  },
};

export const Verify: Story = {
  ...VerifyTemplate,
  args: {
    Component: VerifyPage,
    verify: verifyMockOracleQueryUIs(),
  },
};

export const VerifyLoading: Story = {
  ...VerifyTemplate,
  args: {
    Component: VerifyPage,
    verify: undefined,
  },
};

export const VerifyError: Story = {
  ...VerifyTemplate,
  args: {
    Component: VerifyPage,
    verify: verifyMockOracleQueryUIs(5),
    errorMessages: [
      {
        text: "Error in verify page",
        link: {
          text: "Try again",
          href: "https://error.com",
        },
      },
    ],
  },
};

export const Propose: Story = {
  ...ProposeTemplate,
  args: {
    Component: ProposePage,
    propose: proposeMockOracleQueryUIs(100),
  },
};

export const ProposeLoading: Story = {
  ...ProposeTemplate,
  args: {
    Component: ProposePage,
    propose: undefined,
  },
};

export const ProposeError: Story = {
  ...ProposeTemplate,
  args: {
    Component: ProposePage,
    propose: proposeMockOracleQueryUIs(100),
    errorMessages: [
      {
        text: "Error in propose page",
        link: {
          text: "Try again",
          href: "https://error.com",
        },
      },
    ],
  },
};

export const Settled: Story = {
  ...SettledTemplate,
  args: {
    Component: SettledPage,
    settled: settledMockOracleQueryUIs(100),
  },
};

export const SettledLoading: Story = {
  ...SettledTemplate,
  args: {
    Component: SettledPage,
    settled: undefined,
  },
};

export const SettledError: Story = {
  ...SettledTemplate,
  args: {
    Component: SettledPage,
    settled: settledMockOracleQueryUIs(100),
    errorMessages: [
      {
        text: "Error in settled page",
        link: {
          text: "Try again",
          href: "https://error.com",
        },
      },
    ],
  },
};
