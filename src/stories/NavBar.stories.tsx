import { NavBar } from "@/components";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { Meta, StoryObj } from "@storybook/react";
import { WagmiConfig } from "wagmi";
import { chains } from "@/pages/_app";
import { mockWagmiClient } from "./mocks";

const meta: Meta<typeof NavBar> = {
  component: NavBar,
};

export default meta;

type Story = StoryObj<typeof NavBar>;

export const Default: Story = {
  render: () => <NavBar />,
  decorators: [
    (Story) => (
      <WagmiConfig client={mockWagmiClient}>
        <RainbowKitProvider chains={chains}>
          <Story />
        </RainbowKitProvider>
      </WagmiConfig>
    ),
  ],
};
