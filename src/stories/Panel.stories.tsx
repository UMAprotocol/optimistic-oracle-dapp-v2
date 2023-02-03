import { Panel } from "@/components";
import {
  defaultPanelContextState,
  PanelContext,
  PanelContextState,
} from "@/contexts";
import { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Panel> = {
  component: Panel,
};

export default meta;

type Story = StoryObj<PanelContextState>;

const defaultArgs = {
  ...defaultPanelContextState,
  panelOpen: true,
};

export const Verify: Story = {
  args: {
    ...defaultArgs,
    page: "verify",
    content: {
      project: "uma",
      title:
        "More than 2.5 million people traveled through a TSA checkpoint on any day by December 31, 2022",
    },
  },
  render: (args) => (
    <PanelContext.Provider value={{ ...args }}>
      <Panel />
    </PanelContext.Provider>
  ),
};
