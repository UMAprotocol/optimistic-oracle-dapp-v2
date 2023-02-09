import { Pagination } from "@/components";
import { defaultResultsPerPage } from "@/constants";
import { expect } from "@storybook/jest";
import { Meta, StoryObj } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";
import { useState } from "react";

const meta: Meta<typeof Pagination> = {
  component: Pagination,
};

export default meta;

type Story = StoryObj<typeof Pagination>;

function Wrapper({ Component }: { Component: typeof Pagination }) {
  const entries = Array.from({ length: 100 }, (_, i) => i + 1).map((i) => ({
    id: i,
    name: `Entry`,
  }));

  const [entriesToShow, setEntriesToShow] = useState(
    entries.slice(0, defaultResultsPerPage)
  );

  return (
    <div>
      {entriesToShow.map((entry) => (
        <p key={entry.id}>{entry.name}</p>
      ))}
      <br />
      <Component entries={entries} setEntriesToShow={setEntriesToShow} />
    </div>
  );
}

const Template: Story = {
  render: () => <Wrapper Component={Pagination} />,
};

export const Default: Story = {
  ...Template,
};

// Function to emulate pausing between interactions
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const ChangeResultsPerPage: Story = {
  ...Template,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.parentElement as HTMLElement);
    expect(canvas.queryAllByText("Entry").length).toBe(10);
    const resultsPerPage = canvas.getByText("10 results");
    userEvent.click(resultsPerPage);
    await sleep(1000);
    const resultsPerPage20 = canvas.getByText("20 results");
    userEvent.click(resultsPerPage20);
    await sleep(1000);
    expect(canvas.queryAllByText("Entry").length).toBe(20);
  },
};
