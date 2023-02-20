import { Pagination } from "@/components";
import { defaultResultsPerPage } from "@/constants";
import { expect } from "@storybook/jest";
import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, waitFor, within } from "@storybook/testing-library";
import { useState } from "react";

const meta: Meta<typeof Pagination> = {
  component: Pagination,
};

export default meta;

type Story = StoryObj<typeof Pagination>;

function Wrapper({ Component }: { Component: typeof Pagination }) {
  const entries = Array.from({ length: 100 }, (_, i) => i + 1).map((i) => ({
    id: i,
    name: `Entry ${i}`,
  }));

  const [entriesToShow, setEntriesToShow] = useState(
    entries.slice(0, defaultResultsPerPage)
  );

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
  render: () => <Wrapper Component={Pagination} />,
};

export const Default: Story = {
  ...Template,
};

export const TestInteractions: Story = {
  ...Template,
  play: async ({ canvasElement }) => {
    // use the parent element because the portal is outside the canvas (appended to body)
    const canvas = within(canvasElement.parentElement as HTMLElement);
    // cannot go to page 1 when already on page 1
    expect(canvas.getByText("1")).toBeDisabled();
    // with 100 entries, there should be 10 pages
    expect(canvas.getByText("10")).toBeInTheDocument();
    // there should be an ellipsis before the last page button
    expect(canvas.getByText("...")).toBeInTheDocument();
    // there should be 10 entries displayed
    expect(canvas.getAllByTestId("entry").length).toBe(10);
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
