import { Pagination } from "@/components";
import { white } from "@/constants";
import { expect } from "@storybook/jest";
import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, waitFor, within } from "@storybook/testing-library";
import { useState } from "react";

const meta: Meta<typeof Pagination> = {
  component: Pagination,
};

export default meta;

type Args = {
  entries: ReturnType<typeof makeMockEntries>;
};

type Story = StoryObj<Args>;

function makeMockEntries(length: number) {
  return Array.from({ length }, (_, i) => i + 1).map((i) => ({
    id: i,
    name: `Entry ${i}`,
  }));
}

function Wrapper({
  Component,
  entries,
}: {
  Component: typeof Pagination;
  entries: ReturnType<typeof makeMockEntries>;
}) {
  const [entriesToShow, setEntriesToShow] = useState(entries);

  return (
    <div>
      {entriesToShow.map((entry) => (
        <p key={entry.id} data-testid="entry">
          {entry.name}
        </p>
      ))}
      <br />
      <Component entries={entries} setEntriesToShow={setEntriesToShow} />
    </div>
  );
}

const Template: Story = {
  render: ({ entries }) => <Wrapper Component={Pagination} entries={entries} />,
};

export const Default: Story = {
  ...Template,
  args: {
    entries: makeMockEntries(50),
  },
};

export const TestInteractions: Story = {
  ...Template,
  args: {
    entries: makeMockEntries(100),
  },
  play: async ({ canvasElement }) => {
    // use the parent element because the portal is outside the canvas (appended to body)
    const canvas = within(canvasElement.parentElement as HTMLElement);
    // cannot go to page 1 when already on page 1
    expect(canvas.getByText("1")).toBeDisabled();
    // with 100 entries, there should be 10 pages
    expect(canvas.getByText("10")).toBeInTheDocument();
    // there should be an ellipsis before the last page button
    expect(canvas.getByText("...")).toBeInTheDocument();
    const resultsPerPageDropdownButton = canvas.getByText("10 results");
    await waitFor(() => userEvent.click(resultsPerPageDropdownButton));
    const resultsPerPage20 = canvas.getByText("20 results");
    await waitFor(() => userEvent.click(resultsPerPage20));
    // there should be 20 entries
    expect(canvas.getAllByTestId("entry").length).toBe(20);
    await waitFor(() => userEvent.click(resultsPerPageDropdownButton));
    const resultsPerPage50 = canvas.getByText("50 results");
    await waitFor(() => userEvent.click(resultsPerPage50));
    // there should be 50 entries
    expect(canvas.getAllByTestId("entry").length).toBe(50);
  },
};

export const OddNumberOfEntriesRegressionTest: Story = {
  ...Template,
  args: {
    entries: makeMockEntries(101),
  },
  play: async ({ canvasElement }) => {
    // use the parent element because the portal is outside the canvas (appended to body)
    const canvas = within(canvasElement.parentElement as HTMLElement);
    const resultsPerPageDropdownButton = canvas.getByText("10 results");
    await waitFor(() => userEvent.click(resultsPerPageDropdownButton));
    const resultsPerPage50 = canvas.getByText("50 results");
    await waitFor(() => userEvent.click(resultsPerPage50));
    const lastButton = canvas.getByText("3");
    await waitFor(() => userEvent.click(lastButton));
    await waitFor(() => userEvent.click(resultsPerPageDropdownButton));
    const resultsPerPage10 = canvas.getByText("10 results");
    await waitFor(() => userEvent.click(resultsPerPage10));
    const lastButton11 = canvas.getByText("11");
    expect(lastButton11).toHaveStyle({ color: white });
  },
};
