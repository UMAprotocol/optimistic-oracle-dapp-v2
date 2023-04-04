import { Tooltip } from "@/components";
import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, waitFor, within } from "@storybook/testing-library";

const meta: Meta<typeof Tooltip> = {
  component: Tooltip,
  decorators: [
    (Story) => (
      <div
        style={{
          width: "100vh",
          height: "100vh",
          display: "grid",
          placeItems: "center",
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

const Template: Story = {
  render: ({ children, content }) => (
    <div data-testid="tooltip">
      <Tooltip content={content}>{children}</Tooltip>
    </div>
  ),
};

export const Default: Story = {
  ...Template,
  args: {
    children: "show tooltip",
    content: "tooltip content",
  },
  play: async ({ canvasElement }) => {
    // use the parent element because the portal is outside the canvas (appended to body)
    const canvas = within(canvasElement.parentElement as HTMLElement);
    const tooltip = (await canvas.findByTestId("tooltip")).children[0];
    await waitFor(() => userEvent.hover(tooltip));
  },
};
