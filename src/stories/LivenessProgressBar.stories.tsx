import { LivenessProgressBar } from "@/components/LivenessProgressBar";
import { Meta, StoryObj } from "@storybook/react";
import { BigNumber } from "ethers";

const meta: Meta<typeof LivenessProgressBar> = {
  component: LivenessProgressBar,
};

export default meta;

type Story = StoryObj<typeof LivenessProgressBar>;

export const Default: Story = {
  args: {
    liveness: BigNumber.from(Math.floor(Date.now() / 1000) + 10_000),
  },
};
