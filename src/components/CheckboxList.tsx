import { Checkbox } from "@/components";
import { addOpacityToColor, makeFilterTitle } from "@/helpers";
import type {
  CheckboxItemsByFilterName,
  FilterName,
  OnCheckedChange,
} from "@/types";
import styled from "styled-components";

interface Props {
  filters: CheckboxItemsByFilterName;
  onCheckedChange: OnCheckedChange;
}
/**
 * A list of checkboxes that is used in the filters component.
 * @param filters The filters that are used to create the checkboxes.
 * @param onCheckedChange A callback function that is called when a checkbox is checked or unchecked.
 */
export function CheckboxList({ filters, onCheckedChange }: Props) {
  return (
    <Wrapper>
      {Object.entries(filters).map(([filterName, items]) => (
        <CheckboxesWrapper key={filterName}>
          <Title>{makeFilterTitle(filterName)}</Title>
          {Object.entries(items).map(([itemName, { checked, count }]) => (
            <Checkbox
              key={itemName}
              checked={checked}
              itemName={itemName}
              count={count}
              onCheckedChange={({ ...args }) =>
                onCheckedChange({
                  ...args,
                  filterName: filterName as FilterName,
                })
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
`;

const CheckboxesWrapper = styled.div`
  &:not(:last-child) {
    margin-bottom: 12px;
    padding-bottom: 16px;
    border-bottom: 1px solid ${addOpacityToColor("var(--blue-grey-700)", 0.25)};
  }
  &:is(:last-child) {
    margin-bottom: 28px;
  }
`;
