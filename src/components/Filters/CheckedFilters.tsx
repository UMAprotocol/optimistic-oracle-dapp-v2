import { Button, CloseButton } from "@/components";
import type { Filter, Filters } from "@/types";
import { Fragment } from "react";
import styled from "styled-components";

interface Props {
  filters: Filters;
  uncheckFilter: (filter: Filter, itemName: string) => void;
  resetCheckedFilters: () => void;
}
/**
 * Determines which filters are checked and shows them.
 * @param filters The filters.
 * @param uncheckFilter Unchecks a filter.
 * @param resetCheckedFilters Resets all checked filters.
 */
export function CheckedFilters({
  filters,
  uncheckFilter,
  resetCheckedFilters,
}: Props) {
  const checkedFilters = Object.entries(filters).map(([filter, checked]) => ({
    filter: filter as Filter,
    checked: Object.entries(checked)
      .filter(([_, { checked }]) => checked)
      .map(([name]) => name)
      .filter((name) => name !== "All"),
  }));

  const hasCheckedFilters = checkedFilters.some(
    ({ checked }) => checked.length > 0
  );

  return (
    <Wrapper>
      {checkedFilters.map(({ filter, checked }) => (
        <Fragment key={filter}>
          {checked.map((name) => (
            <CheckedFilter key={name}>
              {name}
              <CloseButton
                onClick={() => uncheckFilter(filter, name)}
                size={10}
                variant="dark"
                ariaLabel="remove filter"
              />
            </CheckedFilter>
          ))}
        </Fragment>
      ))}
      {hasCheckedFilters && (
        <Button
          variant="secondary"
          onClick={resetCheckedFilters}
          width={100}
          height={30}
          fontSize={14}
        >
          Clear filters
        </Button>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  gap: 8px;
`;

const CheckedFilter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 112px;
  height: 32px;
  padding-inline: 8px;
  background: var(--grey-400);
  border-radius: 4px;
  font: var(--body-xs);
  color: var(--dark-text);
  font-size: 14px;
`;
