import { Tooltip } from "@/components";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Tooltip> = {
  component: Tooltip,
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

const Template: Story = {
  render: ({ children, content }) => (
    <Tooltip content={content}>{children}</Tooltip>
  ),
};

export const Default: Story = {
  ...Template,
  args: {
    children: "show tooltip",
    content: "tooltip content",
  },
};
