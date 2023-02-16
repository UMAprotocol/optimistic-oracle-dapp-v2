import { blueGrey700 } from "@/constants";
import { addOpacityToHsla } from "@/helpers";
import type { CheckboxState, Filter, Filters } from "@/types";
import styled from "styled-components";
import { Checkbox } from "./Checkbox";

interface Props {
  filters: Filters;
  onCheckedChange: ({
    filter,
    checked,
    itemName,
  }: {
    filter: Filter;
    checked: CheckboxState;
    itemName: string;
  }) => void;
}
/**
 * A list of checkboxes that is used in the filters component.
 * @param filters The filters that are used to create the checkboxes.
 * @param onCheckedChange A callback function that is called when a checkbox is checked or unchecked.
 */
export function CheckboxList({ filters, onCheckedChange }: Props) {
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
    </Wrapper>
  );
}

const Wrapper = styled.div``;

const Title = styled.h2`
  margin-bottom: 12px;
  font: var(--body-sm);
  color: var(--blue-grey-500);
  text-transform: capitalize;
`;

const CheckboxesWrapper = styled.div`
  &:not(:last-child) {
    margin-bottom: 12px;
    padding-bottom: 16px;
    border-bottom: 1px solid ${addOpacityToHsla(blueGrey700, 0.25)};
  }
  &:is(:last-child) {
    margin-bottom: 28px;
  }
`;
