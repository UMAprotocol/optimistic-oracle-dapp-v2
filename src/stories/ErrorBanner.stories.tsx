import { Button, ErrorBanner } from "@/components";
import type { ErrorContextState } from "@/contexts";
import { ErrorContext } from "@/contexts";
import { parseEthersError } from "@/helpers";
import type { ErrorMessage } from "@shared/types";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import styled from "styled-components";

const meta: Meta<typeof ErrorBanner> = {
  component: ErrorBanner,
};

export default meta;

type Story = StoryObj<ErrorContextState>;

interface Props {
  Component: typeof ErrorBanner;
  errorMessages?: ErrorContextState["errorMessages"];
}
function Wrapper({ Component, errorMessages }: Props) {
  const [_errorMessages, _setErrorMessages] = useState(errorMessages ?? []);

  const [errorMessageTextInput, setErrorMessageTextInput] = useState("");
  const [errorMessageLinkTextInput, setErrorMessageLinkTextInput] =
    useState("");
  const [errorMessageLinkHrefInput, setErrorMessageLinkHrefInput] =
    useState("");
  const [removeErrorMessageTextInput, setRemoveErrorMessageTextInput] =
    useState("");

  function addErrorMessage(errorMessage: ErrorMessage) {
    if (errorMessage.text === "") return;
    _setErrorMessages([..._errorMessages, errorMessage]);
  }

  function removeErrorMessage(errorMessage: ErrorMessage) {
    _setErrorMessages(
      _errorMessages.filter(({ text }) => text !== errorMessage.text)
    );
  }

  function clearErrorMessages() {
    _setErrorMessages([]);
  }
  return (
    <ErrorContext.Provider
      value={{
        errorMessages: _errorMessages,
        addErrorMessage,
        removeErrorMessage,
        clearErrorMessages,
      }}
    >
      <Component />
      <InputWrapper>
        <Input
          type="text"
          onChange={(e) => setErrorMessageTextInput(e.currentTarget.value)}
          value={errorMessageTextInput}
          placeholder="Error message text"
        />
        <Input
          type="text"
          onChange={(e) => setErrorMessageLinkTextInput(e.currentTarget.value)}
          value={errorMessageLinkTextInput}
          placeholder="Error message link text"
        />
        <Input
          type="text"
          onChange={(e) => setErrorMessageLinkHrefInput(e.currentTarget.value)}
          value={errorMessageLinkHrefInput}
          placeholder="Error message link href"
        />
        <Button
          variant="primary"
          onClick={() => {
            addErrorMessage({
              text: errorMessageTextInput,
              link:
                errorMessageTextInput && errorMessageLinkHrefInput
                  ? {
                      text: errorMessageLinkTextInput,
                      href: errorMessageLinkHrefInput,
                    }
                  : undefined,
            });
            setErrorMessageTextInput("");
            setErrorMessageLinkTextInput("");
          }}
        >
          Add error message
        </Button>
      </InputWrapper>
      <InputWrapper>
        <Input
          type="text"
          onChange={(e) =>
            setRemoveErrorMessageTextInput(e.currentTarget.value)
          }
          value={removeErrorMessageTextInput}
          placeholder="Error message text"
        />
        <Button
          variant="primary"
          onClick={() => {
            removeErrorMessage({ text: removeErrorMessageTextInput });
            setRemoveErrorMessageTextInput("");
          }}
        >
          Remove error message
        </Button>
      </InputWrapper>
      <Button
        variant="primary"
        onClick={() => {
          clearErrorMessages();
        }}
      >
        Clear error messages
      </Button>
    </ErrorContext.Provider>
  );
}

const Template: Story = {
  render: (args) => <Wrapper Component={ErrorBanner} {...args} />,
};

export const NoMessages: Story = {
  ...Template,
};

export const OneErrorMessage: Story = {
  ...Template,
  args: {
    errorMessages: [
      {
        text: "This is an error message",
        link: {
          text: "This is a link",
          href: "https://google.com",
        },
      },
    ],
  },
};

export const MultipleErrorMessages: Story = {
  ...Template,
  args: {
    errorMessages: [
      {
        text: "This is an error message",
        link: {
          text: "This is a link",
          href: "https://google.com",
        },
      },
      {
        text: "This is another error message",
        link: {
          text: "This is another link",
          href: "https://google.com",
        },
      },
    ],
  },
};

export const MultipleOfTheSameErrorMessage: Story = {
  ...Template,
  args: {
    errorMessages: [
      {
        text: "This is an error message",
        link: {
          text: "This is a link",
          href: "https://google.com",
        },
      },
      {
        text: "This is an error message",
        link: {
          text: "This is a link",
          href: "https://google.com",
        },
      },
    ],
  },
};

export const EthersErrorMessage: Story = {
  ...Template,
  args: {
    errorMessages: [
      parseEthersError(
        "Error: overflow [See: https://links.ethers.org/v5-errors-NUMERIC_FAULT-overflow]"
      ),
    ],
  },
};

const InputWrapper = styled.div`
  display: flex;
  gap: 32px;
  margin-block: 32px;
`;

const Input = styled.input`
  padding-inline: 8px;
  padding-block: 4px;
  border: 1px solid var(--blue-grey-700);
  border-radius: 4px;
`;
