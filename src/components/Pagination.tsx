import { RadioDropdown } from "@/components";
import {
  blueGrey500,
  defaultResultsPerPage,
  mobileAndUnder,
  white,
} from "@/constants";
import { addOpacityToHsl } from "@/helpers";
import PreviousPage from "public/assets/icons/left-chevron.svg";
import NextPage from "public/assets/icons/right-chevron.svg";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useWindowSize } from "usehooks-ts";

interface Props<Entry> {
  entries: Entry[];
  setEntriesToShow: (entries: Entry[]) => void;
}
export function Pagination<Entry>({ entries, setEntriesToShow }: Props<Entry>) {
  const [pageNumber, setPageNumber] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(defaultResultsPerPage);
  const { width } = useWindowSize();
  const [wrapperWidth, setWrapperWidth] = useState(0);
  const [buttonsWrapperWidth, setButtonsWrapperWidth] = useState(0);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonsWrapperRef = useRef<HTMLDivElement>(null);
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

  console.log({ numberOfButtons, numberOfPages, buttonNumbers, pageNumber });

  useEffect(() => {
    updateEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (wrapperRef.current) {
      setWrapperWidth(wrapperRef.current.offsetWidth);
    }
    if (buttonsWrapperRef.current) {
      setButtonsWrapperWidth(buttonsWrapperRef.current.offsetWidth);
    }
  }, [buttonsWrapperRef, width]);

  function getNumberOfButtons() {
    if (wrapperWidth >= buttonsWrapperWidth) {
      if (numberOfPages === defaultNumberOfButtons + 1) {
        return defaultNumberOfButtons + 1;
      }
      if (numberOfPages < defaultNumberOfButtons) {
        return numberOfPages;
      }
      if (numberOfPages > defaultNumberOfButtons) {
        return defaultNumberOfButtons;
      }
    }

    const buttonWidth = 40;
    const nextAndBackButtonsWidth = 2 * buttonWidth;
    const firstAndLastButtonsWidth = 2 * buttonWidth;
    const ellipsisWidth = 8;

    const availableSpace =
      wrapperWidth -
      nextAndBackButtonsWidth -
      (hasMorePagesThanButtons ? firstAndLastButtonsWidth + ellipsisWidth : 0);

    const numberOfButtonsThatFit = Math.floor(availableSpace / buttonWidth);

    return numberOfButtonsThatFit;
  }

  function makeButtonNumbers() {
    if (!hasMorePagesThanButtons) {
      return Array.from({ length: numberOfPages }, (_, i) => i + 1);
    }

    if (isLastNumbers) {
      return Array.from(
        { length: numberOfButtons + 1 },
        (_, i) => lastPageNumber - numberOfButtons + i
      );
    }

    return Array.from({ length: numberOfButtons }, (_, i) => i + 2).map(
      (number) => {
        if (numbersPastMax > 0) {
          return number + numbersPastMax;
        }
        return number;
      }
    );
  }

  function updateEntriesForPageNumber(newPageNumber: number) {
    updateEntries({ newPageNumber });
  }

  function updateResultsPerPage(newResultsPerPage: number) {
    setResultsPerPage(newResultsPerPage);
    const newPageNumber = Math.ceil(
      (pageNumber * resultsPerPage) / newResultsPerPage
    );
    setEntriesToShow(getEntriesForPage({ newPageNumber, newResultsPerPage }));
    setPageNumber(newPageNumber);
  }

  function updateEntries(params?: {
    newPageNumber?: number;
    newResultsPerPage?: number;
  }) {
    const newPageNumber = params?.newPageNumber ?? pageNumber;
    const newResultsPerPage = params?.newResultsPerPage ?? resultsPerPage;

    setEntriesToShow(getEntriesForPage({ newPageNumber, newResultsPerPage }));
  }

  function getEntriesForPage({
    newPageNumber = pageNumber,
    newResultsPerPage = resultsPerPage,
  }: {
    newPageNumber?: number;
    newResultsPerPage?: number;
  }) {
    const startIndex = (newPageNumber - 1) * newResultsPerPage;
    const endIndex = startIndex + newResultsPerPage;
    return entries.slice(startIndex, endIndex);
  }

  function isActive(buttonNumber: number) {
    return buttonNumber === pageNumber;
  }

  function goToPage(number: number) {
    setPageNumber(number);
    updateEntriesForPageNumber(number);
  }

  function nextPage() {
    const newPageNumber = pageNumber + 1;
    setPageNumber(newPageNumber);
    updateEntriesForPageNumber(newPageNumber);
  }

  function prevPage() {
    const newPageNumber = pageNumber - 1;
    setPageNumber(newPageNumber);
    updateEntriesForPageNumber(newPageNumber);
  }

  function firstPage() {
    setPageNumber(1);
    updateEntriesForPageNumber(1);
  }

  function lastPage() {
    setPageNumber(lastPageNumber);
    updateEntriesForPageNumber(lastPageNumber);
  }

  const resultsPerPageOptions = [
    { value: 10, label: "10 results" },
    { value: 20, label: "20 results" },
    { value: 50, label: "50 results" },
  ];

  function getSelectedResultsPerPage() {
    return (
      resultsPerPageOptions.find((option) => option.value === resultsPerPage) ??
      resultsPerPageOptions[0]
    );
  }

  return (
    <Wrapper ref={wrapperRef}>
      <ResultsPerPageWrapper>
        <RadioDropdown
          items={resultsPerPageOptions}
          selected={getSelectedResultsPerPage()}
          onSelect={(option) => updateResultsPerPage(Number(option.value))}
        />
      </ResultsPerPageWrapper>
      <ButtonsWrapper ref={buttonsWrapperRef}>
        {showFirstButton && (
          <>
            <PageButton
              onClick={firstPage}
              disabled={pageNumber === 1}
              $isActive={isActive(1)}
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
            $isActive={isActive(buttonNumber)}
          >
            {buttonNumber}
          </PageButton>
        ))}
        {showLastButton && (
          <>
            <Ellipsis>...</Ellipsis>
            <PageButton onClick={lastPage} $isActive={isActive(lastPageNumber)}>
              {lastPageNumber}
            </PageButton>
          </>
        )}
        <PreviousPageButton onClick={prevPage} disabled={pageNumber === 1}>
          <PreviousPage />
        </PreviousPageButton>
        <NextPageButton
          onClick={nextPage}
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
    gap: 10px;
    align-items: start;
  }
`;

const ResultsPerPageWrapper = styled.div`
  width: 120px;
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
  font: var(--text-sm);
  color: var(--grey-800);
  background: transparent;
  border-radius: 5px;
  transition: color 200ms, background 200ms;
`;

const PageButton = styled(BaseButton)<{ $isActive: boolean }>`
  border: 1px solid var(--grey-800);
  color: ${({ $isActive }) => ($isActive ? white : blueGrey500)};
  background: ${({ $isActive }) => ($isActive ? blueGrey500 : "transparent")};
  &:hover {
    ${({ $isActive }) =>
      $isActive ? "" : `background: ${addOpacityToHsl(blueGrey500, 0.1)};`}
  }
`;

const NavigationButton = styled(BaseButton)`
  &:hover {
    background: ${addOpacityToHsl(blueGrey500, 0.1)};
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
  font: var(--text-sm);
  color: var(--grey-800);
`;
