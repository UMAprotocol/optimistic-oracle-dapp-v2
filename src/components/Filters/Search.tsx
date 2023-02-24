import SearchIcon from "public/assets/icons/search.svg";
import type { Dispatch, FormEvent, SetStateAction } from "react";
import styled from "styled-components";

interface Props {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
}
/**
 * Component for searching queries
 * @param searchTerm The search term
 * @param setSearchTerm A callback function that is called when the search term is changed
 */
export function Search({ searchTerm, setSearchTerm }: Props) {
  function onInput(e: FormEvent<HTMLInputElement>) {
    setSearchTerm(e.currentTarget.value);
  }

  return (
    <Wrapper>
      <SearchIconWrapper>
        <SearchIcon aria-hidden />
      </SearchIconWrapper>
      <Input
        value={searchTerm}
        onInput={onInput}
        placeholder="Search"
        aria-label="search input"
      />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  top: calc(50% - 12px);
  left: 16px;
`;

const Input = styled.input`
  width: 100%;
  min-height: 48px;
  padding-left: 50px;
  color: var(--blue-grey-500);
  font: var(--body-sm);
  border: 1px solid var(--blue-grey-400);
  border-radius: 24px;

  &::placeholder {
    color: var(--blue-grey-300);
  }
`;
