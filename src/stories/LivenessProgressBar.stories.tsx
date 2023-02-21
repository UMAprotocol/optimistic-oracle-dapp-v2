import { LivenessProgressBar } from "@/components/LivenessProgressBar";
import type { Meta, StoryObj } from "@storybook/react";
import { deterministicDate } from "./mocks";

const meta: Meta<typeof LivenessProgressBar> = {
  component: LivenessProgressBar,
};

export default meta;

type Story = StoryObj<typeof LivenessProgressBar>;

export const WithHoursRemaining: Story = {
  args: {
    startTime: deterministicDate - 10_000_000,
    endTime: deterministicDate + 10_000_000,
  },
};

export const WithMinutesRemaining: Story = {
  args: {
    startTime: deterministicDate - 1_000_000,
    endTime: deterministicDate + 1_000_000,
  },
};

export const WithSecondsRemaining: Story = {
  args: {
    startTime: deterministicDate - 10_000,
    endTime: deterministicDate + 10_000,
  },
};

export const WithNoTimeRemaining: Story = {
  args: {
    startTime: deterministicDate - 10_000,
    endTime: deterministicDate - 1_000,
  },
};
