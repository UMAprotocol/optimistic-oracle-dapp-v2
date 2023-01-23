import { VoteTicker } from "@/components";
import { defaultApy } from "@/constants";
import type { Meta, StoryObj } from "@storybook/react";
import { rest } from "msw";

const meta: Meta<typeof VoteTicker> = {
  component: VoteTicker,
};

export default meta;

type Story = StoryObj<typeof VoteTicker>;

export const NoVotes: Story = {
  render: () => <VoteTicker />,
  parameters: {
    msw: {
      handlers: [
        rest.get("/api/get-voting-info", (_req, res, ctx) => {
          return res(
            ctx.json({
              apy: defaultApy,
              activeRequests: 2,
              phase: "commit",
            })
          );
        }),
      ],
    },
  },
};
