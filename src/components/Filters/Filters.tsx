import { hideOnMobileAndUnder, showOnMobileAndUnder } from "@/helpers";
import type {
  CheckboxItems,
  CheckboxState,
  Filter,
  FilterOptions,
  Filters,
} from "@/types";
import { cloneDeep } from "lodash";
import Sliders from "public/assets/icons/sliders.svg";
import { Dispatch, SetStateAction, useState } from "react";
import styled from "styled-components";
import { CheckedFilters } from "./CheckedFilters";
import { Dropdowns } from "./Dropdowns";
import { MobileFilters } from "./MobileFilters";
import { Search } from "./Search";

interface Props {
  expiry: FilterOptions;
  projects: FilterOptions;
  chains: FilterOptions;
}
/**
 * Shows checkboxes for the different filters.
 * @param expiry The expiry filter options.
 * @param projects The projects filter options.
 * @param chains The chains filter options.
 */
export function Filters({ expiry, projects, chains }: Props) {
  const [checkedExpiry, setCheckedExpiry] = useState<CheckboxItems>(
    makeCheckboxItems(expiry)
  );

  const [checkedProjects, setCheckedProjects] = useState<CheckboxItems>(
    makeCheckboxItems(projects)
  );

  const [checkedChains, setCheckedChains] = useState<CheckboxItems>(
    makeCheckboxItems(chains)
  );

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filters: Filters = {
    expiry: checkedExpiry,
    projects: checkedProjects,
    chains: checkedChains,
  };

  const setters: Record<Filter, Dispatch<SetStateAction<CheckboxItems>>> = {
    expiry: setCheckedExpiry,
    projects: setCheckedProjects,
    chains: setCheckedChains,
  };

  function makeCheckboxItems(filter: FilterOptions) {
    const clone = cloneDeep(filter);
    const totalCount = Object.values(filter).reduce(
      (acc, { count }) => acc + count,
      0
    );

    return {
      All: {
        checked: true,
        count: totalCount,
      },
      ...clone,
    };
  }

  function uncheckFilter(filter: Filter, itemName: string) {
    onCheckedChange({
      filter,
      checked: false,
      itemName,
    });
  }

  function resetCheckedFilters() {
    setCheckedExpiry(makeCheckboxItems(expiry));
    setCheckedProjects(makeCheckboxItems(projects));
    setCheckedChains(makeCheckboxItems(chains));
  }

  function onCheckedChange({
    filter,
    checked,
    itemName,
  }: {
    filter: Filter;
    checked: CheckboxState;
    itemName: string;
  }) {
    const items = filters[filter];
    const setter = setters[filter];
    const newItems = cloneDeep(items);
    const hasItemsOtherThanAllChecked = Object.entries(items).some(
      ([name, { checked }]) => name !== "All" && checked
    );

    if (itemName === "All") {
      // if all is checked, we cannot let the user uncheck it without having at least one other item checked
      if (!hasItemsOtherThanAllChecked) return;

      // if all is checked, uncheck all other items
      Object.keys(newItems).forEach((name) => {
        newItems[name].checked = false;
      });

      newItems["All"].checked = true;
      setter(newItems);

      return;
    }

    // if we are unchecking the only remaining checked item, check all
    if (!checked && isTheOnlyItemChecked(itemName, items)) {
      newItems[itemName].checked = false;
      newItems["All"].checked = true;

      setter(newItems);

      return;
    }

    // if we are checking an item, uncheck all
    newItems["All"].checked = false;
    newItems[itemName].checked = checked;

    setter(newItems);
  }

  function isTheOnlyItemChecked(itemName: string, items: CheckboxItems) {
    return (
      Object.entries(items).filter(
        ([key, { checked }]) => key !== itemName && checked
      ).length === 0
    );
  }

  function openMobileFilters() {
    setMobileFiltersOpen(true);
  }

  function closeMobileFilters() {
    setMobileFiltersOpen(false);
  }

  return (
    <OuterWrapper>
      <InnerWrapper>
        <DesktopWrapper>
          <InputsWrapper>
            <Search />
            <Dropdowns filters={filters} onCheckedChange={onCheckedChange} />
          </InputsWrapper>
          <CheckedFiltersWrapper>
            <CheckedFilters
              filters={filters}
              uncheckFilter={uncheckFilter}
              resetCheckedFilters={resetCheckedFilters}
            />
          </CheckedFiltersWrapper>
        </DesktopWrapper>
        <MobileWrapper>
          <Search />
          <OpenMobileFiltersButton
            onClick={openMobileFilters}
            aria-label="open filters"
          >
            <SlidersIcon />
          </OpenMobileFiltersButton>
          <MobileFilters
            panelOpen={mobileFiltersOpen}
            closePanel={closeMobileFilters}
            filters={filters}
            onCheckedChange={onCheckedChange}
            resetCheckedFilters={resetCheckedFilters}
          />
        </MobileWrapper>
      </InnerWrapper>
    </OuterWrapper>
  );
}

const OuterWrapper = styled.div`
  min-height: 96px;
  background: var(--white);
  display: flex;
  align-items: center;
`;

const DesktopWrapper = styled.div`
  ${hideOnMobileAndUnder}
`;

const MobileWrapper = styled.div`
  --display: grid;
  grid-template-columns: 1fr auto;
  gap: 24px;
  ${showOnMobileAndUnder}
`;

const InnerWrapper = styled.div`
  width: var(--page-width);
  padding: var(--page-padding);
  margin-inline: auto;
`;

const InputsWrapper = styled.div`
  display: grid;
  gap: 18px;
  grid-template-columns: 2fr repeat(3, 1fr);
`;

const CheckedFiltersWrapper = styled.div`
  margin-block: 20px;
`;

const OpenMobileFiltersButton = styled.button`
  background: transparent;
`;

const SlidersIcon = styled(Sliders)``;
