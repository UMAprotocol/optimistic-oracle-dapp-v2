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
    assertionTime: BigNumber.from(Math.floor(Date.now() / 1000) - 10_000),
    expirationTime: BigNumber.from(Math.floor(Date.now() / 1000) + 10_000),
  },
};

export const WithMinutesRemaining: Story = {
  args: {
    assertionTime: BigNumber.from(Math.floor(Date.now() / 1000) - 1000),
    expirationTime: BigNumber.from(Math.floor(Date.now() / 1000) + 1000),
  },
};

export const WithSecondsRemaining: Story = {
  args: {
    assertionTime: BigNumber.from(Math.floor(Date.now() / 1000) - 10),
    expirationTime: BigNumber.from(Math.floor(Date.now() / 1000) + 10),
  },
};
