import { CheckboxDropdown } from "@/components";
import type { Filter, FilterOnCheckedChange, Filters } from "@/types";

interface Props {
  filters: Filters;
  onCheckedChange: FilterOnCheckedChange;
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
          title={filterName}
          items={items}
          onCheckedChange={({ ...args }) =>
            onCheckedChange({ ...args, filterName: filterName as Filter })
          }
        />
      ))}
    </>
  );
}
