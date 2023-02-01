import { LivenessProgressBar } from "@/components/LivenessProgressBar";
import { Meta, StoryObj } from "@storybook/react";
import { BigNumber } from "ethers";

const meta: Meta<typeof LivenessProgressBar> = {
  component: LivenessProgressBar,
};

export default meta;

type Story = StoryObj<typeof LivenessProgressBar>;

export const WithHoursRemaining: Story = {
  args: {
    startTime: BigNumber.from(Math.floor(Date.now() / 1000) - 10_000),
    endTime: BigNumber.from(Math.floor(Date.now() / 1000) + 10_000),
  },
};

export const WithMinutesRemaining: Story = {
  args: {
    startTime: BigNumber.from(Math.floor(Date.now() / 1000) - 1000),
    endTime: BigNumber.from(Math.floor(Date.now() / 1000) + 1000),
  },
};

export const WithSecondsRemaining: Story = {
  args: {
    startTime: BigNumber.from(Math.floor(Date.now() / 1000) - 10),
    endTime: BigNumber.from(Math.floor(Date.now() / 1000) + 10),
  },
};
