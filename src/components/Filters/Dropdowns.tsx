import { CheckboxDropdown } from "@/components";
import { makeFilterTitle } from "@/helpers";
import type {
  CheckboxItemsByFilterName,
  FilterName,
  OnCheckedChange,
} from "@/types";

interface Props {
  filters: CheckboxItemsByFilterName;
  onCheckedChange: OnCheckedChange;
}
/**
 * A set of dropdown menus for selecting filters.
 * Only shown on desktop.
 * @param filters The filters that are used to create the dropdown menus.
 * @param onCheckedChange A callback function that is called when a checkbox is checked or unchecked.
 */
export function Dropdowns({ filters, onCheckedChange }: Props) {
  return (
    <>
      {Object.entries(filters).map(([filterName, items]) => (
        <CheckboxDropdown
          key={filterName}
          title={makeFilterTitle(filterName)}
          items={items}
          onCheckedChange={({ ...args }) =>
            onCheckedChange({ ...args, filterName: filterName as FilterName })
          }
        />
      ))}
    </>
  );
}
