import { LivenessProgressBar } from "@/components/LivenessProgressBar";
import type { Meta, StoryObj } from "@storybook/react";
import { mockDate } from "./mocks";

const meta: Meta<typeof LivenessProgressBar> = {
  component: LivenessProgressBar,
};

export default meta;

type Story = StoryObj<typeof LivenessProgressBar>;

export const WithHoursRemaining: Story = {
  args: {
    startTime: mockDate.getTime() - 10_000_000,
    endTime: mockDate.getTime() + 10_000_000,
  },
};

export const WithMinutesRemaining: Story = {
  args: {
    startTime: mockDate.getTime() - 1_000_000,
    endTime: mockDate.getTime() + 1_000_000,
  },
};

export const WithSecondsRemaining: Story = {
  args: {
    startTime: mockDate.getTime() - 10_000,
    endTime: mockDate.getTime() + 10_000,
  },
};

export const WithNoTimeRemaining: Story = {
  args: {
    startTime: mockDate.getTime() - 10_000,
    endTime: mockDate.getTime() - 1_000,
  },
};
