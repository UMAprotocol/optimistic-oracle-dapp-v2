import { Filters } from "@/components";
import { useFilterAndSearch } from "@/hooks";
import type { Meta, StoryObj } from "@storybook/react";
import { verifyMockOracleQueryUIs } from "./mocks";

const meta: Meta<typeof Filters> = {
  component: Filters,
};

export default meta;

type Story = StoryObj<typeof Filters>;

function Wrapper() {
  const { results, searchProps, filterProps } = useFilterAndSearch(
    verifyMockOracleQueryUIs()
  );

  return (
    <div>
      <Filters {...filterProps} {...searchProps} />
      <div>{JSON.stringify(results)}</div>
    </div>
  );
}

export const Default: Story = {
  render: () => <Wrapper />,
};
