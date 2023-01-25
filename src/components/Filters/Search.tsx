import SearchIcon from "public/assets/search.svg";
import { FormEvent, useState } from "react";
import styled from "styled-components";

export function Search() {
  const [_input, setInput] = useState("");

  function onInput(e: FormEvent<HTMLInputElement>) {
    setInput(e.currentTarget.value);
  }

  return (
    <Wrapper>
      <SearchIconWrapper>
        <SearchIcon aria-hidden />
      </SearchIconWrapper>
      <Input placeholder="Search" onInput={onInput} aria-label="search input" />
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
  min-width: 426px;
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
