"use client";

import { RadioDropdown } from "@/components";
import { defaultResultsPerPage, mobileAndUnder } from "@/constants";
import { addOpacityToColor } from "@/helpers";
import PreviousPage from "public/assets/icons/left-chevron.svg";
import NextPage from "public/assets/icons/right-chevron.svg";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

/**
 * @description
 * This component is used to navigate between pages of a list of entries.
 * @param entries - The list of entries to paginate.
 * @param findIndex - The index of the entry to find, if any.
 * @returns
 * An array of entries to show for the current page.
 * All of the props needed to render the pagination component.
 */
export function usePagination<Entry>(entries: Entry[], findIndex?: number) {
  const [entriesToShow, setEntriesToShow] = useState<typeof entries>([]);

  useEffect(() => {
    if (entries.length <= defaultResultsPerPage) {
      setEntriesToShow(entries);
    }
  }, [entries]);

  const [pageNumber, setPageNumber] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(defaultResultsPerPage);
  const numberOfEntries = entries.length;
  const numberOfPages = Math.ceil(numberOfEntries / resultsPerPage);
  const lastPageNumber = numberOfPages;
  const defaultNumberOfButtons = 4;
  const numberOfButtons = getNumberOfButtons();
  const hasMorePagesThanButtons = numberOfPages > numberOfButtons;
  const numbersPastMax = pageNumber - numberOfButtons;
  const isLastNumbers = 2 * numberOfButtons + numbersPastMax > numberOfPages;
  const isFirstNumbers = numbersPastMax <= 0;
  const showFirstButton = hasMorePagesThanButtons;
  const showLastButton =
    hasMorePagesThanButtons &&
    !isLastNumbers &&
    lastPageNumber - 1 !== numberOfButtons;
  const buttonNumbers = makeButtonNumbers();

  const getPageNumberOfItem = useCallback(
    function (itemIndex: number | undefined) {
      if (!itemIndex) return;
      const pageNumber = Math.ceil((itemIndex + 1) / resultsPerPage);

      return pageNumber;
    },
    [resultsPerPage],
  );

  const getEntriesForPage = useCallback(
    function ({
      newPageNumber = pageNumber,
      newResultsPerPage = resultsPerPage,
    }: {
      newPageNumber?: number;
      newResultsPerPage?: number;
    }) {
      const startIndex = (newPageNumber - 1) * newResultsPerPage;
      const endIndex = startIndex + newResultsPerPage;
      return entries.slice(startIndex, endIndex);
    },
    [entries, pageNumber, resultsPerPage],
  );

  const updateEntries = useCallback(
    function (params?: { newPageNumber?: number; newResultsPerPage?: number }) {
      const newPageNumber = params?.newPageNumber ?? pageNumber;
      const newResultsPerPage = params?.newResultsPerPage ?? resultsPerPage;

      setEntriesToShow(getEntriesForPage({ newPageNumber, newResultsPerPage }));
    },
    [getEntriesForPage, pageNumber, resultsPerPage, setEntriesToShow],
  );

  useEffect(() => {
    updateEntries();
  }, [entries, updateEntries]);

  useEffect(() => {
    if (!findIndex || findIndex === -1) return;

    const newPageNumber = getPageNumberOfItem(findIndex);

    if (!newPageNumber) return;

    setPageNumber(newPageNumber);
    updateEntries({ newPageNumber });
  }, [findIndex, resultsPerPage, entries, getPageNumberOfItem, updateEntries]);

  useEffect(() => {
    if (entries.length === 0) {
      setPageNumber(1);
      updateEntries();
      return;
    }

    const newNumberOfPages = Math.ceil(entries.length / resultsPerPage);
    if (pageNumber > newNumberOfPages) {
      const newPageNumber = newNumberOfPages;
      setPageNumber(newPageNumber);
      updateEntries({ newPageNumber });
    } else {
      updateEntries();
    }
  }, [entries, pageNumber, resultsPerPage, updateEntries]);

  function getNumberOfButtons() {
    if (numberOfPages === defaultNumberOfButtons + 1) {
      return defaultNumberOfButtons + 1;
    }
    if (numberOfPages < defaultNumberOfButtons) {
      return numberOfPages;
    }
    return defaultNumberOfButtons;
  }

  function makeButtonNumbers() {
    if (!hasMorePagesThanButtons) {
      return Array.from({ length: numberOfPages }, (_, i) => i + 1);
    }

    if (isLastNumbers) {
      return Array.from(
        { length: numberOfButtons + 1 },
        (_, i) => lastPageNumber - numberOfButtons + i,
      );
    }

    return Array.from({ length: numberOfButtons }, (_, i) => i + 2).map(
      (number) => {
        if (numbersPastMax > 0) {
          return number + numbersPastMax;
        }
        return number;
      },
    );
  }

  function updateEntriesForPageNumber(newPageNumber: number) {
    updateEntries({ newPageNumber });
  }

  function updateResultsPerPage(newResultsPerPage: number) {
    const firstItemIndex = (pageNumber - 1) * resultsPerPage;
    const newPageNumber = Math.ceil((firstItemIndex + 1) / newResultsPerPage);
    setResultsPerPage(newResultsPerPage);
    setPageNumber(newPageNumber);
    updateEntries({ newPageNumber, newResultsPerPage });
  }

  function isPageActive(buttonNumber: number) {
    return buttonNumber === pageNumber;
  }

  function goToPage(number: number) {
    setPageNumber(number);
    updateEntriesForPageNumber(number);
  }

  function goToNextPage() {
    const newPageNumber = pageNumber + 1;
    setPageNumber(newPageNumber);
    updateEntriesForPageNumber(newPageNumber);
  }

  function goToPreviousPage() {
    const newPageNumber = pageNumber - 1;
    setPageNumber(newPageNumber);
    updateEntriesForPageNumber(newPageNumber);
  }

  function goToFirstPage() {
    setPageNumber(1);
    updateEntriesForPageNumber(1);
  }

  function goToLastPage() {
    setPageNumber(lastPageNumber);
    updateEntriesForPageNumber(lastPageNumber);
  }

  return {
    entriesToShow,
    pageNumber,
    goToPage,
    resultsPerPage,
    updateResultsPerPage,
    buttonNumbers,
    showFirstButton,
    goToFirstPage,
    showLastButton,
    goToLastPage,
    isFirstNumbers,
    isPageActive,
    lastPageNumber,
    goToNextPage,
    goToPreviousPage,
  };
}

