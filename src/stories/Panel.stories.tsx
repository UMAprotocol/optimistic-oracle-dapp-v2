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

export const EmptyContent: Story = {
  args: defaultArgs,
  render: (args) => (
    <PanelContext.Provider value={{ ...args }}>
      <Panel />
    </PanelContext.Provider>
  ),
};
