import { Button, Tooltip } from "@/components";
import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, waitFor, within } from "@storybook/testing-library";
import Uma from "public/assets/logo.svg";

const meta: Meta<typeof Tooltip> = {
  component: Tooltip,
  decorators: [
    (Story) => (
      <div
        style={{
          width: "100vh",
          height: "200vh",
          display: "grid",
          padding: "100px",
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
  play: async ({ canvasElement }) => {
    // use the parent element because the portal is outside the canvas (appended to body)
    const canvas = within(canvasElement.parentElement as HTMLElement);
    const tooltip = (await canvas.findByTestId("tooltip")).children[0];
    await waitFor(() => userEvent.hover(tooltip));
  },
};

export const Default: Story = {
  ...Template,
  args: {
    children: "show tooltip",
    content: "tooltip content",
  },
};

export const DisabledButton: Story = {
  ...Template,
  args: {
    children: (
      <Button disabled variant="primary">
        show tooltip
      </Button>
    ),
    content: "tooltip content",
  },
};

export const ComplexContent: Story = {
  ...Template,
  args: {
    children: "show tooltip",
    content: (
      <div>
        <h1>tooltip content</h1>
        <p>with multiple lines</p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque
          asperiores dolorem voluptates quam quia. Officia molestiae harum
          adipisci animi. Numquam tempore mollitia, facere sint quidem quaerat,
          doloribus qui quam molestiae nisi eveniet illo reiciendis vero,
          suscipit dolor amet alias tenetur architecto libero? Natus nam esse
          eum pariatur delectus inventore ab?
        </p>
        <Uma />
      </div>
    ),
  },
};
