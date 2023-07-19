import { Pagination, usePagination } from "@/components";
import { expect } from "@storybook/jest";
import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, waitFor, within } from "@storybook/testing-library";

const meta: Meta<typeof Pagination> = {
  component: Pagination,
};

export default meta;

type Args = {
  numberOfEntries: number;
};

type Story = StoryObj<Args>;

function makeMockEntries(length: number) {
  return Array.from({ length }, (_, i) => i + 1).map((i) => ({
    id: i,
    name: `Entry ${i}`,
  }));
}

function Wrapper({ entries }: { entries: ReturnType<typeof makeMockEntries> }) {
  const { entriesToShow, ...paginationProps } = usePagination(entries);

  return (
    <div>
      {entriesToShow.map((entry) => (
        <p key={entry.id} data-testid="entry">
          {entry.name}
        </p>
      ))}
      <br />
      <Pagination {...paginationProps} />
    </div>
  );
}

const Template: Story = {
  render: ({ numberOfEntries }) => (
    <Wrapper entries={makeMockEntries(numberOfEntries)} />
  ),
};

export const EvenNumberOfEntries: Story = {
  ...Template,
  args: {
    numberOfEntries: 100,
  },
};

export const OddNumberOfEntries: Story = {
  ...Template,
  args: {
    numberOfEntries: 101,
  },
};

export const TestInteractions: Story = {
  ...Template,
  args: {
    numberOfEntries: 100,
  },
  play: async ({ canvasElement }) => {
    // use the parent element because the portal is outside the canvas (appended to body)
    const canvas = within(canvasElement.parentElement!);
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
    numberOfEntries: 101,
  },
  play: async ({ canvasElement }) => {
    // use the parent element because the portal is outside the canvas (appended to body)
    const canvas = within(canvasElement.parentElement!);
    const pageNumberButtons = () =>
      Array.from(canvas.getByTestId("page-buttons").children)
        .filter((child) => {
          const _child = child as HTMLElement;
          return !!_child.innerText && !isNaN(Number(_child.innerText));
        })
        .map((child) => child as HTMLElement);
    const resultsPerPageDropdown = canvas.getByTestId("results-per-page");
    const resultsPerPageDropdownButton = within(
      resultsPerPageDropdown,
    ).getByRole("button");
    await waitFor(() => userEvent.click(resultsPerPageDropdownButton));
    const resultsPerPage50 = canvas.getByText("50 results");
    await waitFor(() => userEvent.click(resultsPerPage50));
    let lastButton = pageNumberButtons()[pageNumberButtons().length - 1];
    await waitFor(() => userEvent.click(lastButton));
    // when we go to the last page with 50 results per page and there are 101 entries,
    // the last entry (number 101) should be on the last page
    // in this case, the first item and the last item are the same
    expect(canvas.getByText("Entry 101")).toBeInTheDocument();
    await waitFor(() => userEvent.click(resultsPerPageDropdownButton));
    const resultsPerPage10 = canvas.getByText("10 results");
    await waitFor(() => userEvent.click(resultsPerPage10));
    // when we go back to 10 results per page, the last entry should be on the 11th page
    expect(canvas.getByText("Entry 101")).toBeInTheDocument();
    // and the last page number button should be selected
    lastButton = pageNumberButtons()[pageNumberButtons().length - 1];
    expect(lastButton).toHaveStyle({ color: "rgb(255, 255, 255)" });
  },
};

export const EvenNumberOfEntriesRegressionTest: Story = {
  ...Template,
  args: {
    numberOfEntries: 100,
  },
  play: async ({ canvasElement }) => {
    // use the parent element because the portal is outside the canvas (appended to body)
    const canvas = within(canvasElement.parentElement!);
    const pageNumberButtons = () =>
      Array.from(canvas.getByTestId("page-buttons").children)
        .filter((child) => {
          const _child = child as HTMLElement;
          return !!_child.innerText && !isNaN(Number(_child.innerText));
        })
        .map((child) => child as HTMLElement);
    const resultsPerPageDropdown = canvas.getByTestId("results-per-page");
    const resultsPerPageDropdownButton = within(
      resultsPerPageDropdown,
    ).getByRole("button");
    await waitFor(() => userEvent.click(resultsPerPageDropdownButton));
    const resultsPerPage50 = canvas.getByText("50 results");
    await waitFor(() => userEvent.click(resultsPerPage50));
    const lastButton = pageNumberButtons()[pageNumberButtons().length - 1];
    await waitFor(() => userEvent.click(lastButton));
    // when we go to the last page with 50 results per page and there are 100 entries,
    // the last entry (number 100) should be on the last page
    // in this case, the first item and the last item are different
    let items = canvas.getAllByTestId("entry");
    // the first item should be item 51
    expect(items[0]).toHaveTextContent("Entry 51");
    // the last item should be item 100
    expect(items[items.length - 1]).toHaveTextContent("Entry 100");
    await waitFor(() => userEvent.click(resultsPerPageDropdownButton));
    const resultsPerPage10 = canvas.getByText("10 results");
    await waitFor(() => userEvent.click(resultsPerPage10));
    // the first item from when there were 50 results per page should still be the first item when there are 10 results per page
    items = canvas.getAllByTestId("entry");
    expect(items[0]).toHaveTextContent("Entry 51");
  },
};
