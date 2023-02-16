import {
  Button,
  CheckboxDropdown,
  CheckboxList,
  MobileFilters,
  Search,
} from "@/components";
import { hideOnMobileAndUnder, showOnMobileAndUnder } from "@/helpers";
import type {
  CheckboxItems,
  CheckboxState,
  Filter,
  FilterOptions,
  Filters,
} from "@/types";
import { cloneDeep } from "lodash";
import Close from "public/assets/icons/close.svg";
import Sliders from "public/assets/icons/sliders.svg";
import { Dispatch, Fragment, SetStateAction, useState } from "react";
import styled from "styled-components";

interface Props {
  expiry: FilterOptions;
  projects: FilterOptions;
  chains: FilterOptions;
}
/**
 * Shows checkboxes for the different filters.
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

  const checkedFilters: { filter: Filter; checked: string[] }[] = [
    {
      filter: "expiry",
      checked: getObjectKeysWhereCheckedIsTrue(checkedExpiry),
    },
    {
      filter: "projects",
      checked: getObjectKeysWhereCheckedIsTrue(checkedProjects),
    },
    {
      filter: "chains",
      checked: getObjectKeysWhereCheckedIsTrue(checkedChains),
    },
  ];

  const hasCheckedFilters = checkedFilters.some(
    ({ checked }) => checked.length > 0
  );

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

  function getObjectKeysWhereCheckedIsTrue(obj: CheckboxItems) {
    return Object.keys(obj).filter((key) => key !== "All" && obj[key].checked);
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
            {Object.entries(filters).map(([filter, items]) => (
              <CheckboxDropdown
                key={filter}
                title={filter}
                items={items}
                onCheckedChange={({ ...args }) =>
                  onCheckedChange({ ...args, filter: filter as Filter })
                }
              />
            ))}
          </InputsWrapper>
          <CheckedFiltersWrapper>
            {checkedFilters.map(({ filter, checked }) => (
              <Fragment key={filter}>
                {checked.map((name) => (
                  <CheckedFilter key={name}>
                    {name}
                    <RemoveFilterButton
                      onClick={() => uncheckFilter(filter, name)}
                      aria-label="Remove filter"
                    >
                      <CloseIcon />
                    </RemoveFilterButton>
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
            resetCheckedFilters={resetCheckedFilters}
          >
            <CheckboxList filters={filters} onCheckedChange={onCheckedChange} />
          </MobileFilters>
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
  display: flex;
  gap: 8px;
  margin-block: 20px;
  ${hideOnMobileAndUnder}
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

const RemoveFilterButton = styled.button`
  width: 10px;
  height: 10px;
  background: transparent;
  path {
    fill: var(--dark-text);
  }
`;

const OpenMobileFiltersButton = styled.button`
  background: transparent;
`;

const CloseIcon = styled(Close)``;

const SlidersIcon = styled(Sliders)``;