type Props = Omit<ReturnType<typeof usePagination>, "entriesToShow">;
/**
 * @description Pagination component.
 * Intended to be used with the `usePagination` hook.
 * All of the props come from there.
 * The only omission is the `entriesToShow`, which is the array of entries to be shown on the current page.
 * This is returned from the hook, but is not needed as a prop.
 * @param pageNumber The current page number.
 * @param goToPage A function to go to a specific page.
 * @param resultsPerPage The number of results to show per page.
 * @param updateResultsPerPage A function to update the number of results to show per page.
 * @param buttonNumbers An array of page numbers to show as buttons.
 * @param showFirstButton Whether to show the button to go to the first page.
 * @param goToFirstPage A function to go to the first page.
 * @param showLastButton Whether to show the button to go to the last page.
 * @param goToLastPage A function to go to the last page.
 * @param isFirstNumbers Whether the current page is the first page of the button numbers.
 * @param isPageActive A function to check if a page number is the current page.
 * @param lastPageNumber The last page number.
 * @param goToNextPage A function to go to the next page.
 * @param goToPreviousPage A function to go to the previous page.
 */
export function Pagination({
  pageNumber,
  goToPage,
  resultsPerPage,
  updateResultsPerPage,
  buttonNumbers,
  showFirstButton,
  goToFirstPage,
  showLastButton,
  goToLastPage,
  isFirstNumbers,
  isPageActive,
  lastPageNumber,
  goToNextPage,
  goToPreviousPage,
}: Props) {
  const resultsPerPageOptions = [
    { value: 10, label: "10 results" },
    { value: 20, label: "20 results" },
    { value: 50, label: "50 results" },
  ];

  const selectedResultsPerPage =
    resultsPerPageOptions.find((option) => option.value === resultsPerPage) ??
    resultsPerPageOptions[0];
  return (
    <Wrapper>
      <ResultsPerPageWrapper data-testid="results-per-page">
        <RadioDropdown
          items={resultsPerPageOptions}
          selected={selectedResultsPerPage}
          onSelect={(option) => updateResultsPerPage(Number(option.value))}
        />
      </ResultsPerPageWrapper>
      <ButtonsWrapper data-testid="page-buttons">
        {showFirstButton && (
          <>
            <PageButton
              onClick={goToFirstPage}
              disabled={pageNumber === 1}
              $isActive={isPageActive(1)}
            >
              1
            </PageButton>
            {!isFirstNumbers && <Ellipsis>...</Ellipsis>}
          </>
        )}
        {buttonNumbers.map((buttonNumber) => (
          <PageButton
            key={buttonNumber}
            onClick={() => goToPage(buttonNumber)}
            $isActive={isPageActive(buttonNumber)}
          >
            {buttonNumber}
          </PageButton>
        ))}
        {showLastButton && (
          <>
            <Ellipsis>...</Ellipsis>
            <PageButton
              onClick={goToLastPage}
              $isActive={isPageActive(lastPageNumber)}
            >
              {lastPageNumber}
            </PageButton>
          </>
        )}
        <PreviousPageButton
          onClick={goToPreviousPage}
          disabled={pageNumber === 1}
        >
          <PreviousPage />
        </PreviousPageButton>
        <NextPageButton
          onClick={goToNextPage}
          disabled={pageNumber === lastPageNumber}
        >
          <NextPage />
        </NextPageButton>
      </ButtonsWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media ${mobileAndUnder} {
    flex-direction: column;
    gap: 8px;
    align-items: start;
  }
`;

const ResultsPerPageWrapper = styled.div`
  min-width: 120px;
`;

const ButtonsWrapper = styled.nav`
  display: flex;
  gap: min(8px, 1vw);
`;

const BaseButton = styled.button`
  height: 32px;
  min-width: 32px;
  display: grid;
  place-items: center;
  font: var(--body-sm);
  background: transparent;
  border-radius: 4px;
  transition:
    color var(--animation-duration),
    background var(--animation-duration);
`;

const PageButton = styled(BaseButton)<{ $isActive: boolean }>`
  border: 1px solid var(--blue-grey-500);
  color: ${({ $isActive }) =>
    $isActive ? "var(--white)" : "var(--blue-grey-500)"};
  background: ${({ $isActive }) =>
    $isActive ? "var(--blue-grey-500)" : "transparent"};
  &:hover {
    ${({ $isActive }) =>
      $isActive
        ? ""
        : `background: ${addOpacityToColor("var(--blue-grey-500)", 0.1)};`}
  }
`;

const NavigationButton = styled(BaseButton)`
  &:hover {
    background: ${addOpacityToColor("var(--blue-grey-500)", 0.1)};
  }
  &:disabled {
    opacity: 0.5;
  }
`;

const PreviousPageButton = styled(NavigationButton)``;

const NextPageButton = styled(NavigationButton)``;

const Ellipsis = styled.span`
  height: min-content;
  margin-top: auto;
  font: var(--body-sm);
`;
