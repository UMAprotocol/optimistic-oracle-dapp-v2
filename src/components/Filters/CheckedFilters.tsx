import { Button, CloseButton } from "@/components";
import type {
  CheckedFiltersByFilterName,
  FilterName,
  OnCheckedChange,
} from "@/types";
import { Fragment } from "react";
import styled from "styled-components";

interface Props {
  checkedFilters: CheckedFiltersByFilterName;
  onCheckedChange: OnCheckedChange;
  reset: () => void;
}

/**
 * Displays the checked filters
 * @param checkedFilters - The checked filters
 * @param onCheckedChange - The function to call when a filter is unchecked
 * @param reset - The function to call when the "Clear filters" button is clicked
 */
export function CheckedFilters({
  checkedFilters,
  onCheckedChange,
  reset,
}: Props) {
  const hasCheckedFilters = Object.values(checkedFilters).some(
    (checked) => checked.length > 0
  );

  function uncheckFilter(filterName: FilterName, itemName: string) {
    onCheckedChange({ filterName, itemName, checked: false });
  }

  if (!hasCheckedFilters) return null;

  return (
    <Wrapper>
      {Object.entries(checkedFilters).map(([filterName, checked]) => (
        <Fragment key={filterName}>
          {checked.map((itemName) => (
            <CheckedFilter key={itemName}>
              {itemName}
              <CloseButton
                onClick={() =>
                  uncheckFilter(filterName as FilterName, itemName)
                }
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
          onClick={reset}
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
  margin-top: 20px;
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
