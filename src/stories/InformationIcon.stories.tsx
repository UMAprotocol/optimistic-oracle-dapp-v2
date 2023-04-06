import { InformationIcon } from "@/components";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  component: InformationIcon,
  decorators: [
    (Story) => (
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p>This is some text that warrants further explanation</p>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof InformationIcon>;

export const Default: Story = {
  args: {
    content: "This is some information",
  },
};
