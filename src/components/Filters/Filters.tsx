import { useState } from "react";
import styled from "styled-components";
import { CheckboxDropdown, Items } from "./CheckboxDropdown";
import { Search } from "./Search";

export function Filters() {
  const [checkedTypes, setCheckedTypes] = useState<Items>({
    All: {
      checked: true,
      count: 256,
    },
    "Event-Based": {
      checked: false,
      count: 128,
    },
    "Time-Based": {
      checked: false,
      count: 128,
    },
  });

  const [checkedProjects, setCheckedProjects] = useState<Items>({
    All: {
      checked: true,
      count: 256,
    },
    Polymarket: {
      checked: false,
      count: 128,
    },
    UMA: {
      checked: false,
      count: 12,
    },
    "Cozy Finance": {
      checked: false,
      count: 50,
    },
    "stake.com": {
      checked: false,
      count: 0,
    },
  });

  const [checkedChains, setCheckedChains] = useState<Items>({
    All: {
      checked: true,
      count: 256,
    },
    Ethereum: {
      checked: false,
      count: 128,
    },
    Polygon: {
      checked: false,
      count: 12,
    },
    Optimism: {
      checked: false,
      count: 50,
    },
    Boba: {
      checked: false,
      count: 0,
    },
  });

  return (
    <Wrapper>
      <Search />
      <CheckboxDropdown
        title="Types"
        items={checkedTypes}
        setChecked={setCheckedTypes}
      />
      <CheckboxDropdown
        title="Projects"
        items={checkedProjects}
        setChecked={setCheckedProjects}
      />
      <CheckboxDropdown
        title="Chains"
        items={checkedChains}
        setChecked={setCheckedChains}
      />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  min-height: 96px;
  display: flex;
  align-items: center;
  gap: 18px;
  background: var(--white);
`;
