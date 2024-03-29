"use client";

import { hideOnMobileAndUnder, showOnMobileAndUnder } from "@/helpers";
import { useFilterAndSearchContext } from "@/hooks";
import Sliders from "public/assets/icons/sliders.svg";
import { useState } from "react";
import styled from "styled-components";
import { CheckedFilters } from "./CheckedFilters";
import { Dropdowns } from "./Dropdowns";
import { MobileFilters } from "./MobileFilters";
import { Search } from "./Search";

export function Filters() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const {
    filters,
    checkedFilters,
    onCheckedChange,
    reset,
    searchTerm,
    setSearchTerm,
  } = useFilterAndSearchContext();

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
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <Dropdowns filters={filters} onCheckedChange={onCheckedChange} />
          </InputsWrapper>
          <CheckedFilters
            checkedFilters={checkedFilters}
            onCheckedChange={onCheckedChange}
            reset={reset}
          />
        </DesktopWrapper>
        <MobileWrapper>
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
            reset={reset}
          />
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </MobileWrapper>
      </InnerWrapper>
    </OuterWrapper>
  );
}

const OuterWrapper = styled.div`
  padding-block: 20px;
  background: var(--white);
  display: flex;
  align-items: center;
`;

const DesktopWrapper = styled.div`
  ${hideOnMobileAndUnder}
`;

const MobileWrapper = styled.div`
  --display: grid;
  grid-template-columns: auto 1fr;
  gap: 24px;
  ${showOnMobileAndUnder}
`;

const InnerWrapper = styled.div`
  width: var(--page-width);
  padding-inline: var(--page-padding);
  margin-inline: auto;
`;

const InputsWrapper = styled.div`
  display: grid;
  gap: 18px;
  grid-template-columns: 2fr repeat(3, 1fr);
`;

const OpenMobileFiltersButton = styled.button`
  background: transparent;
`;

const SlidersIcon = styled(Sliders)``;
