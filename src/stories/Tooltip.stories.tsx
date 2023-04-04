import { Tooltip } from "@/components";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Tooltip> = {
  component: Tooltip,
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

const Template: Story = {
  render: function Render({ children, content }) {
    const _children = children ?? "show tooltip";
    return <Tooltip content={content}>{_children}</Tooltip>;
  },
};

export const Default: Story = {
  ...Template,
  args: {
    content: "tooltip content",
  },
};
