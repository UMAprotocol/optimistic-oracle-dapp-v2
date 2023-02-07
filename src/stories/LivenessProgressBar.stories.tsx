import { LivenessProgressBar } from "@/components/LivenessProgressBar";
import { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof LivenessProgressBar> = {
  component: LivenessProgressBar,
};

export default meta;

type Story = StoryObj<typeof LivenessProgressBar>;

export const WithHoursRemaining: Story = {
  args: {
    startTime: Math.floor(Date.now() / 1000) - 10_000,
    endTime: Math.floor(Date.now() / 1000) + 10_000,
  },
};

export const WithMinutesRemaining: Story = {
  args: {
    startTime: Math.floor(Date.now() / 1000) - 1000,
    endTime: Math.floor(Date.now() / 1000) + 1000,
  },
};

export const WithSecondsRemaining: Story = {
  args: {
    startTime: Math.floor(Date.now() / 1000) - 10,
    endTime: Math.floor(Date.now() / 1000) + 10,
  },
};
