import { Header } from "@/components";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { Meta, StoryObj } from "@storybook/react";
import { WagmiConfig } from "wagmi";
import { chains } from "@/pages/_app";
import { mockWagmiClient } from "./mocks";

const meta: Meta<typeof Header> = {
  component: Header,
};

export default meta;

type Story = StoryObj<typeof Header>;

export const Default: Story = {
  render: () => <Header />,
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
