import { LivenessProgressBar } from "@/components/LivenessProgressBar";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof LivenessProgressBar> = {
  component: LivenessProgressBar,
};

export default meta;

type Story = StoryObj<typeof LivenessProgressBar>;

export const WithHoursRemaining: Story = {
  args: {
    startTime: Date.now() - 10_000_000,
    endTime: Date.now() + 10_000_000,
  },
};

export const WithMinutesRemaining: Story = {
  args: {
    startTime: Date.now() - 1_000_000,
    endTime: Date.now() + 1_000_000,
  },
};

export const WithSecondsRemaining: Story = {
  args: {
    startTime: Date.now() - 10_000,
    endTime: Date.now() + 10_000,
  },
};

export const WithNoTimeRemaining: Story = {
  args: {
    startTime: Date.now() - 10_000,
    endTime: Date.now() - 1_000,
  },
};
