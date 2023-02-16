import styled from "styled-components";
import { Button } from "../Button";
import { CheckedState } from "../Dropdown/CheckboxDropdown";
import { Filter, Filters } from "../Filters/Filters";
import { Checkbox } from "./Checkbox";

interface Props {
  filters: Filters;
  onCheckedChange: ({
    filter,
    checked,
    itemName,
  }: {
    filter: Filter;
    checked: CheckedState;
    itemName: string;
  }) => void;
  resetCheckedFilters: () => void;
}
export function CheckboxList({
  filters,
  onCheckedChange,
  resetCheckedFilters,
}: Props) {
  return (
    <Wrapper>
      {Object.entries(filters).map(([filter, items]) => (
        <CheckboxesWrapper key={filter}>
          <Title>{filter}</Title>
          {Object.entries(items).map(([itemName, { checked, count }]) => (
            <Checkbox
              key={itemName}
              checked={checked}
              itemName={itemName}
              count={count}
              onCheckedChange={({ ...args }) =>
                onCheckedChange({ ...args, filter: filter as Filter })
              }
            />
          ))}
        </CheckboxesWrapper>
      ))}
      <Button variant="secondary" onClick={resetCheckedFilters}>
        Reset filters
      </Button>
    </Wrapper>
  );
}

const Wrapper = styled.div``;

const Title = styled.h2``;

const CheckboxesWrapper = styled.div``;
